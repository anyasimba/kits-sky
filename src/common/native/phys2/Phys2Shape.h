#pragma once
#include ".common.h"
#include "Phys2Body.h"

#define MaxPolyVertexCount 1024

struct Phys2Shape: Native {
    enum Type {
        eCircle,
        ePoly,
        eCount
    };

    Phys2Shape() {}
    virtual void initialize(real density) = 0;
    virtual void computeMass(real density) = 0;
    virtual void setOrient(real radians) = 0;
    virtual Type getType() const = 0;
    virtual AABB3 aabb () const = 0;

    Phys2Body* body;

    // For circle shape
    real radius;

    // For Polygon shape
    mat2 u; // Orientation matrix from model to world
};

struct Phys2Circle: Phys2Shape {
    void initialize(real density) {
        computeMass(density);
    }

    void computeMass(real density) {
        body->m = M_PI*radius*radius*density;
        body->im = (body->m) ? 1.0f/body->m : 0.0f;
        body->I = body->m*radius*radius;
        body->iI = (body->I) ? 1.0f/body->I : 0.0f;
    }

    void setOrient(real radians) {}

    Type getType(void) const {
        return eCircle;
    }

    AABB3 aabb() const {
        AABB3 aabb;
        aabb.xb = body->position.x - radius;
        aabb.yb = body->position.y - radius;
        aabb.xe = body->position.x + radius;
        aabb.ye = body->position.y + radius;
        return aabb;
    }
};
BINDING(Phys2Circle) {
    BIND_CLASS(Phys2Circle, ());
    BIND_CLASS_METHOD_VOID(Phys2Circle, initialize, (density), ARG(1, real, density));
    BIND_CLASS_PROP(Phys2Circle, real, radius);
}

struct Phys2Polygon: Phys2Shape {
    void initialize(real density) {
        computeMass(density);
    }

    void computeMass(real density) {
        // Calculate centroid and moment of interia
        // vec2 c(0.0f, 0.0f); // centroid
        real area = 0.0f;
        real I = 0.0f;
        const real k_inv3 = 1.0f/3.0f;

        for(uint32_t i1 = 0; i1 < m_vertexCount; ++i1) {
            // Triangle vertices, third vertex implied as (0, 0)
            vec2 p1(m_vertices[i1]);
            uint32_t i2 = i1 + 1 < m_vertexCount ? i1 + 1 : 0;
            vec2 p2(m_vertices[i2]);

            real D = cross(p1, p2);
            real triangleArea = 0.5f * D;

            area += triangleArea;

            // // Use area to weight the centroid average, not just vertex position
            // c += triangleArea * k_inv3 * (p1 + p2);

            real intx2 = p1.x * p1.x + p2.x * p1.x + p2.x * p2.x;
            real inty2 = p1.y * p1.y + p2.y * p1.y + p2.y * p2.y;
            I += (0.25f * k_inv3 * D) * (intx2 + inty2);
        }

        // c *= 1.0f / area;

        // // Translate vertices to centroid (make the centroid (0, 0)
        // // for the polygon in model space)
        // // Not really necessary, but I like doing this anyway
        // for(uint32_t i = 0; i < m_vertexCount; ++i)
        //     m_vertices[i] -= c;

        body->m = density*area;
        body->im = (body->m) ? 1.0f/body->m : 0.0f;
        body->I = I*density;
        body->iI = body->I ? 1.0f/body->I : 0.0f;
    }

    void setOrient(real radians) {
        u.set(radians);
    }

    Type getType(void) const {
        return ePoly;
    }

    AABB3 aabb() const {
        AABB3 aabb;
        vec2 v = m_vertices[0];
        v = u*v + body->position;
        aabb.xb = v.x;
        aabb.yb = v.y;
        aabb.xe = v.x;
        aabb.ye = v.y;
        
        for(uint32_t i = 1; i < m_vertexCount; ++i) {
            vec2 v = m_vertices[i];
            v = u*v;
            v = v + body->position;
            aabb.xb = fmin(aabb.xb, v.x);
            aabb.yb = fmin(aabb.yb, v.y);
            aabb.xe = fmax(aabb.xe, v.x);
            aabb.ye = fmax(aabb.ye, v.y);
        }
        return aabb;
    }

