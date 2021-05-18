#pragma once

#ifdef __EMSCRIPTEN__
#include "@bindings/emscripten.h"
#endif

#ifdef BUILDING_NODE_EXTENSION
#include "@bindings/node.h"
#endif