const { mergeInto, LibraryManager, _callbacks } = window

mergeInto(LibraryManager.library, {
    invokeCallback(callbackID) {
        const cb = _callbacks[callbackID]
        delete _callbacks[callbackID]
        cb()
    },
})
