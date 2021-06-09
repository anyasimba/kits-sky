#pragma once
#include <algorithm>
#include <type_traits>
#include <vector>
using namespace std;

template<class T>
struct Array: vector<T> {
    Array() {}
    explicit Array(const size_t count) : vector<T>(count) {}

    void add(const T& v) {
        this->push_back(v);
    }
    
    void remove(const T& v) {
        auto it = find(this->begin(), this->end(), v);
        if (it != this->end()) {
            this->erase(it);
        }
    }

    template<class NT, class F>
    Array<NT> map(F fn) {
        Array<NT> result;
        transform(this->begin(), this->end(), result.begin(), fn);
        return result;
    }
};

#define FOR(I, ARRAY)\
    for (size_t I = 0; I < ARRAY.size(); ++I)
