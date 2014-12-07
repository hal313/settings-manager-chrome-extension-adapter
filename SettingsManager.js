/*global jQuery:false */
/*global chrome:false */

// TODO: Make singleton
// TODO: Safe callbacks
// TODO: Externs

var SettingsManager = function(defaultSettings) {
    'use strict';

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