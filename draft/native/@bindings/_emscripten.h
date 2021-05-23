#pragma once

namespace emscripten {
    class val;
}
template<class T>
struct ___FromScript {
    static T fn(const emscripten::val& v);
};

#include <emscripten.h>
#include <emscripten/bind.h>
using namespace emscripten;

#define print(CALL, ...)\
    EM_ASM({\
        console.log CALL;\
    }, __VA_ARGS__);

template<class T>
T ___FromScript<T>::fn(const val& v) {
    return v.as<T>();
}

template<class T>
val::operator T ()  {
    return ___FromScript<T>::fn(*this);
}

// Enum, obj
struct ___EmscriptenEnum {
    int v;
    template<class T>
    ___EmscriptenEnum (T v) {
        this->v = (int) v;
    }
    template<class T>
    operator T () {
        return (T) v;
    }
};

struct ___EmscriptenObj {
    void *obj;
    ___EmscriptenObj (void *obj)
        : obj(obj)
    {}
    size_t pointer () {
        return (size_t)obj;
    }
    template<class T>
    operator T* () {
        return (T*)obj;
    }
    template<class T>
    operator const T* () {
        return (const T*)obj;
    }
};

// To script
template<class T>
struct ___ToScript {
};

template<>
struct ___ToScript<bool> {
    static bool fn (bool r) { return r; }
};

template<>
struct ___ToScript<int> {
    static int fn (int r) { return r; }
};

template<>
struct ___ToScript<uint32_t> {
    static uint32_t fn (uint32_t r) { return r; }
};

template<>
struct ___ToScript<uint64_t> {
    static uint64_t fn (uint64_t r) { return r; }
};

template<>
struct ___ToScript<float> {
    static float fn (float r) { return r; }
};

template<class T>
struct ___ToScript<T*> {
    static ___EmscriptenObj fn (T* r) { return r; }
};

template<class T>
struct ___ToScript<Array<T>> {
    static val fn (const Array<T>& a) {
        val r = val::array();
        for (size_t i = 0; i < a.size(); ++i) {
            r.set(i, ___ToScript<T>::fn(a[i]));
        }
        return r;
    }
};

#define TO_SCRIPT_STRUCT(NAME, ...)\
    template<>\
    struct ___ToScript<NAME> {\
        static val fn (const NAME& v) {\
            val r = val::object();\
            __VA_ARGS__;\
            return r;\
        }\
    };
