#pragma once

#include "Phys2Body.h"
#include "Phys2Force.h"
#include "Phys2Shape.h"
#include "Phys2System.h"

BINDING(Phys2) {
    BIND(Phys2Body)
    BIND(Phys2Force)
    BIND(Phys2Circle)
    BIND(Phys2Polygon)
    BIND(Phys2System)
}
