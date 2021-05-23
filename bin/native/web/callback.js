/* eslint-disable no-undef */
mergeInto(LibraryManager.library, {
    invokeCallback(callbackID) {
        const cb = _callbacks[callbackID]
        delete _callbacks[callbackID]
        cb()
    },
})
