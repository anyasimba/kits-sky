#pragma once

struct AABB2 {
    float xb;
    float xe;
    float yb;
    float ye;

    AABB2() {}
    AABB2(float xb, float xe, float yb, float ye)
        : xb(xb), xe(xe), yb(yb), ye(ye)
    {}

    AABB2 merge(AABB2 aabb) {
        AABB2 result;
        result.xb = fmin(aabb.xb, xb);
        result.xe = fmax(aabb.xe, xe);
        result.yb = fmin(aabb.yb, yb);
        result.ye = fmax(aabb.ye, ye);
        return result;
    }
};
TO_SCRIPT_STRUCT(AABB2,
    TO_SCRIPT_ARG(float, xb),
    TO_SCRIPT_ARG(float, xe),
    TO_SCRIPT_ARG(float, yb),
    TO_SCRIPT_ARG(float, ye));
FROM_SCRIPT_STRUCT(AABB2,
    FROM_SCRIPT_ARG(float, xb),
    FROM_SCRIPT_ARG(float, xe),
    FROM_SCRIPT_ARG(float, yb),
    FROM_SCRIPT_ARG(float, ye));

struct AABB3 {
    float xb;
    float xe;
    float yb;
    float ye;
    float zb = 0.f;
    float ze = 0.f;

    AABB3() {}
    AABB3(float xb, float xe, float yb, float ye, float zb, float ze)
        : xb(xb), xe(xe), yb(yb), ye(ye), zb(zb), ze(ze)
    {}

    AABB3 merge(AABB3 aabb) {
        AABB3 result;
        result.xb = fmin(aabb.xb, xb);
        result.xe = fmax(aabb.xe, xe);
        result.yb = fmin(aabb.yb, yb);
        result.ye = fmax(aabb.ye, ye);
        result.zb = fmin(aabb.zb, zb);
        result.ze = fmax(aabb.ze, ze);
        return result;
    }
};
TO_SCRIPT_STRUCT(AABB3,
    TO_SCRIPT_ARG(float, xb),
    TO_SCRIPT_ARG(float, xe),
    TO_SCRIPT_ARG(float, yb),
    TO_SCRIPT_ARG(float, ye),
    TO_SCRIPT_ARG(float, zb),
    TO_SCRIPT_ARG(float, ze));
FROM_SCRIPT_STRUCT(AABB3,
    FROM_SCRIPT_ARG(float, xb),
    FROM_SCRIPT_ARG(float, xe),
    FROM_SCRIPT_ARG(float, yb),
    FROM_SCRIPT_ARG(float, ye),
    FROM_SCRIPT_ARG(float, zb),
    FROM_SCRIPT_ARG(float, ze));
