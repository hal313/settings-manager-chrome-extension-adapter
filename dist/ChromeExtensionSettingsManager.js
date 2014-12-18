/*global chrome:false */

// Build User: jghidiu
// Version: 0.0.9
// Build Date: Thu Dec 18 2014 17:03:53 GMT-0500 (Eastern Standard Time)

// TODO: Safe callbacks

(function(root, factory) {
    'use strict';

    // Try to define a console object
    (function(){
        try {
            if (!console && ('undefined' !== typeof window)) {
                // Define the console if it does not exist
                if (!window.console) {
                    window.console = {};
                }

                // Union of Chrome, FF, IE, and Safari console methods
                var consoleFunctions = [
                    'log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'group',
                    'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd',
                    'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'
                ];
                // Define undefined methods as no-ops to prevent errors
                for (var i = 0; i < consoleFunctions.length; i++) {
                    if (!window.console[consoleFunctions[i]]) {
                        window.console[consoleFunctions[i]] = function() {};
                    }
                }
            }
        } catch(error) {
            // Not much to do if there is no console
        }

    })();

    // Determine the module system (if any)
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Node
        if (typeof exports !== 'undefined') {
            module.exports = factory();
        } else {
            // None
            root.TemplateManager = factory();
        }
    }

})(this, function() {
    'use strict';

    var _isFunction = function(func) {
        return 'function' === typeof func;
    };

    var ChromeExtensionSettingsManager = function() {

        var _load = function(successCallback, errorCallback) {
            chrome.storage.sync.get({}, function(settings){
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if (_isFunction(successCallback)) {
                    successCallback.call(null, settings);
                }
            });
        };

        var _save = function(settings, successCallback, errorCallback) {
            chrome.storage.sync.set(settings, function() {
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else if(_isFunction(successCallback)) {
                    successCallback.call(null);
                }
            });
        };

        var _clear = function(successCallback, errorCallback) {
            chrome.storage.sync.clear(function() {
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback.call(null);
                } else {
                    chrome.storage.sync.set({}, function() {
                        if(chrome.runtime.lastError && _isFunction(errorCallback)) {
                            errorCallback.call(null);
                        } else if(_isFunction(successCallback)) {
                            successCallback.call(null);
                        }
                    });
                }
            });
        };

        return {
            load: _load,
            save: _save,
            clear: _clear
        };

    };

    // Place the version as a member in the function
    ChromeExtensionSettingsManager.version = '0.0.9';

    return ChromeExtensionSettingsManager;

});