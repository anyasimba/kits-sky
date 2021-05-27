#pragma once
#include <functional>
#include <type_traits>
#include <vector>
using namespace std;

#include "Array.h"
#include "@bindings/@.h"
#include "math/@.h"
#include "Octhree.h"

struct Native {
    bool disposed = false;
};
