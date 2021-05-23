#pragma once
extern "C" {
    #include <math.h>
}
#include <iostream>
#include <vector>
using namespace std;

#include "math/@.h"

inline float po2 (float size) {
    float r = 32;
    while (r < size) {
        r *= 2;
    }
    return r;
}

struct OcthreeBelongs {
    Array<void*> nodes;
};

struct ___OcthreeDebug {
    float x;
    float y;
    size_t size;
};
TO_SCRIPT_STRUCT(___OcthreeDebug,
    TO_SCRIPT_ARG(float, x),
    TO_SCRIPT_ARG(float, y),
    TO_SCRIPT_ARG(size_t, size))
FROM_SCRIPT_STRUCT(___OcthreeDebug,
    FROM_SCRIPT_ARG(float, x),
    FROM_SCRIPT_ARG(float, y),
    FROM_SCRIPT_ARG(size_t, size))

template<class T>
struct OcthreeNode;

template<class T>
struct ___OcthreeNodes {
    OcthreeNode<T>* node[8];
    ___OcthreeNodes () {
        memset(node, 0, sizeof(node));
    }

    virtual void __onRemove () {}
};

template<class T>
struct OcthreeNode: ___OcthreeNodes<T> {
    ___OcthreeNodes<T>* parent;
    size_t idx;
    float size;
    Array<T> objs;

    void debug (Array<___OcthreeDebug>& debugs, vec3 factor, vec2 shift) {
        if (debugs.size() > 200) {
            return;
        }
        const vec3 factors[8] = {
            vec3(0.f, 0.f, 0.f),
            vec3(1.f, 0.f, 0.f),
            vec3(0.f, 1.f, 0.f),
            vec3(1.f, 1.f, 0.f),
            vec3(0.f, 0.f, 1.f),
            vec3(1.f, 0.f, 1.f),
            vec3(0.f, 1.f, 1.f),
            vec3(1.f, 1.f, 1.f),
        };

        for (size_t i = 0; i < 8; ++i) {
            auto node = this->node[i];
            if (node == nullptr) {
                continue;
            }
            ___OcthreeDebug debug;
            debug.x = factor.x * (shift.x + node->size * (0.5f + factors[i].x));
            debug.y = factor.y * (shift.y + node->size * (0.5f + factors[i].y));
            debug.size = node->size;
            debugs.push_back(debug);
            node->debug(debugs, factor, vec2(shift.x + node->size * factors[i].x, shift.y + node->size * factors[i].y));
        }
    }

    OcthreeNode (___OcthreeNodes<T>* parent, size_t idx, float size)
        : parent(parent), idx(idx), size(size)
    {}

    void add (OcthreeBelongs& belongs, const T& obj, float size, AABB3 aabb) {
        if (size == this->size) {
            belongs.nodes.push_back((void*)this);
            objs.add(obj);
            return;
        }
        
        auto hs = this->size*0.5f;
        const AABB3 aabbArr[8] = {
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb,    aabb.ze),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb,    aabb.ze),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb,    aabb.ze),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb,    aabb.ze),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb=hs, aabb.ze-hs),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            this->_tryAdd(belongs, i, hs, obj, size, aabb);
        }
    }

    void get (Array<T>& result, float size, AABB3 aabb) {
        FOR(i, objs) {
            if (find(result.begin(), result.end(), objs[i]) == result.end()) {
                result.push_back(objs[i]);
            }
        }
        
        auto hs = this->size*0.5f;
        const AABB3 aabbArr[8] = {
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb,    aabb.ze),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb,    aabb.ze),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb,    aabb.ze),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb,    aabb.ze),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb=hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb=hs, aabb.ze-hs),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            this->_tryGet(result, i, hs, size, aabb);
        }
    }

    void remove (const T& obj) {
        objs.remove(obj);
        __onRemove();
    }
    
    void _tryAdd (OcthreeBelongs& belongs, size_t i, float halfSize, const T& obj, float size, AABB3 aabb) {
        if (aabb.xb > halfSize || aabb.yb > halfSize || aabb.zb > halfSize) {
            return;
        }
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
        if (this->node[i] == nullptr) {
            this->node[i] = new OcthreeNode<T>(this, i, halfSize);
        }
        this->node[i]->add(belongs, obj, size, aabb);
    }
    
    void _tryGet (Array<T>& result, size_t i, float halfSize, float size, AABB3 aabb) {
        if (aabb.xb > halfSize || aabb.yb > halfSize || aabb.zb > halfSize) {
            return;
        }
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
        if (this->node[i] == nullptr) {
            return;
        }
        this->node[i]->get(result, halfSize, aabb);
    }

    void __onRemove () {
        if (objs.size() > 0) {
            return;
        }
        for (size_t i = 0; i < 8; ++i) {
            if (this->node[i] != nullptr) {
                return;
            }
        }
        parent->node[idx] = nullptr;
        parent->__onRemove();
        delete this;
    }
};

template<class T>
struct Octhree: ___OcthreeNodes<T> {
    static float sizeOf (AABB3 aabb) {
        auto size = aabb.xe - aabb.xb;
        size = fmax(aabb.ye-aabb.yb, size);
        size = fmax(aabb.ze-aabb.zb, size);
        size = po2(size);
        return size;
    }

    static float rootSizeOf (AABB3 aabb) {
        auto size = aabb.xe;
        size = fmax(aabb.ye, size);
        size = fmax(aabb.ze, size);
        size = po2(size);
        return size;
    }

