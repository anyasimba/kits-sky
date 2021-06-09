#pragma once
#include "@common.h"
#include "Phys2Shape.h"

struct Phys2Manifold;
struct Phys2Body;

typedef void (*Phys2CollisionCallback)(Phys2Manifold* m, Phys2Body* a, Phys2Body* b);

extern Phys2CollisionCallback Phys2Dispatch[Phys2Shape::eCount][Phys2Shape::eCount];

void Phys2CircleToCircle(Phys2Manifold *m, Phys2Body *a, Phys2Body *b);
void Phys2CircleToPolygon(Phys2Manifold *m, Phys2Body *a, Phys2Body *b);
void Phys2PolygonToCircle(Phys2Manifold *m, Phys2Body *a, Phys2Body *b);
void Phys2PolygonToPolygon(Phys2Manifold *m, Phys2Body *a, Phys2Body *b);

Phys2CollisionCallback Dispatch[Phys2Shape::eCount][Phys2Shape::eCount] = {
    {
        Phys2CircleToCircle, Phys2CircleToPolygon
    },
    {
        Phys2PolygonToCircle, Phys2PolygonToPolygon
    },
};

void Phys2CircleToCircle(Phys2Manifold* m, Phys2Body* a, Phys2Body* b) {
    Phys2Circle* A = reinterpret_cast<Phys2Circle*>(a->shape);
    Phys2Circle* B = reinterpret_cast<Phys2Circle*>(b->shape);

    // Calculate translational vector, which is normal
    vec2 normal = b->position - a->position;

    real dist_sqr = normal.lenSqr();
    real radius = A->radius + B->radius;

    // Not in contact
    if (dist_sqr >= radius * radius) {
        m->contact_count = 0;
        return;
    }

    real distance = std::sqrt(dist_sqr);

    m->contact_count = 1;

    if (distance == 0.0f) {
        m->penetration = A->radius;
        m->normal = vec2(1, 0);
        m->contacts [0] = a->position;
    } else {
        m->penetration = radius - distance;
        m->normal = normal / distance; // Faster than using Normalized since we already performed sqrt
        m->contacts[0] = m->normal * A->radius + a->position;
    }
}

void Phys2CircleToPolygon(Phys2Manifold* m, Phys2Body* a, Phys2Body* b) {
    Phys2Circle* A  = reinterpret_cast<Phys2Circle*>(a->shape);
    Phys2Polygon* B = reinterpret_cast<Phys2Polygon*>(b->shape);

    m->contact_count = 0;

    // Transform circle center to Polygon model space
    vec2 center = a->position;
    center = B->u.transpose()*(center - b->position);

    // Find edge with minimum penetration
    // Exact concept as using support points in Polygon vs Polygon
    real separation = -FLT_MAX;
    uint32_t faceNormal = 0;
    for(uint32_t i = 0; i < B->m_vertexCount; ++i) {
        real s = dot(B->m_normals[i], center - B->m_vertices[i]);

        if(s > A->radius)
            return;

        if(s > separation)
        {
            separation = s;
            faceNormal = i;
        }
    }

    // Grab face's vertices
    vec2 v1 = B->m_vertices[faceNormal];
    uint32_t i2 = faceNormal + 1 < B->m_vertexCount ? faceNormal + 1 : 0;
    vec2 v2 = B->m_vertices[i2];

    // Check to see if center is within polygon
    if(separation < FLT_EPSILON) {
        m->contact_count = 1;
        m->normal = -(B->u * B->m_normals[faceNormal]);
        m->contacts[0] = m->normal * A->radius + a->position;
        m->penetration = A->radius;
        return;
    }

    // Determine which voronoi region of the edge center of circle lies within
    real dot1 = dot(center - v1, v2 - v1);
    real dot2 = dot(center - v2, v1 - v2);
    m->penetration = A->radius - separation;

    // Closest to v1
    if (dot1 <= 0.0f) {
        if (distSqr(center, v1) > A->radius * A->radius)
            return;

        m->contact_count = 1;
        vec2 n = v1 - center;
        n = B->u * n;
        n = n.unit();
        m->normal = n;
        v1 = B->u * v1 + b->position;
        m->contacts[0] = v1;
    } else if (dot2 <= 0.0f) { // Closest to v2
        if (distSqr(center, v2) > A->radius * A->radius)
            return;

        m->contact_count = 1;
        vec2 n = v2 - center;
        v2 = B->u * v2 + b->position;
        m->contacts[0] = v2;
        n = B->u * n;
        n = n.unit();
        m->normal = n;
    } else { // Closest to face
        vec2 n = B->m_normals[faceNormal];
        if (dot(center - v1, n) > A->radius)
            return;

        n = B->u * n;
        m->normal = -n;
        m->contacts[0] = m->normal*A->radius + a->position;
        m->contact_count = 1;
    }
}

