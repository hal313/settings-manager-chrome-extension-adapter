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
     * @returns {Promise} resolves with the settings or rejects on error
     */
    load() {
        return new Promise((resolve, reject) => {
            this.storage.get([this.path], settings => {
                if (!!getError()) {
                    reject();
                } else {
                    resolve(settings || {});
                }
            });
        });
    };

    /**
     * Saves values.
     *
     * @param {Object} settings the settings to save
     * @returns {Promise} resolves on success or rejects on error
     */
    save(settings) {
        return new Promise((resolve, reject) => {
            let value = {};
            value[this.path] = settings;

            this.storage.set(value, () => {
                if (!!getError()) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    };

    /**
     * Clears values.
     *
     * @returns {Promise} resolves on success or rejects on error
     */
    clear() {
        // Do not call clear - that will clear all settings! Just set the path value to null
        return this.save(null);
    };

};