#define TO_SCRIPT_ARG(TYPE, NAME)\
    r.set(#NAME, v.NAME)

// From script
template<class T> struct ___Arg { typedef val type; };
template<> struct ___Arg<bool> { typedef bool type; };
template<> struct ___Arg<int> { typedef int type; };
template<> struct ___Arg<uint32_t> { typedef uint32_t type; };
template<> struct ___Arg<uint64_t> { typedef uint64_t type; };
template<> struct ___Arg<float> { typedef float type; };
template<class T> struct ___Arg<T*> { typedef ___EmscriptenObj type; };

#define ARG(I, TYPE, NAME)\
    ___Arg<TYPE>::type NAME

template<class T>
struct ___FromScript<T*> {
    static T* fn (const val& v) {
        return v.as<___EmscriptenObj>(allow_raw_pointers());
    }
};

template<class T>
struct ___FromScript<Array<T>> {
    static Array<T> fn(const val& v) {
        auto size = v["length"].as<size_t>();
        Array<T> arr(size);
        for (size_t i = 0; i < size; ++i) {
            arr[i] = ___FromScript<T>::fn(v[i]);
        }
        return move(arr);
    }
};

#define FROM_SCRIPT_STRUCT(NAME, ...)\
    template<>\
    struct ___FromScript<NAME> {\
        static NAME fn (const val& v) {\
            NAME result;\
            __VA_ARGS__;\
            return result;\
        }\
    };

#define FROM_SCRIPT_ARG(TYPE, NAME)\
    (void)0;result.NAME = ___FromScript<TYPE>::fn(v[#NAME]);(void)0

// Enum
#define SCRIPT_ENUM(NAME)\
    template<>\
    struct ___ToScript<NAME> {\
        static val fn (const NAME& v) {\
            return val((int) v);\
        }\
    };\
    template<>\
    struct ___FromScript<NAME> {\
        static NAME fn (const val& v) {\
            return (NAME) v.as<int>();\
        }\
    };

//
#define BINDING(NAME)\
    inline void ___BIND_##NAME ()

#define BIND(NAME)\
    ___BIND_##NAME();

#define ___BIND_FUNCTION(NAME)\
    emscripten::function(#NAME, ___##NAME,\
        allow_raw_pointers());

#define ___BIND_CLASS(NAME)\
    emscripten::function(#NAME, ___##NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_destroy", ___##NAME##_destroy,\
        allow_raw_pointers());

#define ___BIND_CLASS_PROP(NAME, PROP_NAME)\
    emscripten::function(#NAME"_get_"#PROP_NAME, ___##NAME##_get_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_set_"#PROP_NAME, ___##NAME##_set_##PROP_NAME,\
        allow_raw_pointers());

#define ___BIND_CLASS_ARRAY_PROP(NAME, PROP_NAME)\
    emscripten::function(#NAME"_array_length_"#PROP_NAME, ___##NAME##_array_length_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_array_get_"#PROP_NAME, ___##NAME##_array_get_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_array_set_"#PROP_NAME, ___##NAME##_array_set_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_array_add_"#PROP_NAME, ___##NAME##_array_add_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_array_remove_"#PROP_NAME, ___##NAME##_array_remove_##PROP_NAME,\
        allow_raw_pointers());\
    emscripten::function(#NAME"_array_clear_"#PROP_NAME, ___##NAME##_array_clear_##PROP_NAME,\
        allow_raw_pointers());

#define ___BIND_CLASS_METHOD(NAME, METHOD)\
    emscripten::function(#NAME"_"#METHOD, ___##NAME##_##METHOD,\
        allow_raw_pointers());

#define BIND_FUNCTION(RETURN, NAME, ARGS, ...)\
    auto ___##NAME = [](__VA_ARGS__) -> ___Arg<RETURN>::type {\
        return ___ToScript<RETURN>::fn(NAME ARGS);\
    }\
    ___BIND_FUNCTION(NAME)

#define BIND_FUNCTION_VOID(NAME, ARGS, ...)\
    auto ___##NAME = [](__VA_ARGS__) -> void {\
        NAME ARGS;\
    }\
    ___BIND_FUNCTION(NAME)

#define BIND_CLASS(NAME, ARGS, ...)\
    typedef ___EmscriptenObj (*___##NAME##_fn)(__VA_ARGS__);\
    ___##NAME##_fn ___##NAME = [](__VA_ARGS__) -> ___EmscriptenObj {\
        auto result = new NAME ARGS;\
        return ___EmscriptenObj(new NAME ARGS);\
    };\
    typedef void (*___##NAME##_destroy_fn)(___EmscriptenObj emscriptenObj);\
    ___##NAME##_destroy_fn ___##NAME##_destroy = [](___EmscriptenObj emscriptenObj) -> void {\
        delete (NAME *)emscriptenObj.obj;\
    };\
    ___BIND_CLASS(NAME)\
    BIND_CLASS_PROP(NAME, bool, dead)

#define BIND_CLASS_PROP(NAME, PROP_TYPE, PROP_NAME)\
    typedef ___Arg<PROP_TYPE>::type (*___##NAME##_get_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj);\
    ___##NAME##_get_##PROP_NAME##_fn ___##NAME##_get_##PROP_NAME = [](___EmscriptenObj emscriptenObj) -> ___Arg<PROP_TYPE>::type {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        return ___ToScript<PROP_TYPE>::fn(obj->PROP_NAME);\
    };\
    typedef void (*___##NAME##_set_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v));\
    ___##NAME##_set_##PROP_NAME##_fn ___##NAME##_set_##PROP_NAME = [](___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v)) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->PROP_NAME = v;\
    };\
    ___BIND_CLASS_PROP(NAME, PROP_NAME)

#define BIND_CLASS_ARRAY_PROP(NAME, PROP_TYPE, PROP_NAME)\
    typedef ___Arg<size_t>::type (*___##NAME##_array_length_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj);\
    ___##NAME##_array_length_##PROP_NAME##_fn ___##NAME##_array_length_##PROP_NAME = [](___EmscriptenObj emscriptenObj) -> ___Arg<size_t>::type {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        return ___ToScript<size_t>::fn(obj->PROP_NAME.size());\
    };\
    typedef ___Arg<PROP_TYPE>::type (*___##NAME##_array_get_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj, ARG(_, int, idx));\
    ___##NAME##_array_get_##PROP_NAME##_fn ___##NAME##_array_get_##PROP_NAME = [](___EmscriptenObj emscriptenObj, ARG(_, int, idx)) -> ___Arg<PROP_TYPE>::type {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        return ___ToScript<PROP_TYPE>::fn(obj->PROP_NAME[idx]);\
    };\
    typedef void (*___##NAME##_array_set_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj, ARG(_, int, idx), ARG(_, PROP_TYPE, v));\
    ___##NAME##_array_set_##PROP_NAME##_fn ___##NAME##_array_set_##PROP_NAME = [](___EmscriptenObj emscriptenObj, ARG(_, int, idx), ARG(_, PROP_TYPE, v)) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->PROP_NAME[idx] = v;\
    };\
    typedef void (*___##NAME##_array_add_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v));\
    ___##NAME##_array_add_##PROP_NAME##_fn ___##NAME##_array_add_##PROP_NAME = [](___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v)) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->PROP_NAME.add(v);\
    };\
    typedef void (*___##NAME##_array_remove_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v));\
    ___##NAME##_array_remove_##PROP_NAME##_fn ___##NAME##_array_remove_##PROP_NAME = [](___EmscriptenObj emscriptenObj, ARG(_, PROP_TYPE, v)) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->PROP_NAME.remove(v);\
    };\
    typedef void (*___##NAME##_array_clear_##PROP_NAME##_fn)(___EmscriptenObj emscriptenObj);\
    ___##NAME##_array_clear_##PROP_NAME##_fn ___##NAME##_array_clear_##PROP_NAME = [](___EmscriptenObj emscriptenObj) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->PROP_NAME.clear();\
    };\
    ___BIND_CLASS_ARRAY_PROP(NAME, PROP_NAME)

#define BIND_CLASS_METHOD(NAME, RETURN, METHOD, ARGS, ...)\
    typedef ___Arg<RETURN>::type (*___##NAME##_##METHOD##_fn)(___EmscriptenObj emscriptenObj, ##__VA_ARGS__);\
    ___##NAME##_##METHOD##_fn ___##NAME##_##METHOD = [](___EmscriptenObj emscriptenObj, ##__VA_ARGS__) -> ___Arg<RETURN>::type {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        return ___ToScript<RETURN>::fn(obj->METHOD ARGS);\
    };\
    ___BIND_CLASS_METHOD(NAME, METHOD)

#define BIND_CLASS_METHOD_VOID(NAME, METHOD, ARGS, ...)\
    typedef void (*___##NAME##_##METHOD##_fn)(___EmscriptenObj emscriptenObj, ##__VA_ARGS__);\
    ___##NAME##_##METHOD##_fn ___##NAME##_##METHOD = [](___EmscriptenObj emscriptenObj, ##__VA_ARGS__) -> void {\
        NAME *obj = (NAME *)emscriptenObj.obj;\
        obj->METHOD ARGS;\
    };\
    ___BIND_CLASS_METHOD(NAME, METHOD)