void Phys2PolygonToCircle(Phys2Manifold* m, Phys2Body* a, Phys2Body* b) {
    Phys2CircleToPolygon(m, b, a);
    m->normal = -m->normal;
}

real Phys2FindAxisLeastPenetration(uint32_t* faceIndex, Phys2Polygon* A, Phys2Polygon* B) {
    real bestDistance = -FLT_MAX;
    uint32_t bestIndex;

    for(uint32_t i = 0; i < A->m_vertexCount; ++i) {
        // Retrieve a face normal from A
        vec2 n = A->m_normals[i];
        vec2 nw = A->u * n;

        // Transform face normal into B's model space
        mat2 buT = B->u.transpose();
        n = buT * nw;

        // Retrieve support point from B along -n
        vec2 s = B->getSupport(-n);

        // Retrieve vertex on face from A, transform into
        // B's model space
        vec2 v = A->m_vertices[i];
        v = A->u * v + A->body->position;
        v -= B->body->position;
        v = buT * v;

        // Compute penetration distance (in B's model space)
        real d = dot(n, s - v);

        // Store greatest distance
        if(d > bestDistance) {
            bestDistance = d;
            bestIndex = i;
        }
    }

    *faceIndex = bestIndex;
    return bestDistance;
}

void Phys2FindIncidentFace(vec2* v, Phys2Polygon* RefPoly, Phys2Polygon* IncPoly, uint32_t referenceIndex) {
    vec2 referenceNormal = RefPoly->m_normals[referenceIndex];

    // Calculate normal in incident's frame of reference
    referenceNormal = RefPoly->u * referenceNormal; // To world space
    referenceNormal = IncPoly->u.transpose() * referenceNormal; // To incident's model space

    // Find most anti-normal face on incident polygon
    int32_t incidentFace = 0;
    real minDot = FLT_MAX;
    for(uint32_t i = 0; i < IncPoly->m_vertexCount; ++i) {
        real dot_ = dot(referenceNormal, IncPoly->m_normals[i]);
        if(dot_ < minDot) {
            minDot = dot_;
            incidentFace = i;
        }
    }

    // Assign face vertices for incidentFace
    v[0] = IncPoly->u * IncPoly->m_vertices[incidentFace] + IncPoly->body->position;
    incidentFace = incidentFace + 1 >= (int32_t)IncPoly->m_vertexCount ? 0 : incidentFace + 1;
    v[1] = IncPoly->u * IncPoly->m_vertices[incidentFace] + IncPoly->body->position;
}

int32_t Phys2Clip(vec2 n, real c, vec2 *face) {
    uint32_t sp = 0;
    vec2 out[2] = {
        face[0],
        face[1]
    };

    // Retrieve distances from each endpoint to the line
    // d = ax + by - c
    real d1 = dot(n, face[0]) - c;
    real d2 = dot(n, face[1]) - c;

    // If negative (behind plane) clip
    if (d1 <= 0.0f) out[sp++] = face[0];
    if (d2 <= 0.0f) out[sp++] = face[1];
    
    // If the points are on different sides of the plane
    if (d1 * d2 < 0.0f) { // less than to ignore -0.0f
        // Push interesection point
        real alpha = d1 / (d1 - d2);
        out[sp] = face[0] + alpha * (face[1] - face[0]);
        ++sp;
    }

    // Assign our new converted values
    face[0] = out[0];
    face[1] = out[1];

    assert(sp != 3);

    return sp;
}

