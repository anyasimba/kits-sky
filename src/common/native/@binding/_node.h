#pragma once
#pragma warning (disable: 4003)
#include <v8.h>
#include <node.h>
using namespace node;

// To script
template<class T>
struct ___ToScript {};

template<>
struct ___ToScript<bool> {
    static v8::Local<v8::Boolean> fn(v8::Isolate *isolate, const bool &v) {
        return v8::Boolean::New(isolate, v);
    }
};

template<>
struct ___ToScript<int> {
    static v8::Local<v8::Number> fn(v8::Isolate *isolate, const int &v) {
        return v8::Number::New(isolate, v);
    }
};

template<>
struct ___ToScript<uint32_t> {
    static v8::Local<v8::Number> fn(v8::Isolate *isolate, const int &v) {
        return v8::Number::New(isolate, v);
    }
};

template<>
struct ___ToScript<uint64_t> {
    static v8::Local<v8::Number> fn(v8::Isolate *isolate, const int &v) {
        return v8::Number::New(isolate, v);
    }
};

template<>
struct ___ToScript<float> {
    static v8::Local<v8::Number> fn(v8::Isolate *isolate, const float &v) {
        return v8::Number::New(isolate, v);
    }
};

template<class T>
struct ___ToScript<T*> {
    static v8::Local<v8::External> fn(v8::Isolate *isolate, const T* v) {
        return v8::External::New(isolate, (void *) v);
    }
};

template<class T>
struct ___ToScript<Array<T>> {
    static v8::Local<v8::Array> fn(v8::Isolate *isolate, const Array<T>& v) {
        v8::Local<v8::Array> r = v8::Array::New(isolate);
        for (size_t i = 0; i < v.size(); ++i) {
            r->Set(v8::Number::New(isolate, i), ___ToScript<T>::fn(isolate, v[i]));
        }
        return r;
    }
};

#define TO_SCRIPT_STRUCT(NAME, ...)\
    template<>\
    struct ___ToScript<NAME> {\
        static v8::Local<v8::Object> fn(v8::Isolate *isolate, const NAME& v) {\
            v8::Local<v8::Object> r = v8::Object::New(isolate);\
            __VA_ARGS__;\
            return r;\
        }\
    };

#define TO_SCRIPT_ARG(TYPE, NAME)\
    r->Set(v8::String::NewFromUtf8(isolate, #NAME), ___ToScript<TYPE>::fn(isolate, v.NAME))

// From Script
#define ARG(I, TYPE, NAME)\
    (void)0;TYPE NAME = ___FromScript<TYPE>::fn(isolate, args[I]);(void)0

template<class T>
struct ___FromScript {};

template<>
struct ___FromScript<bool> {
    static bool fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return v.As<v8::Boolean>()->Value();
    }
};

template<>
struct ___FromScript<int> {
    static int fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return v.As<v8::Number>()->Value();
    }
};

template<>
struct ___FromScript<uint32_t> {
    static int fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return v.As<v8::Number>()->Value();
    }
};

template<>
struct ___FromScript<uint64_t> {
    static int fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return v.As<v8::Number>()->Value();
    }
};

template<>
struct ___FromScript<float> {
    static float fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return v.As<v8::Number>()->Value();
    }
};

template<class T>
struct ___FromScript<T*> {
    static T* fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        return (T*) v.As<v8::External>()->Value();
    }
};

template<class T>
struct ___FromScript<Array<T>> {
    static Array<T> fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {
        size_t size = v.As<v8::Object>()->Get(v8::String::NewFromUtf8(isolate, "length")).As<v8::Number>()->Value();
        Array<T> r(size);
        for (size_t i = 0; i < size; ++i) {
            r[i] = ___FromScript<T>::fn(isolate, v.As<v8::Object>()->Get(v8::Number::New(isolate, i)));
        }
        return move(r);
    }
};

#define FROM_SCRIPT_STRUCT(NAME, ...)\
    template<>\
    struct ___FromScript<NAME> {\
        static NAME fn(v8::Isolate *isolate, const v8::Local<v8::Value>& v) {\
            NAME result;\
            __VA_ARGS__;\
            return result;\
        }\
    };

