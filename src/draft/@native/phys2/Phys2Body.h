#pragma once
#include "@common.h"
#include "Phys2Force.h"

struct Phys2Shape;

struct Phys2Body: Native {
    Phys2Body ();
    void init (real density);

    void applyImpulse (const vec2& impulse, const vec2& contactVector) {
        velocity += im * impulse;
        angularVelocity += iI * cross (contactVector, impulse);
    }

    void setStatic (void) {
        I = 0.0f;
        iI = 0.0f;
        m = 0.0f;
        im = 0.0f;
    }

    void setOrient (real radians);

    vec2 position;
    vec2 velocity;

    real angularVelocity;
    real torque;
    real orient; // radians

    Array<Phys2Force*> forces;

    // Set by shape
    real I;  // moment of inertia
    real iI; // inverse inertia
    real m;  // mass
    real im; // inverse masee

    real staticFriction;
    real dynamicFriction;
    real restitution;

    // Shape interface
    Phys2Shape* shape;

    OcthreeBelongs belongs;
};
BINDING (Phys2Body) {
    BIND_CLASS(Phys2Body, ())
    BIND_CLASS_METHOD_VOID(Phys2Body, init, (density), ARG(1, real, density))
    BIND_CLASS_PROP(Phys2Body, Phys2Shape*, shape)
    BIND_CLASS_PROP(Phys2Body, vec2, position)
    BIND_CLASS_PROP(Phys2Body, vec2, velocity)
    BIND_CLASS_PROP(Phys2Body, real, angularVelocity)
    BIND_CLASS_PROP(Phys2Body, real, torque)
    BIND_CLASS_PROP(Phys2Body, real, orient)
    BIND_CLASS_ARRAY_PROP(Phys2Body, Phys2Force*, forces)
    BIND_CLASS_METHOD_VOID(Phys2Body, setOrient, (orient), ARG(1, real, orient))
    BIND_CLASS_PROP(Phys2Body, real, I)
    BIND_CLASS_PROP(Phys2Body, real, iI)
    BIND_CLASS_PROP(Phys2Body, real, m)
    BIND_CLASS_PROP(Phys2Body, real, im)
    BIND_CLASS_PROP(Phys2Body, real, staticFriction)
    BIND_CLASS_PROP(Phys2Body, real, dynamicFriction)
    BIND_CLASS_PROP(Phys2Body, real, restitution)
}
