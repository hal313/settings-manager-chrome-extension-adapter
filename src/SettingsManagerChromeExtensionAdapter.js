import { executeAsync}  from '@hal313/settings-manager';

function getError() {
    if (!!window.chrome && !!window.chrome.runtime && !!window.chrome.runtime.lastError) {
        return window.chrome.runtime.lastError;
    } else {
        return;
    }
}

/**
 * Implementation for SettingsManager adapter for the Chrome Extension Settings API.
 */
export class SettingsManagerChromeExtensionAdapter {

    constructor(useSync, path) {
        this.path = path || 'sm_ce';
        this.storage = !!useSync ? chrome.storage.sync : chrome.storage.local;
    }

    /**
     * Loads values.
     *
     * @param {Function} successCallback the callback invoked on success (with parameter {})
     */
    load(successCallback, errorCallback) {
        this.storage.get([this.path], settings => {
            if (!!getError()) {
                executeAsync(errorCallback);
            } else {
                executeAsync(successCallback, [settings]);
            }
        });
    };

    /**
     * Saves values.
     *
     * @param {Object} settings the settings to save
     * @param {Function} successCallback the success callback to invoke on success
     */
    save(settings, successCallback, errorCallback) {
        let value = {};
        value[this.path] = settings;

        this.storage.set(value, () => {
            if (!!getError()) {
                executeAsync(errorCallback);
            } else {
                executeAsync(successCallback);
            }
        });
    };

    /**
     * Clears values.
     *
     * @param {Function} successCallback the success callback to invoke on success
     */
    clear(successCallback, errorCallback) {
        // Do not call clear - that will clear all settings! Just set the path value to null
        this.save(null, successCallback, errorCallback);
    };

};
