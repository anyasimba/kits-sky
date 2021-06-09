#pragma once

inline float po2(float size) {
    float r = 32;
    while (r < size) {
        r *= 2;
    }
    return r;
}

struct OctreeBelongs {
    Array<void*> nodes;
};
TO_SCRIPT_STRUCT(OctreeBelongs,
    TO_SCRIPT_ARG(Array<void*>, nodes));
FROM_SCRIPT_STRUCT(OctreeBelongs,
    FROM_SCRIPT_ARG(Array<void*>, nodes));

struct ___OctreeDebug {
    float x;
    float y;
    size_t size;
};
TO_SCRIPT_STRUCT(___OctreeDebug,
    TO_SCRIPT_ARG(float, x),
    TO_SCRIPT_ARG(float, y),
    TO_SCRIPT_ARG(size_t, size));
FROM_SCRIPT_STRUCT(___OctreeDebug,
    FROM_SCRIPT_ARG(float, x),
    FROM_SCRIPT_ARG(float, y),
    FROM_SCRIPT_ARG(size_t, size));

template<class T>
struct OctreeNode;

template<class T>
struct ___OctreeNodes {
    int id;
    OctreeNode<T>* node[8];
    ___OctreeNodes() {}

    virtual bool __onRemove () {
        return false;
    }
};

template<class T>
struct OctreeNode: ___OctreeNodes<T> {
    ___OctreeNodes<T>* parent;
    size_t idx;
    size_t size;
    Array<T> objs;

    OctreeNode(___OctreeNodes<T>* parent, size_t idx, size_t size)
        : parent(parent), idx(idx), size(size)
    {}

    void add(OctreeBelongs& belongs, const T& obj, size_t size, AABB3 aabb) {
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
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb-hs, aabb.ze-hs),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            if (aabb.xb > hs || aabb.yb > hs || aabb.zb > hs) {
                continue;
            }
            if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
                continue;
            }
            if (this->node[i] == nullptr) {
                this->node[i] = new OctreeNode<T>(this, i, hs);
            }
            this->node[i]->add(belongs, obj, size, aabb);
        }
    }

    void get(Array<T>& result, AABB3 aabb) {
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
        printf("get %p\n", this);
        if (aabb.xb > this->size || aabb.yb > this->size || aabb.zb > this->size) {
            return;
        }

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
            AABB3(aabb.xb,    aabb.xe,    aabb.yb,    aabb.ye,    aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb,    aabb.ye,    aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb,    aabb.xe,    aabb.yb-hs, aabb.ye-hs, aabb.zb-hs, aabb.ze-hs),
            AABB3(aabb.xb-hs, aabb.xe-hs, aabb.yb-hs, aabb.ye-hs, aabb.zb-hs, aabb.ze-hs),
        };
        for (size_t i = 0; i < 8; ++i) {
            auto& aabb = aabbArr[i];
            if (this->node[i] == nullptr) {
                continue;
            }
            this->node[i]->get(result, aabb);
        }
    }

    bool remove(const T& obj) {
        objs.remove(obj);
        return __onRemove();
    }

    bool __onRemove() {
        if (objs.size() > 0) {
            return false;
        }
        for (size_t i = 0; i < 8; ++i) {
            if (this->node[i] != nullptr) {
                return false;
            }
        }
        parent->node[idx] = nullptr;
        if (parent->__onRemove()) {
            delete parent;
        }
        return true;
    }

#ifdef DEBUG
    void debug(Array<___OctreeDebug>& debugs, vec3 factor, vec2 shift) {
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
            ___OctreeDebug debug;
            debug.x = factor.x * (shift.x + node->size * (0.5f + factors[i].x));
            debug.y = factor.y * (shift.y + node->size * (0.5f + factors[i].y));
            debug.size = node->size;
            debugs.push_back(debug);
            node->debug(debugs, factor, vec2(shift.x + node->size * factors[i].x, shift.y + node->size * factors[i].y));
        }
    }
#endif
};

template<class T>
struct Octree: ___OctreeNodes<T> {
    static size_t sizeOf(AABB3 aabb) {
        auto size = aabb.xe - aabb.xb;
        size = fmax(aabb.ye-aabb.yb, size);
        size = fmax(aabb.ze-aabb.zb, size);
        size = po2(size);
        return size;
    }

    static size_t rootSizeOf(AABB3 aabb) {
        auto size = aabb.xe;
        size = fmax(aabb.ye, size);
        size = fmax(aabb.ze, size);
        size = po2(size);
        return size;
    }

    OctreeBelongs add(const T& obj, AABB3 aabb) {
        OctreeBelongs belongs;
        auto size = Octree<T>::sizeOf(aabb);
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
            if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
                continue;
            }
            auto rootSize = Octree<T>::rootSizeOf(aabb);
            if (this->node[i] == nullptr) {
                this->node[i] = new OctreeNode<T>(this, i, rootSize);
            } else {
                while (this->node[i]->size < rootSize) {
                    auto newNode = new OctreeNode<T>(this, i, this->node[i]->size*2);
                    newNode->node[0] = this->node[i];
                    this->node[i]->parent = newNode;
                    this->node[i]->idx = 0;
                    this->node[i] = newNode;
                }
            }
            this->node[i]->add(belongs, obj, size, aabb);
        }

        return belongs;
    }

    Array<T> get(AABB3 aabb) {
        Array<T> items;
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
            if (this->node[i] == nullptr) {
                continue;
            }

            this->node[i]->get(items, aabbArr[i]);
        }
        return items;
    }

    void remove(const T& obj, OctreeBelongs& belongs) {
        FOR (i, belongs.nodes) {
            auto node = (OctreeNode<T>*)belongs.nodes[i];
            if (node->remove(obj)) {
                delete node;
            }
        }
    }
    
    void update(const T& obj, OctreeBelongs& belongs, AABB3 aabb) {
        this->remove(obj, belongs);
        belongs = this->add(obj, aabb);
    }

#ifdef DEBUG
    Array<___OctreeDebug> debug() {
        Array<___OctreeDebug> debugs;

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
            ___OctreeDebug debug;
            debug.x = node->size * 0.5f * factor.x;
            debug.y = node->size * 0.5f * factor.y;
            debug.size = node->size;
            debugs.push_back(debug);
            vec2 shift(0.f, 0.f);
            node->debug(debugs, factor, shift);
        }

        return debugs;
    }
#endif
};
BINDING(Octree) {
    //BIND_CLASS(Octree<Native*>, ());
}