void Phys2PolygonToPolygon(Phys2Manifold* m, Phys2Body* a, Phys2Body* b) {
    Phys2Polygon* A = reinterpret_cast<Phys2Polygon *>(a->shape);
    Phys2Polygon* B = reinterpret_cast<Phys2Polygon *>(b->shape);
    m->contact_count = 0;

    // Check for a separating axis with A's face planes
    uint32_t faceA;
    real penetrationA = Phys2FindAxisLeastPenetration(&faceA, A, B);
    if(penetrationA >= 0.0f)
        return;

    // Check for a separating axis with B's face planes
    uint32_t faceB;
    real penetrationB = Phys2FindAxisLeastPenetration(&faceB, B, A);
    if(penetrationB >= 0.0f)
        return;

    uint32_t referenceIndex;
    bool flip; // Always point from a to b

    Phys2Polygon *RefPoly; // Reference
    Phys2Polygon *IncPoly; // Incident

    // Determine which shape contains reference face
    if (biasGreaterThan(penetrationA, penetrationB)) {
        RefPoly = A;
        IncPoly = B;
        referenceIndex = faceA;
        flip = false;
    } else {
        RefPoly = B;
        IncPoly = A;
        referenceIndex = faceB;
        flip = true;
    }

    // World space incident face
    vec2 incidentFace[2];
    Phys2FindIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);

    //        y
    //        ^  ->n       ^
    //      +---c ------posPlane--
    //  x < | i |\
    //      +---+ c-----negPlane--
    //             \       v
    //              r
    //
    //  r : reference face
    //  i : incident poly
    //  c : clipped point
    //  n : incident normal

    // Setup reference face vertices
    vec2 v1 = RefPoly->m_vertices[referenceIndex];
    referenceIndex = referenceIndex + 1 == RefPoly->m_vertexCount ? 0 : referenceIndex + 1;
    vec2 v2 = RefPoly->m_vertices[referenceIndex];

    // Transform vertices to world space
    v1 = RefPoly->u * v1 + RefPoly->body->position;
    v2 = RefPoly->u * v2 + RefPoly->body->position;

    // Calculate reference face side normal in world space
    vec2 sidePlaneNormal = (v2 - v1);
    sidePlaneNormal = sidePlaneNormal.unit();

    // Orthogonalize
    vec2 refFaceNormal(sidePlaneNormal.y, -sidePlaneNormal.x);

    // ax + by = c
    // c is distance from origin
    real refC = dot(refFaceNormal, v1);
    real negSide = -dot(sidePlaneNormal, v1);
    real posSide =  dot(sidePlaneNormal, v2);

    // Clip incident face to reference face side planes
    if (Phys2Clip(-sidePlaneNormal, negSide, incidentFace) < 2)
        return; // Due to floating point error, possible to not have required points

    if (Phys2Clip( sidePlaneNormal, posSide, incidentFace) < 2)
        return; // Due to floating point error, possible to not have required points

    // Flip
    m->normal = flip ? -refFaceNormal : refFaceNormal;

    // Keep points behind reference face
    uint32_t cp = 0; // clipped points behind reference face
    real separation = dot(refFaceNormal, incidentFace[0]) - refC;
    if (separation <= 0.0f) {
        m->contacts[cp] = incidentFace[0];
        m->penetration = -separation;
        ++cp;
    } else
        m->penetration = 0;

    separation = dot(refFaceNormal, incidentFace[1]) - refC;
    if (separation <= 0.0f) {
        m->contacts[cp] = incidentFace[1];

        m->penetration += -separation;
        ++cp;

        // Average penetration
        m->penetration /= (real)cp;
    }

    m->contact_count = cp;
}
