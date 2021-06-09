#include "Phys2Body.h"
#include "Phys2Shape.h"

Phys2Body::Phys2Body() {
    velocity.set(0, 0);
    angularVelocity = 0.f;
    torque = 0.f;
    orient = 0.f;
    staticFriction = 0.5f;
    dynamicFriction = 0.3f;
    restitution = 0.2f;
}

void Phys2Body::init(real density) {
    shape->body = this;
    shape->initialize(density);
}

void Phys2Body::setOrient(real radians) {
    orient = radians;
    shape->setOrient(radians);
}