    void setVertices(Array<vec2> vertices) {
        // No hulls with less than 3 vertices (ensure actual polygon)
        assert(vertices.size() > 2 && vertices.size() <= MaxPolyVertexCount);
        auto count = std::min((int32_t)vertices.size(), MaxPolyVertexCount);

        // Find the right most point on the hull
        int32_t rightMost = 0;
        real highestXCoord = vertices[0].x;
        for(uint32_t i = 1; i < vertices.size(); ++i) {
            real x = vertices[i].x;
            if (x > highestXCoord) {
                highestXCoord = x;
                rightMost = i;
            } else if (x == highestXCoord) // If matching x then take farthest negative y
                if(vertices[i].y < vertices[rightMost].y)
                    rightMost = i;
        }

        int32_t hull[MaxPolyVertexCount];
        int32_t outCount = 0;
        int32_t indexHull = rightMost;

        for (;;) {
            hull[outCount] = indexHull;

            // Search for next index that wraps around the hull
            // by computing cross products to find the most counter-clockwise
            // vertex in the set, given the previos hull index
            int32_t nextHullIndex = 0;
            for(int32_t i = 1; i < (int32_t)count; ++i) {
                // Skip if same coordinate as we need three unique
                // points in the set to perform a cross product
                if(nextHullIndex == indexHull) {
                    nextHullIndex = i;
                    continue;
                }

                // Cross every set of three unique vertices
                // Record each counter clockwise third vertex and add
                // to the output hull
                vec2 e1 = vertices[nextHullIndex] - vertices[hull[outCount]];
                vec2 e2 = vertices[i] - vertices[hull[outCount]];
                real c = cross(e1, e2);
                if(c < 0.0f)
                    nextHullIndex = i;

                // Cross product is zero then e vectors are on same line
                // therefor want to record vertex farthest along that line
                if(c == 0.0f && e2.lenSqr() > e1.lenSqr())
                    nextHullIndex = i;
            }
            
            ++outCount;
            indexHull = nextHullIndex;

            // Conclude algorithm upon wrap-around
            if(nextHullIndex == rightMost) {
                m_vertexCount = outCount;
                break;
            }
        }

        // Copy vertices into shape's vertices
        for (uint32_t i = 0; i < m_vertexCount; ++i)
            m_vertices[i] = vertices[hull[i]];

        // Compute face normals
        for (uint32_t i1 = 0; i1 < m_vertexCount; ++i1) {
            uint32_t i2 = i1 + 1 < m_vertexCount ? i1 + 1 : 0;
            vec2 face = m_vertices[i2] - m_vertices[i1];

            // Ensure no zero-length edges, because that's bad
            assert(face.lenSqr() > FLT_EPSILON * FLT_EPSILON);

            // Calculate normal with 2D cross product between vector and scalar
            m_normals[i1] = vec2(face.y, -face.x);
            m_normals[i1] = m_normals[i1].unit();
        }
    }

    // The extreme point along a direction within a polygon
    vec2 getSupport(const vec2& dir) {
        real bestProjection = -FLT_MAX;
        vec2 bestVertex;

        for (uint32_t i = 0; i < m_vertexCount; ++i) {
            vec2 v = m_vertices[i];
            real projection = dot(v, dir);

            if (projection > bestProjection) {
                bestVertex = v;
                bestProjection = projection;
            }
        }

        return bestVertex;
    }

    uint32_t m_vertexCount;
    vec2 m_vertices[MaxPolyVertexCount];
    vec2 m_normals[MaxPolyVertexCount];
};
BINDING(Phys2Polygon) {
    BIND_CLASS(Phys2Polygon, ());
    BIND_CLASS_METHOD_VOID(Phys2Polygon, initialize, (density), ARG(1, real, density));
    BIND_CLASS_METHOD_VOID(Phys2Polygon, setVertices, (vertices), ARG(1, Array<vec2>, vertices));
}
