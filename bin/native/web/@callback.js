mergeInto(LibraryManager.library, {
    invokeCallback: function (callbackID) {
        var cb = _callbacks[callbackID]
        delete _callbacks[callbackID]
        cb()
    }
})
