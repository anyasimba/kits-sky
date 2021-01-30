#pragma once
extern "C" {
    #include <math.h>
}

struct vec3 {
    float x;
    float y;
    float z;

    vec3 () {}

    vec3 (const vec3& v)
        : x(v.x), y(v.y), z(v.z)
    {}

    vec3 (const float& x, const float& y, const float& z)
        : x(x), y(y), z(z)
    {}

    vec3 operator - () const {
        return vec3(-x, -y, -z);
    }

    vec3 operator + (const vec3& v) const {
        return vec3(x + v.x, y + v.y, z + v.z);
    }

    vec3 operator - (const vec3& v) const {
        return vec3(x - v.x, y - v.y, z - v.z);
    }

    vec3 operator * (const float& f) const {
        return vec3(x*f, y*f, z*f);
    }

    vec3 operator / (const float& f) const {
        return vec3(x/f, y/f, z/f);
    }

    float length () const {
        return sqrt(x*x + y*y + z*z);
    }

    vec3 unit () const {
        return (*this)/length();
    }

    float dot (const vec3& v) const {
        return x * v.x + y * v.y + z * v.z;
    }
    
    vec3 cross (const vec3& v) {
        return vec3(
        y * v.z - z * v.y,
        z * v.x - x * v.z,
        x * v.y - y * v.x
        );
    }
};
FROM_SCRIPT_STRUCT(vec3,
    FROM_SCRIPT_ARG(float, x),
    FROM_SCRIPT_ARG(float, y),
    FROM_SCRIPT_ARG(float, z))
TO_SCRIPT_STRUCT(vec3,
    TO_SCRIPT_ARG(float, x),
    TO_SCRIPT_ARG(float, y),
    TO_SCRIPT_ARG(float, z))

inline bool operator == (const vec3& v1, const vec3& v2) {
    return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
}
inline bool operator != (const vec3& v1, const vec3& v2) {
    return !(v1 == v2);
}
