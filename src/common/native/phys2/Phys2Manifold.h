#pragma once
#include "@common.h"

struct Phys2Body;

struct Phys2Manifold {
    Phys2Manifold(Phys2Body* a, Phys2Body* b)
        : A(a)
        , B(b)
    {}

    void solve();                             // Generate contact information
    void initialize(real dt, vec2 gravity);   // Precalculations for impulse solving
    void applyImpulse();                      // Solve impulse and apply
    void positionalCorrection();              // Naive correction of positional penetration
    void infiniteMassCorrection();

    Phys2Body* A;
    Phys2Body* B;

    real penetration;     // Depth of penetration from collision
    vec2 normal;          // From A to B
    vec2 contacts[2];     // Points of contact during collision
    uint32_t contact_count; // Number of contacts that occured during collision
    real e;               // Mixed restitution
    real df;              // Mixed dynamic friction
    real sf;              // Mixed static friction
};
