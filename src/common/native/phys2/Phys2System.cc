#include "Phys2System.h"
#include "Phys2Shape.h"

void Phys2System::update(float dt) {
    dt /= (float)totalIterations;
    for (size_t i = 0; i < totalIterations; ++i) {
        // Generate new collision info
        contacts.clear();

        for (uint32_t i = 0; i < bodies.size( ); ++i) {
            Phys2Body* A = bodies[i];
            auto nearBodies = octree.get(A->shape->aabb());
            for (uint32_t j = 0; j < nearBodies.size(); ++j) {
                Phys2Body *B = nearBodies[j];
                if (A == B)
                    continue;
                if (A->im == 0 && B->im == 0)
                    continue;
                
                Phys2Manifold m(A, B);
                m.solve();
                if (m.contact_count)
                    contacts.emplace_back(m);
            }
        }

        // Integrate forces
        for (uint32_t i = 0; i < bodies.size(); ++i)
            integrateForces(bodies[i], dt);

        // Initialize collision
        for (uint32_t i = 0; i < contacts.size(); ++i)
            contacts[i].initialize(dt, gravity);

        // Solve collisions
        for (uint32_t j = 0; j < collisionIterations; ++j)
            for (uint32_t i = 0; i < contacts.size(); ++i)
                contacts[i].applyImpulse();

        // Integrate velocities
        for(uint32_t i = 0; i < bodies.size(); ++i) {
            integrateVelocity(bodies[i], dt);
            
        }

        // Correct positions
        for(uint32_t i = 0; i < contacts.size(); ++i)
            contacts[i].positionalCorrection();

        // Update aabb
        for(uint32_t i = 0; i < bodies.size(); ++i) {
            Phys2Body *b = bodies[i];
            octree.update(b, b->belongs, b->shape->aabb());
        }

        // Clear all forces
        for(uint32_t i = 0; i < bodies.size(); ++i) {
            Phys2Body *b = bodies[i];
            b->torque = 0;
        }
    }
}

void Phys2System::integrateForces(Phys2Body *b, real dt) {
    if (b->im == 0.0f)
        return;

    b->velocity += gravity*(dt/2.0f);
    FOR(i, forces) {
        b->velocity += forces[i]->force*b->im*(dt/2.0f);
    }
    FOR(i, b->forces) {
        b->velocity += b->forces[i]->force*b->im*(dt/2.0f);
    }
}

void Phys2System::integrateVelocity(Phys2Body *b, real dt) {
    if (b->im == 0.0f)
        return;

    b->position += b->velocity*dt;
    b->orient += b->angularVelocity*dt;
    b->setOrient(b->orient);
    integrateForces(b, dt);
}

void Phys2System::__onAdd(Phys2Body* body) {
    auto aabb = body->shape->aabb();
    body->belongs = octree.add(body, aabb);
}

void Phys2System::__onRemove(Phys2Body* body) {
    octree.remove(body, body->belongs);
}