#define FROM_SCRIPT_ARG(TYPE, NAME)\
    (void)0;result.NAME = ___FromScript<TYPE>::fn(isolate, v.As<v8::Object>()->Get(v8::String::NewFromUtf8(isolate, #NAME)));(void)0

// Enum
#define SCRIPT_ENUM(NAME)\
    template<>\
    struct ___ToScript<NAME> {\
        static v8::Local<v8::Value> fn (v8::Isolate *isolate, const NAME& v) {\
            return v8::Number::New(isolate, (int) v);\
        }\
    };\
    template<>\
    struct ___FromScript<NAME> {\
        static NAME fn (v8::Isolate *isolate, const v8::Local<v8::Value>& v) {\
            return (NAME) (int) v.As<v8::Number>()->Value();\
        }\
    };

// is external
static void isExternal (const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(args[0]->IsExternal());
}

// pointer
static void pointer (const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate *isolate = args.GetIsolate();
    ARG(0, void*, obj);
    args.GetReturnValue().Set(___ToScript<size_t>::fn(isolate, (size_t)obj));
}

//
#define ___BIND_BEGIN(NAME)\
    typedef void (*___##NAME##_fn)(const v8::FunctionCallbackInfo<v8::Value>& args);\
    ___##NAME##_fn ___##NAME = [](const v8::FunctionCallbackInfo<v8::Value>& args) -> void {\
        v8::Isolate *isolate = args.GetIsolate();

#define ___BIND_END\
    };

#define BINDING(NAME)\
    inline void ___BIND_##NAME(v8::Local<v8::Object>& exports)

#define BIND(NAME)\
    ___BIND_##NAME(exports);

#define ___BIND_FUNCTION(NAME)\
    NODE_SET_METHOD(exports, #NAME, ___##NAME);

#define ___BIND_CLASS(NAME)\
    NODE_SET_METHOD(exports, #NAME, ___##NAME);\
    NODE_SET_METHOD(exports, #NAME"_destroy", ___##NAME##_destroy);

#define ___BIND_CLASS_PROP(NAME, PROP_NAME)\
    NODE_SET_METHOD(exports, #NAME"_get_"#PROP_NAME,\
        ___##NAME##_get_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_set_"#PROP_NAME,\
        ___##NAME##_set_##PROP_NAME);

#define ___BIND_CLASS_ARRAY_PROP(NAME, PROP_NAME)\
    NODE_SET_METHOD(exports, #NAME"_array_length_"#PROP_NAME,\
        ___##NAME##_array_length_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_array_get_"#PROP_NAME,\
        ___##NAME##_array_get_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_array_set_"#PROP_NAME,\
        ___##NAME##_array_set_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_array_add_"#PROP_NAME,\
        ___##NAME##_array_add_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_array_remove_"#PROP_NAME,\
        ___##NAME##_array_remove_##PROP_NAME);\
    NODE_SET_METHOD(exports, #NAME"_array_clear_"#PROP_NAME,\
        ___##NAME##_array_clear_##PROP_NAME);

#define ___BIND_CLASS_METHOD(NAME, METHOD)\
    NODE_SET_METHOD(exports, #NAME"_"#METHOD, ___##NAME##_##METHOD);

#define BIND_FUNCTION(RETURN, NAME, ARGS, ...)\
    ___BIND_BEGIN(NAME)\
        __VA_ARGS__;\
        args.GetReturnValue().Set(___ToScript<RETURN>::fn(isolate, NAME ARGS));\
    ___BIND_END\
    ___BIND_FUNCTION(NAME)

#define BIND_FUNCTION_VOID(NAME, ARGS, ...)\
    ___BIND_BEGIN(NAME)\
        __VA_ARGS__;\
        NAME ARGS;\
    ___BIND_END\
    ___BIND_FUNCTION(NAME)

#define BIND_CLASS(NAME, ARGS, ...)\
    ___BIND_BEGIN(NAME)\
        __VA_ARGS__;\
        args.GetReturnValue().Set(___ToScript<NAME*>::fn(isolate, new NAME ARGS));\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_destroy)\
        ARG(0, NAME*, obj);\
        delete obj;\
    ___BIND_END\
    ___BIND_CLASS(NAME)\
    BIND_CLASS_PROP(NAME, bool, disposed)

#define BIND_CLASS_PROP(NAME, PROP_TYPE, PROP_NAME)\
    ___BIND_BEGIN(NAME##_get_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        args.GetReturnValue().Set(___ToScript<PROP_TYPE>::fn(isolate, obj->PROP_NAME));\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_set_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        ARG(1, PROP_TYPE, v);\
        obj->PROP_NAME = v;\
    ___BIND_END\
    ___BIND_CLASS_PROP(NAME, PROP_NAME)

#define BIND_CLASS_ARRAY_PROP(NAME, PROP_TYPE, PROP_NAME)\
    ___BIND_BEGIN(NAME##_array_length_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        args.GetReturnValue().Set(___ToScript<size_t>::fn(isolate, obj->PROP_NAME.size()));\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_array_get_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        ARG(1, int, idx);\
        args.GetReturnValue().Set(___ToScript<PROP_TYPE>::fn(isolate, obj->PROP_NAME[idx]));\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_array_set_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        ARG(1, int, idx);\
        ARG(2, PROP_TYPE, v);\
        obj->PROP_NAME[idx] = v;\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_array_add_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        ARG(1, PROP_TYPE, v);\
        obj->PROP_NAME.add(v);\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_array_remove_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        ARG(1, PROP_TYPE, v);\
        obj->PROP_NAME.remove(v);\
    ___BIND_END\
    ___BIND_BEGIN(NAME##_array_clear_##PROP_NAME)\
        ARG(0, NAME*, obj);\
        obj->PROP_NAME.clear();\
    ___BIND_END\
    ___BIND_CLASS_ARRAY_PROP(NAME, PROP_NAME)

#define BIND_CLASS_METHOD(NAME, RETURN, METHOD, ARGS, ...)\
    ___BIND_BEGIN(NAME##_##METHOD)\
        ARG(0, NAME*, obj);\
        __VA_ARGS__;\
        args.GetReturnValue().Set(___ToScript<RETURN>::fn(isolate, obj->METHOD ARGS));\
    ___BIND_END\
    ___BIND_CLASS_METHOD(NAME, METHOD)

#define BIND_CLASS_METHOD_VOID(NAME, METHOD, ARGS, ...)\
    ___BIND_BEGIN(NAME##_##METHOD)\
        ARG(0, NAME*, obj);\
        __VA_ARGS__;\
        obj->METHOD ARGS;\
    ___BIND_END\
    ___BIND_CLASS_METHOD(NAME, METHOD)
