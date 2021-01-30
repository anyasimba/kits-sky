# production
rwildcard=$(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2))

ENGINE_BUILD_DIR = $(PROJECT_PATH)/.vscode/storage/engine-web
PROJECT = $(PROJECT_PATH)/.vscode/storage/$(PROJECT_NAME)/native

ENGINE_SOURCES = extras/native/web/main.cc $(call rwildcard,src/common/@native,*.cc)
ENGINE_HEADERS = $(call rwildcard,src/common/@native,*.h)
OBJECTS = $(patsubst %.cc,$(ENGINE_BUILD_DIR)/%.o,$(ENGINE_SOURCES))

CXX := em++
CC := emcc
CXXFLAGS := --bind -O2 -std=c++11 -I. -g
LDFLAGS := --bind -O2 --js-library extras/native/web/@callback.js --memory-init-file 0 -g
TARGET := js

$(OBJECTS): $(ENGINE_SOURCES) $(ENGINE_HEADERS)
	@mkdir -p $(dir $@)
	$(eval FILE := $(patsubst $(ENGINE_BUILD_DIR)/%.o,%.cc,$@))
	$(CC) $(CXXFLAGS) $(FILE) -o $@

compile: $(OBJECTS)
	@mkdir -p $(dir $(PROJECT))
	@$(CC) $(LDFLAGS) -o $(PROJECT).$(TARGET) $^

show-objects:
	@echo $(OBJECTS)
