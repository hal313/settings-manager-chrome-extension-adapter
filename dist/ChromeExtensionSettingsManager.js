// Build User: User
// Version: 1.0.3
// Build Date: Sun Jun 17 2018 22:48:52 GMT-0400 (Eastern Daylight Time)

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
    /**
     * Implementation for SettingsManager adapter for the Chrome Extension Settings API.
     */
    ChromeExtensionSettingsManager = function ChromeExtensionSettingsManager() {

        if (!(this instanceof ChromeExtensionSettingsManager)) {
            return new ChromeExtensionSettingsManager();
        }

        /**
         * Loads values.
         *
         * @param {Function} successCallback the callback invoked on success (with parameter {})
         */
        var load = function(successCallback, errorCallback) {
            global.chrome.storage.sync.get(function(settings) {
                if (!!global.chrome.runtime.lastError && isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (!global.chrome.runtime.lastError && isFunction(successCallback)) {
                    successCallback.call(null, settings);
                }
            });
        },
        /**
         * Saves values.
         *
         * @param {Object} settings the settings to save
         * @param {Function} successCallback the success callback to invoke on success
         */
        save = function(settings, successCallback, errorCallback) {
            global.chrome.storage.sync.set(settings, function() {
                if (!!global.chrome.runtime.lastError && isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (!global.chrome.runtime.lastError && isFunction(successCallback)) {
                    successCallback.call(null);
                }
            });
        },
        /**
         * Clears values.
         *
         * @param {Function} successCallback the success callback to invoke on success
         */
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
    ChromeExtensionSettingsManager.version = '1.0.3';

    return ChromeExtensionSettingsManager;
});