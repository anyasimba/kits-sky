#include <src/common/native/_.h>

EMSCRIPTEN_BINDINGS(___Emscripten) {
    class_<___EmscriptenEnum>("___EmscriptenEnum");
    class_<___EmscriptenObj>("___EmscriptenObj")
        .function("pointer", &___EmscriptenObj::pointer);
}

EMSCRIPTEN_BINDINGS(main) {
    BIND(Native)
}
