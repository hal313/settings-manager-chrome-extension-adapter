/* global beforeEach, describe, it, jest: true */

// This file runs specs against an instance of the ChromeExtensionSettingsManager; a
// suitable ChromeExtensionStorageAPI is injected for mocking.

(function (global) {
    'use strict';

    module.exports = function() {
        return {
            runSpecs: function runSpecs(ChromeExtensionSettingsManager, ChromeExtensionStorageAPI) {
                var chromeExtensionSettingsManager,
                    chromeExtensionStorageAPI = new ChromeExtensionStorageAPI(),
                    api = chromeExtensionStorageAPI.getChromeExtensionAPI(),
                    settings;

                // Set the global
                global.chrome = api;

                describe('Lifecycle', function () {

                    it('ChromeExtensionSettingsManager should exist as a global', function () {
                        expect(ChromeExtensionSettingsManager).toBeDefined();
                    });

                    it('ChromeExtensionSettingsManager should exist as a function', function () {
                        expect(ChromeExtensionSettingsManager).toBeInstanceOf(Function);
                    });

                });

                describe('API', function () {

                    beforeEach(function () {
                        // Default settings
                        settings = {
                            someSetting: 'someValue'
                        };

                        // The settings (this will be returned by the mocked ChromeExtensionAPI)
                        chromeExtensionStorageAPI.setSettings(settings);

                        // The ChromeExtensionSettingsManager instance
                        chromeExtensionSettingsManager = new ChromeExtensionSettingsManager();

                        // Setup the spies
                        jest.spyOn(api.storage.sync, 'get');
                        jest.spyOn(api.storage.sync, 'set');
                        jest.spyOn(api.storage.sync, 'clear');
                    });

                    afterEach(function resetValues() {
                        // Reset the values for the Chrome API
                        chromeExtensionStorageAPI.clearError();

                        // Clear the settings
                        chromeExtensionStorageAPI.clearSettings();

                        // These are the callbacks for the Chrome extension storage API; this is useful to make sure async tests know when to finish
                        // Reset the callbacks for the Chrome Test API
                        chromeExtensionStorageAPI.clearOnGetExecutedListener();
                        chromeExtensionStorageAPI.clearOnSetExecutedListener();
                        chromeExtensionStorageAPI.clearOnClearExecutedListener();

                        // Reset the spy history
                        jest.restoreAllMocks();
                    });

                    describe('load()', function () {

                        it('should return the initial settings', function (done) {
                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.load(function (settings) {
                                // Check expectations
                                expect(api.storage.sync.get).toHaveBeenCalledTimes(1);
                                expect(chromeExtensionStorageAPI.getSettings()).toEqual(settings);

                                done();
                            });
                        });

                        it('should invoke the failure callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn();

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.load(successCallback, function () {
                                // Check expectations
                                expect(api.storage.sync.get).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled()

                                done();
                            });
                        });

                        it('should not invoke the success callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn();

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.load(successCallback);

                            chromeExtensionStorageAPI.setOnGetExecutedListener(function onGetExecuted() {
                                // Check expectations
                                expect(api.storage.sync.get).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled();

                                done();
                            });
                        });

                    });

                    describe('save()', function () {

                        it('should return execute the success callback', function (done) {
                            // The new settings
                            var newSettings = {
                                newSetting: 'newValue'
                            };

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.save(newSettings, function () {
                                // Check expectations
                                expect(api.storage.sync.set).toHaveBeenCalledTimes(1);

                                done();
                            });
                        });

                        it('should invoke the failure callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn(),
                                // The new settings
                                newSettings = {
                                    newSetting: 'newValue'
                                };

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.save(newSettings, successCallback, function () {
                                // Check expectations
                                expect(api.storage.sync.set).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled();

                                done();
                            });
                        });

                        it('should not invoke the success callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn(),
                                // The new settings
                                newSettings = {
                                    newSetting: 'newValue'
                                };

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Set the mock callback
                            chromeExtensionStorageAPI.setOnSetExecutedListener(function onSetExecuted() {
                                // Check expectations
                                expect(api.storage.sync.set).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled();

                                done();
                            });

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.save(newSettings, successCallback);
                        });

                    });

                    describe('clear()', function () {

                        it('should return execute the success callback', function (done) {
                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.clear(function () {
                                // Check expectations
                                expect(api.storage.sync.clear).toHaveBeenCalledTimes(1);

                                done();
                            });
                        });

                        it('should invoke the failure callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn();

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.clear(successCallback, function () {
                                expect(api.storage.sync.clear).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled();

                                done();
                            });
                        });

                        it('should not invoke the success callback on error', function (done) {
                            // Create a callback
                            var successCallback = jest.fn();

                            // Set an error
                            chromeExtensionStorageAPI.setError();

                            // Set the mock callback
                            chromeExtensionStorageAPI.setOnClearExecutedListener(function onClearExecuted() {
                                // Check expectations
                                expect(api.storage.sync.clear).toHaveBeenCalledTimes(1);
                                expect(successCallback).not.toHaveBeenCalled();

                                done();
                            });

                            // Invoke the API function with the callback
                            chromeExtensionSettingsManager.clear(successCallback);
                        });

                    });

                });

            }
        };
    }

})(window || this);