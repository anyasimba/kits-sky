#pragma once
extern "C" {
    #include <math.h>
    #include <cfloat>
}

inline float ___intersect2__D2 (float a11, float a12, float a21, float a22) {
  return a11 * a22 - a12 * a21;
}

struct Intersect2 {
    bool isIntersect;
    float x;
    float y;
};

inline Intersect2 intersect2 (float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4, bool limit) {
    Intersect2 result;

    float ady = y1 - y2;
    float adx = x2 - x1;
    float bdy = y3 - y4;
    float bdx = x4 - x3;

    float D = ___intersect2__D2(ady, adx, bdy, bdx);
    if (fabs(D) <= FLT_EPSILON) {
        result.isIntersect = false;
        return result;
    };
    
    float aC = adx * y1 + ady * x1;
    float bC = bdx * y3 + bdy * x3;
    float DX = ___intersect2__D2(aC, adx, bC, bdx);
    float DY = ___intersect2__D2(ady, aC, bdy, bC);
    result.isIntersect = true;
    result.x = DX / D;
    result.y = DY / D;

    if (limit) {
        float minX1 = fmin(x1, x2);
        float maxX1 = fmax(x1, x2);
        float minX2 = fmin(x3, x4);
        float maxX2 = fmax(x3, x4);
        if (result.x < minX1 || result.x > maxX1 || result.x < minX2 || result.x > maxX2) {
            result.isIntersect = false;
            return result;
        }

        float minY1 = fmin(y1, y2);
        float maxY1 = fmax(y1, y2);
        float minY2 = fmin(y3, y4);
        float maxY2 = fmax(y3, y4);
        if (result.y < minY1 || result.y > maxY1 || result.y < minY2 || result.y > maxY2) {
            result.isIntersect = false;
            return result;
        }
    }
    
    return result;
}