    Array<___OcthreeDebug> debug () {
        Array<___OcthreeDebug> debugs;

        const vec3 factors[8] = {
            vec3(1.f, 1.f, 1.f),
            vec3(-1.f, 1.f, 1.f),
            vec3(1.f, -1.f, 1.f),
            vec3(-1.f, -1.f, 1.f),
            vec3(1.f, 1.f, -1.f),
            vec3(-1.f, 1.f, -1.f),
            vec3(1.f, -1.f, -1.f),
            vec3(-1.f, -1.f, -1.f),
        };

        for (size_t i = 0; i < 8; ++i) {
            auto& node = this->node[i];
            if (node == nullptr) {
                continue;
            }
            auto factor = factors[i];
            ___OcthreeDebug debug;
            debug.x = node->size * 0.5f * factor.x;
            debug.y = node->size * 0.5f * factor.y;
            debug.size = node->size;
            debugs.push_back(debug);
            vec2 shift(0.f, 0.f);
            node->debug(debugs, factor, shift);
        }

        return debugs;
    }

    OcthreeBelongs add (const T& obj, AABB3 aabb) {
        OcthreeBelongs belongs;

        auto size = Octhree<T>::sizeOf(aabb);

        const AABB3 aabbArr[8] = {
            AABB3(aabb.xb, aabb.xe, aabb.yb, aabb.ye, aabb.zb, aabb.ze),
            AABB3(-aabb.xe, -aabb.xb, aabb.yb, aabb.ye, aabb.zb, aabb.ze),
            AABB3(aabb.xb, aabb.xe, -aabb.ye, -aabb.yb, aabb.zb, aabb.ze),
            AABB3(-aabb.xe, -aabb.xb, -aabb.ye, -aabb.yb, aabb.zb, aabb.ze),
            AABB3(aabb.xb, aabb.xe, aabb.yb, aabb.ye, -aabb.ze, -aabb.zb),
            AABB3(-aabb.xe, -aabb.xb, aabb.yb, aabb.ye, -aabb.ze, -aabb.zb),
            AABB3(aabb.xb, aabb.xe, -aabb.ye, -aabb.yb, -aabb.ze, -aabb.zb),
            AABB3(-aabb.xe, -aabb.xb, -aabb.ye, -aabb.yb, -aabb.ze, -aabb.zb),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            this->__tryAdd(belongs, i, obj, size, aabb);
        }

        return belongs;
    }

    Array<T> get (AABB3 aabb) {
        Array<T> items;

        auto size = Octhree<T>::sizeOf(aabb);

        const AABB3 aabbArr[8] = {
            AABB3(aabb.xb, aabb.xe, aabb.yb, aabb.ye, aabb.zb, aabb.ze),
            AABB3(-aabb.xe, -aabb.xb, aabb.yb, aabb.ye, aabb.zb, aabb.ze),
            AABB3(aabb.xb, aabb.xe, -aabb.ye, -aabb.yb, aabb.zb, aabb.ze),
            AABB3(-aabb.xe, -aabb.xb, -aabb.ye, -aabb.yb, aabb.zb, aabb.ze),
            AABB3(aabb.xb, aabb.xe, aabb.yb, aabb.ye, -aabb.ze, -aabb.zb),
            AABB3(-aabb.xe, -aabb.xb, aabb.yb, aabb.ye, -aabb.ze, -aabb.zb),
            AABB3(aabb.xb, aabb.xe, -aabb.ye, -aabb.yb, -aabb.ze, -aabb.zb),
            AABB3(-aabb.xe, -aabb.xb, -aabb.ye, -aabb.yb, -aabb.ze, -aabb.zb),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            this->__tryGet(items, i, size, aabb);
        }

        return items;
    }

    void remove (const T& obj, OcthreeBelongs& belongs) {
        FOR (i, belongs.nodes) {
            auto node = (OcthreeNode<T>*)belongs.nodes[i];
            node->remove(obj);
        }
    }
    
    void update (const T& obj, OcthreeBelongs& belongs, AABB3 aabb) {
        this->remove(obj, belongs);
        belongs = this->add(obj, aabb);
    }

    void __tryAdd (OcthreeBelongs& belongs, size_t i, const T& obj, float size, AABB3 aabb) {
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
        auto rootSize = Octhree<T>::rootSizeOf(aabb);

        auto nodeSize = fmax(size, rootSize);

        if (this->node[i] == nullptr) {
            this->node[i] = new OcthreeNode<T>(this, i, nodeSize);
        } else {
            while (this->node[i]->size < nodeSize) {
                auto newNode = new OcthreeNode<T>(this, i, this->node[i]->size*2);
                newNode->node[0] = this->node[i];
                this->node[i]->parent = newNode;
                this->node[i] = newNode;
            }
        }
        this->node[i]->add(belongs, obj, size, aabb);
    }

    void __tryGet (Array<T>& result, size_t i, float size, AABB3 aabb) {
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
        auto rootSize = Octhree<T>::rootSizeOf(aabb);

        auto nodeSize = fmax(size, rootSize);

        if (this->node[i] == nullptr) {
            this->node[i] = new OcthreeNode<T>(this, i, nodeSize);
        } else {
            while (this->node[i]->size < nodeSize) {
                auto newNode = new OcthreeNode<T>(this, i, this->node[i]->size*2);
                newNode->node[0] = this->node[i];
                this->node[i]->parent = newNode;
                this->node[i] = newNode;
            }
        }
        this->node[i]->get(result, size, aabb);
    }
};
