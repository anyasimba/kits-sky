#pragma once
#include "@common.h"

#include "phys2/Phys2Body.h"
#include "phys2/Phys2Force.h"
#include "phys2/Phys2Shape.h"
#include "phys2/Phys2System.h"

BINDING (Common) {
    BIND(Phys2Circle)
    BIND(Phys2Polygon)
    BIND(Phys2Body)
    BIND(Phys2Force)
    BIND(Phys2System)
}
