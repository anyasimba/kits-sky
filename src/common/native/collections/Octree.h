#pragma once

inline float po2(float size) {
    float r = 32;
    while (r < size) {
        r *= 2;
    }
    return r;
}

template<class T>
struct OctreeNode;

template<class T>
struct ___OctreeNodes: Native {
    OctreeNode<T>* nodes[8];
    ___OctreeNodes() {
        memset(nodes, 0, sizeof(OctreeNode<T>*)*8);
    }

    virtual bool __onRemove () {
        return false;
    }
};

struct OctreeBelongs {
    Array<void*> nodes;
};
TO_SCRIPT_STRUCT(OctreeBelongs,
    TO_SCRIPT_ARG(Array<void*>, nodes));
FROM_SCRIPT_STRUCT(OctreeBelongs,
    FROM_SCRIPT_ARG(Array<void*>, nodes));

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
            this->objs.add(obj);
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
            if (this->nodes[i] == nullptr) {
                this->nodes[i] = new OctreeNode<T>(this, i, hs);
            }
            this->nodes[i]->add(belongs, obj, size, aabb);
        }
    }

    void get(Array<T>& result, AABB3 aabb) {
        if (aabb.xe < 0.f || aabb.ye < 0.f || aabb.ze < 0.f) {
            return;
        }
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
            if (this->nodes[i] == nullptr) {
                continue;
            }
            this->nodes[i]->get(result, aabb);
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
            if (this->nodes[i] != nullptr) {
                return false;
            }
        }
        parent->nodes[idx] = nullptr;
        if (parent->__onRemove()) {
            delete parent;
        }
        return true;
    }
};
BINDING(OctreeNode) {
    typedef OctreeNode<Native*> OctreeNode;
    BIND_CLASS_STATIC_ARRAY_PROP(OctreeNode, OctreeNode*, nodes);
    BIND_CLASS_PROP(OctreeNode, size_t, size);
    BIND_CLASS_PROP(OctreeNode, size_t, idx);
    BIND_CLASS_ARRAY_PROP(OctreeNode, Native*, objs);
}

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
            if (this->nodes[i] == nullptr) {
                this->nodes[i] = new OctreeNode<T>(this, i, rootSize);
            } else {
                while (this->nodes[i]->size < rootSize) {
                    auto newNode = new OctreeNode<T>(this, i, this->nodes[i]->size*2);
                    newNode->nodes[0] = this->nodes[i];
                    this->nodes[i]->parent = newNode;
                    this->nodes[i]->idx = 0;
                    this->nodes[i] = newNode;
                }
            }
            this->nodes[i]->add(belongs, obj, rootSize, aabb);
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
            if (this->nodes[i] == nullptr) {
                continue;
            }

            this->nodes[i]->get(items, aabbArr[i]);
        }
        return items;
    }

    void remove(const T& obj, OctreeBelongs belongs) {
        FOR (i, belongs.nodes) {
            auto node = (OctreeNode<T>*)belongs.nodes[i];
            if (node->remove(obj)) {
                delete node;
            }
        }
    }
    
    OctreeBelongs update(const T& obj, OctreeBelongs belongs, AABB3 aabb) {
        this->remove(obj, belongs);
        return this->add(obj, aabb);
    }
};
BINDING(Octree) {
    typedef Octree<Native*> Octree;
    BIND_CLASS(Octree, ());
    BIND_CLASS_STATIC_ARRAY_PROP(Octree, OctreeNode<Native*>*, nodes);
    BIND_CLASS_METHOD(Octree, OctreeBelongs, add, (obj, aabb),
        ARG(1, Native*, obj),
        ARG(2, AABB3, aabb)
    );
    BIND_CLASS_METHOD(Octree, Array<Native*>, get, (aabb),
        ARG(1, AABB3, aabb)
    );
    BIND_CLASS_METHOD_VOID(Octree, remove, (obj, belongs),
        ARG(1, Native*, obj),
        ARG(2, OctreeBelongs, belongs)
    );
    BIND_CLASS_METHOD(Octree, OctreeBelongs, update, (obj, belongs, aabb),
        ARG(1, Native*, obj),
        ARG(2, OctreeBelongs, belongs),
        ARG(3, AABB3, aabb)
    );
}
