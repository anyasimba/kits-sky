#pragma once
#include ".common.h"
#include "Phys2Body.h"
#include "Phys2Manifold.h"
#include "Phys2Force.h"

struct Phys2System: Native {
    Octree<Phys2Body*> octree;
    Array<Phys2Body*> bodies;
    Array<Phys2Body*> staticBodies;
    Array<Phys2Manifold> contacts;
    Array<Phys2Force*> forces;
    uint32_t totalIterations = 1;
    uint32_t collisionIterations = 10;
    vec2 gravity;

    void update(float dt);
    void integrateForces(Phys2Body* body, real dt);
    void integrateVelocity(Phys2Body* body, real dt);

    void __onAdd(Phys2Body* body);
    void __onRemove(Phys2Body* body);
};
BINDING(Phys2System) {
    BIND_CLASS(Phys2System, ());
    BIND_CLASS_ARRAY_PROP(Phys2System, Phys2Body*, bodies);
    BIND_CLASS_ARRAY_PROP(Phys2System, Phys2Body*, staticBodies);
    BIND_CLASS_ARRAY_PROP(Phys2System, Phys2Force*, forces);
    BIND_CLASS_PROP(Phys2System, uint32_t, totalIterations);
    BIND_CLASS_PROP(Phys2System, uint32_t, collisionIterations);
    BIND_CLASS_PROP(Phys2System, vec2, gravity);
    BIND_CLASS_METHOD_VOID(Phys2System, update, (dt), ARG(1, float, dt));
    BIND_CLASS_METHOD_VOID(Phys2System, __onAdd, (body), ARG(1, Phys2Body*, body));
    BIND_CLASS_METHOD_VOID(Phys2System, __onRemove, (body), ARG(1, Phys2Body*, body));
}
