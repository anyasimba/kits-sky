#pragma once
#include "@common.h"

struct Phys2Force: Native {
    vec2 force;
};
BINDING(Phys2Force) {
    BIND_CLASS(Phys2Force, ())
    BIND_CLASS_PROP(Phys2Force, vec2, force)
}
