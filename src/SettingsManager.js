/*global chrome:false */

// Build User: ${build.user}
// Version: ${build.version}
// Build Date: ${build.date}

// TODO: Safe callbacks
// TODO: Externs
// TODO: Take a store implementation (and default to chrome.storage.sync)


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
        return func && 'function' === typeof func;
    };

    // TODO: Rename files
    var ChromeSettingsStore = function() {

        if (!(this instanceof ChromeSettingsStore)) {
            return new ChromeSettingsStore();
        }

        var _load = function(successCallback, errorCallback) {
            chrome.storage.sync.get(function(settings){
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback();
                } else if (_isFunction(successCallback)) {
                    successCallback(settings);
                }
            });
        };

        var _save = function(settings, successCallback, errorCallback) {
            chrome.storage.sync.set(settings, function() {
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback();
                } else if(_isFunction(successCallback)) {
                    successCallback();
                }
            });
        };

        var _clear = function(successCallback, errorCallback) {
            chrome.storage.sync.clear(function() {
                if (chrome.runtime.lastError && _isFunction(errorCallback)) {
                    errorCallback();
                } else {
                    chrome.storage.sync.set(function() {
                        if(chrome.runtime.lastError && _isFunction(errorCallback)) {
                            errorCallback();
                        } else if(_isFunction(successCallback)) {
                            successCallback();
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
    // TODO: Uncomment once build resolvers are enabled
    // ChromeSettingsStore.version = '${build.version}';

    return ChromeSettingsStore;

});