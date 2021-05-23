#pragma once
#include "../@common.h"

#define M_PI 3.14159265358979323846

inline bool equal (real a, real b) {
    // <= instead of < for NaN comparison safety
    return std::abs(a - b) <= FLT_EPSILON;
}

inline real sqr (real a) {
    return a*a;
}

inline real clamp (real min, real max, real a) {
    if (a < min) return min;
    if (a > max) return max;
    return a;
}

inline real random (real l, real h) {
    real a = (real)rand();
    a /= RAND_MAX;
    a = (h - l) * a + l;
    return a;
}

inline bool biasGreaterThan (real a, real b) {
    const real k_biasRelative = 0.95f;
    const real k_biasAbsolute = 0.01f;
    return a >= b * k_biasRelative + a * k_biasAbsolute;
}
