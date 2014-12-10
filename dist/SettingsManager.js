/*global jQuery:false */
/*global chrome:false */

// TODO: Safe callbacks
// TODO: Externs
// TODO: Take a store implementation (and default to chrome.storage.sync)


(function(root, factory) {
    'use strict';

    (function(){
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
    })();

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        if (typeof exports !== 'undefined') {
            module.exports = factory();
        } else {
            root.SettingsManager = factory();
        }
    }

})(this, function() {
    'use strict';

    return function(defaultSettings) {

        // TODO: Use jquery for merges?

        var _defaultSettings = defaultSettings || {};

        var _getDefaultSettings = function() {
            return _defaultSettings;
        };

        var _load = function(successCallback, errorCallback) {
            chrome.storage.sync.get(_getDefaultSettings(), function(settings){
                if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                    errorCallback();
                } else if (jQuery.isFunction(successCallback)) {
                    successCallback(settings);
                }
            });
        };

        var _save = function(settings, successCallback, errorCallback) {
            chrome.storage.sync.set(settings, function() {
                if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                    errorCallback();
                } else if(jQuery.isFunction(successCallback)) {
                    successCallback();
                }
            });
        };

        var _clear = function(successCallback, errorCallback) {
            chrome.storage.sync.clear(function() {
                if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                    errorCallback();
                } else {
                    chrome.storage.sync.set(_getDefaultSettings(), function() {
                        if(chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                            errorCallback();
                        } else if(jQuery.isFunction(successCallback)) {
                            successCallback();
                        }
                    });
                }
            });
        };

        return {
            getDefaultSettings: _getDefaultSettings,
            load: _load,
            save: _save,
            clear: _clear
        };

    };

});