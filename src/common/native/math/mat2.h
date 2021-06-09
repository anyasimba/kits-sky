#pragma once
extern "C" {
    #include <math.h>
}
#include "types.h"
#include "vec2.h"

struct mat2 {
    union {
        struct {
            real m00, m01;
            real m10, m11;
        };

        real m[2][2];
        real v[4];
    };

    mat2() {}
    mat2(real radians) {
        real c = std::cos(radians);
        real s = std::sin(radians);

        m00 = c; m01 = -s;
        m10 = s; m11 =  c;
    }

    mat2(real a, real b, real c, real d)
        : m00(a), m01(b)
        , m10(c), m11(d)
    {}

    void set(real radians) {
        real c = std::cos(radians);
        real s = std::sin(radians);

        m00 = c; m01 = -s;
        m10 = s; m11 =  c;
    }

    mat2 abs() const {
        return mat2(std::abs(m00), std::abs(m01), std::abs(m10), std::abs(m11));
    }

    vec2 axisX() const {
        return vec2(m00, m10);
    }

    vec2 axisY() const {
        return vec2(m01, m11);
    }

    mat2 transpose() const {
        return mat2(m00, m10, m01, m11);
    }

    const vec2 operator*(const vec2& rhs) const {
        return vec2(m00*rhs.x + m01*rhs.y, m10*rhs.x + m11*rhs.y);
    }

    const mat2 operator*(const mat2& rhs) const {
        // [00 01]  [00 01]
        // [10 11]  [10 11]

        return mat2(
            m[0][0]*rhs.m[0][0] + m[0][1]*rhs.m[1][0],
            m[0][0]*rhs.m[0][1] + m[0][1]*rhs.m[1][1],
            m[1][0]*rhs.m[0][0] + m[1][1]*rhs.m[1][0],
            m[1][0]*rhs.m[0][1] + m[1][1]*rhs.m[1][1]
        );
    }
};
