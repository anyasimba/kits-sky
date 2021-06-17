#pragma once
#include "../collections/Array.h"
#include "../@binding/_.h"
#include <math.h>
extern "C" {
    #include <math.h>
}

struct vec2 {
    float x;
    float y;
    
    vec2() {}

    vec2(const vec2& v)
        : x(v.x), y(v.y)
    {}

    vec2(const float& x, const float& y)
        : x(x), y(y)
    {}

    vec2 operator -() const {
        return vec2(-x, -y);
    }

    vec2 operator +(const vec2& v) const {
        return vec2(x + v.x, y + v.y);
    }

    void operator +=(const vec2& v) {
        *this = *this + v;
    }

    vec2 operator -(const vec2& v) const {
        return vec2(x - v.x, y - v.y);
    }

    void operator -=(const vec2& v) {
        *this = *this - v;
    }

    vec2 operator *(const float& f) const {
        return vec2(x*f, y*f);
    }

    void operator *=(const float& f) {
        *this = *this * f;
    }

    vec2 operator /(const float& f) const {
        return vec2(x/f, y/f);
    }

    void operator /=(const float& f) {
        *this = *this / f;
    }

    float length() const {
        return sqrt(lenSqr());
    }

    float lenSqr() const {
        return x*x + y*y;
    }

    void set(float x, float y) {
        this->x = x;
        this->y = y;
    }

    vec2 unit() const {
        auto len = length();
        if (len <= EPSILON) {
            return *this;
        }
        return (*this)/len;
    }

    void rotate(float radians) {
        rotate(cos(radians), sin(radians));
    }

    void rotate(float c, float s) {
        auto xp = x*c - y*s;
        auto yp = x*s + y*c;

        x = xp;
        y = yp;
    }
};
TO_SCRIPT_STRUCT(vec2,
    TO_SCRIPT_ARG(float, x),
    TO_SCRIPT_ARG(float, y));
FROM_SCRIPT_STRUCT(vec2,
    FROM_SCRIPT_ARG(float, x),
    FROM_SCRIPT_ARG(float, y));

inline bool operator ==(const vec2& v1, const vec2& v2) {
    return v1.x == v2.x && v1.y == v2.y;
}
inline bool operator !=(const vec2& v1, const vec2& v2) {
    return !(v1 == v2);
}

inline vec2 operator *(float s, const vec2& v) {
    return vec2(s*v.x, s*v.y);
}

inline vec2 min(const vec2& a, const vec2& b) {
    return vec2(fmin(a.x, b.x), fmin(a.y, b.y));
}

inline vec2 max(const vec2& a, const vec2& b) {
    return vec2(fmax(a.x, b.x), fmax(a.y, b.y));
}

inline float dot(const vec2& a, const vec2& b) {
    return a.x*b.x + a.y*b.y;
}

inline float distSqr(const vec2& a, const vec2& b) {
    vec2 c = a - b;
    return dot(c, c);
}

inline vec2 cross(const vec2& v, float a) {
    return vec2(a*v.y, -a*v.x);
}

inline vec2 cross(float a, const vec2& v) {
    return vec2(-a*v.y, a*v.x);
}

inline float cross(const vec2& a, const vec2& b) {
    return a.x*b.y - a.y*b.x;
}

inline float distance(vec2 a, vec2 b, vec2 c) {
    auto dx = a.x - b.x;
    auto dy = a.y - b.y;
    auto D = dx * (c.y - a.y) - dy * (c.x - a.x);
    return D/sqrt(dx*dx + dy*dy);
}
