// Setup the Chrome API (for this example; when running in the context of a Chrome extension, this is not necessary)
window.chrome = {
    storage: {},
    runtime: {
        lastError: undefined
    }
};
// Create a simple storage API (path is ignored, error callback is ignored)
chrome.storage.actual = {
    get: function get(path, callback) {
        callback(chrome.storage.local.settings);
    },
    set: function set(settings, callback) {
        chrome.storage.local.settings = settings;
        callback();
    },
    clear: function clear(callback) {
        chrome.storage.local.settings = null;
        callback();
    }
};
// Assign both local and sync to be the actual
chrome.storage.local = chrome.storage.actual;
chrome.storage.sync = chrome.storage.actual;
