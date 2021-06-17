#include "Phys2Manifold.h"
#include "Phys2Collision.h"

void Phys2Manifold::solve() {
    Dispatch[A->shape->getType()][B->shape->getType()](this, A, B);
}

void Phys2Manifold::initialize(real dt, vec2 gravity) {
    // Calculate average restitution
    e = std::min(A->restitution, B->restitution);

    // Calculate static and dynamic friction
    sf = std::sqrt(A->staticFriction * A->staticFriction);
    df = std::sqrt(A->dynamicFriction * A->dynamicFriction);

    for (uint32_t i = 0; i < contact_count; ++i) {
        // Calculate radii from COM to contact
        vec2 ra = contacts[i] - A->position;
        vec2 rb = contacts[i] - B->position;

        vec2 rv =
            B->velocity + cross(B->angularVelocity, rb) -
            A->velocity - cross(A->angularVelocity, ra);

        // Determine if we should perform a resting collision or not
        // The idea is if the only thing moving this object is gravity,
        // then the collision should be performed without any restitution
        if (rv.lenSqr() < (dt * gravity).lenSqr() + FLT_EPSILON)
            e = 0.0f;
    }
}

void Phys2Manifold::applyImpulse() {
    // Early out and positional correct if both objects have infinite mass
    if (equal(A->im + B->im, 0)) {
        infiniteMassCorrection();
        return;
    }

    for (uint32_t i = 0; i < contact_count; ++i) {
        // Calculate radii from COM to contact
        vec2 ra = contacts[i] - A->position;
        vec2 rb = contacts[i] - B->position;

        // Relative velocity
        vec2 rv = B->velocity + cross(B->angularVelocity, rb) -
                A->velocity - cross(A->angularVelocity, ra);

        // Relative velocity along the normal
        real contactVel = dot(rv, normal);

        // Do not resolve if velocities are separating
        if (contactVel > 0)
            return;

        real raCrossN = cross(ra, normal);
        real rbCrossN = cross(rb, normal);
        real invMassSum = A->im + B->im + sqr(raCrossN) * A->iI + sqr(rbCrossN) * B->iI;

        // Calculate impulse scalar
        real j = -(1.0f + e) * contactVel;
        j /= invMassSum;
        j /= (real)contact_count;

        // Apply impulse
        vec2 impulse = normal * j;
        A->applyImpulse(-impulse, ra);
        B->applyImpulse(impulse, rb);

        // Friction impulse
        rv = B->velocity + cross(B->angularVelocity, rb) -
            A->velocity - cross(A->angularVelocity, ra);

        vec2 t = rv - (normal*dot(rv, normal));
        t = t.unit();

        // j tangent magnitude
        real jt = -dot(rv, t);
        jt /= invMassSum;
        jt /= (real)contact_count;

        // Don't apply tiny friction impulses
        if (equal(jt, 0.0f))
            return;

        // Coulumb's law
        vec2 tangentImpulse;
        if (std::abs(jt) < j * sf)
            tangentImpulse = t * jt;
        else
            tangentImpulse = t * -j * df;

        // Apply friction impulse
        A->applyImpulse(-tangentImpulse, ra);
        B->applyImpulse(tangentImpulse, rb);
    }
}

void Phys2Manifold::positionalCorrection() {
    const real k_slop = 0.05f; // Penetration allowance
    const real percent = 0.4f; // Penetration percentage to correct
    vec2 correction = (std::max(penetration - k_slop, 0.0f) / (A->im + B->im)) * normal * percent;
    A->position -= correction * A->im;
    B->position += correction * B->im;
}

void Phys2Manifold::infiniteMassCorrection() {
    A->velocity.set(0.f, 0.f);
    B->velocity.set(0.f, 0.f);
}
