#pragma once
#include "../collections/Array.h"

struct Native {
    bool disposed = false;
};

#ifdef __EMSCRIPTEN__
#include "_emscripten.h"
#endif

#ifdef BUILDING_NODE_EXTENSION
#include "_node.h"
#endif

struct NativePointer: Native {};
BINDING(NativePointer) {
    BIND_CLASS(NativePointer, ());
}
