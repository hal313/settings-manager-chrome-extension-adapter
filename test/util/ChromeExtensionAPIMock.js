/* global module: false */

(function (global) {
    'use strict';

    var ChromeExtensionAPIMock = function ChromeExtensionAPIMock() {
        // The stored settings
        var internalSettings = {},
            onGetExecutedListener = null,
            onSetExecutedListener = null,
            onClearExecutedListener = null,
            chrome = {
                runtime: {},
                storage: {
                    sync: {

                    }
                }
            },
            /**
             * Invokes a function.
             *
             * @param {function} fn the function to invoke
             * @param {*[]} args the arguments to pass in
             * @param {*} [context] the context
             */
            invoke = function invoke(fn, args, context) {
                // For ease of use, upconvert args to an array
                if ('function' === typeof fn) {
                    fn.apply(context || {}, Array.isArray(args) ? args : [args]);
                }
            },
            invokeListener = function invokeListener(callback, value, onCompleteCallback) {
                invoke(callback, value);
                invoke(onCompleteCallback);
            };

        // Mock of the Chrome extension storage API
        chrome.storage.sync.get = function (callback) {
            global.setTimeout(function () {
                invokeListener(callback, internalSettings, onGetExecutedListener);
            });
        };
        chrome.storage.sync.set = function (settings, callback) {
            internalSettings = settings;
            global.setTimeout(function () {
                invokeListener(callback, undefined, onSetExecutedListener);
            });
        };
        chrome.storage.sync.clear = function (callback) {
            internalSettings = {};
            global.setTimeout(function () {
                invokeListener(callback, undefined, onClearExecutedListener);
            });
        };

        return {
            getError: function getError() {
                return chrome.runtime.lastError;
            },
            setError: function setError(error) {
                // The runtime; to simulate an error, set:
                // chrome.runtime.lastError = someValue;
                chrome.runtime.lastError = error || {};
            },
            clearError: function clearError() {
                chrome.runtime = {};
            },
            setOnGetExecutedListener: function setOnGetExecutedListener(listener) {
                onGetExecutedListener = listener;
            },
            clearOnGetExecutedListener: function clearOnGetExecutedListener(listener) {
                onGetExecutedListener = null;
            },
            setOnSetExecutedListener: function setOnSetExecutedListener(listener) {
                onSetExecutedListener = listener;
            },
            clearOnSetExecutedListener: function clearOnSetExecutedListener(listener) {
                onSetExecutedListener = null;
            },
            setOnClearExecutedListener: function setOnClearExecutedListener(listener) {
                onClearExecutedListener = listener;
            },
            clearOnClearExecutedListener: function clearOnClearExecutedListener(listener) {
                onClearExecutedListener = null;
            },
            getChromeExtensionAPI: function getChromeExtensionAPI() {
                return chrome;
            },
            setSettings: function setSettings(settings) {
                internalSettings = settings;
            },
            clearSettings: function clearSettings() {
                internalSettings = {};
            },
            getSettings: function getSettings() {
                return internalSettings;
            }
        };

    };

    module.exports = ChromeExtensionAPIMock;

})(window || this);