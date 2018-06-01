// Build User: User
// Version: 0.0.15
// Build Date: Fri Jun 01 2018 18:22:05 GMT-0400 (Eastern Daylight Time)

(function(root, factory) {
    'use strict';

    // Determine the module system (if any)
    if ('function' === typeof define && define.amd) {
        // AMD
        define([root], factory);
    } else {
        // Node
        if ('undefined' !== typeof exports) {
            module.exports = factory(root);
        } else {
            // None
            root.ChromeExtensionSettingsManager = factory(root);
        }
    }
})(window || this, function(global) {
    'use strict';

    var isFunction = function isFunction(func) {
        return 'function' === typeof func;
    },
    ChromeExtensionSettingsManager = function ChromeExtensionSettingsManager() {

        if (!(this instanceof ChromeExtensionSettingsManager)) {
            return new ChromeExtensionSettingsManager();
        }

        var load = function(successCallback, errorCallback) {
            global.chrome.storage.sync.get(function(settings) {
                if (!!global.chrome.runtime.lastError && isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (!global.chrome.runtime.lastError && isFunction(successCallback)) {
                    successCallback.call(null, settings);
                }
            });
        },
        save = function(settings, successCallback, errorCallback) {
            global.chrome.storage.sync.set(settings, function() {
                if (!!global.chrome.runtime.lastError && isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (!global.chrome.runtime.lastError && isFunction(successCallback)) {
                    successCallback.call(null);
                }
            });
        },
        clear = function(successCallback, errorCallback) {
            global.chrome.storage.sync.clear(function() {
                if (!!global.chrome.runtime.lastError && isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (!global.chrome.runtime.lastError && isFunction(successCallback)) {
                    successCallback.call(null);
                }
            });
        };

        return {
            load: load,
            save: save,
            clear: clear
        };

    };

    // Place the version as a member in the function
    ChromeExtensionSettingsManager.version = '0.0.15';

    return ChromeExtensionSettingsManager;
});