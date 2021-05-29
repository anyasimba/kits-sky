# production
rwildcard=$(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2))

ENGINE_BUILD_DIR = $(PROJECT_PATH)/.vscode/storage/engine-web-native
PROJECT = $(PROJECT_PATH)/.vscode/storage/$(PROJECT_NAME)/web-native

ENGINE_SOURCES = $(ENGINE_PATH)/bin/native/web/main.cc $(call rwildcard,$(ENGINE_PATH)/src/common/native,*.cc)
ENGINE_HEADERS = $(call rwildcard,$(ENGINE_PATH)/src/common/native,*.h)
OBJECTS = $(patsubst $(ENGINE_PATH)/%.cc,$(ENGINE_BUILD_DIR)/%.o,$(ENGINE_SOURCES))

CXX := em++
CC := emcc
CXXFLAGS := --bind -O2 -std=c++11 -I$(ENGINE_PATH)  -g
LDFLAGS := --bind -O2 --js-library $(ENGINE_PATH)/bin/native/web/callback.js --memory-init-file 0 -g
TARGET := js

$(OBJECTS): $(ENGINE_SOURCES) $(ENGINE_HEADERS)
	@mkdir -p $(dir $@)
	$(eval FILE := $(patsubst $(ENGINE_BUILD_DIR)/%.o,$(ENGINE_PATH)/%.cc,$@))
	$(CC) $(CXXFLAGS) $(FILE) -o $@

compile: $(OBJECTS)
	@mkdir -p $(dir $(PROJECT))
	@$(CC) $(LDFLAGS) -o $(PROJECT).$(TARGET) $^

show-objects:
	@echo $(OBJECTS)
