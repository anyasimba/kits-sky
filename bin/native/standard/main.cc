#include <src/common/native/_.h>

void Native(v8::Local<v8::Object> exports) {
    NODE_SET_METHOD(exports, "isExternal", isExternal);
    NODE_SET_METHOD(exports, "pointer", pointer);
    BIND(Native)
}
NODE_MODULE(NODE_GYP_MODULE_NAME, Native)
