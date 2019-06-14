export function runSpecs(SettingsManagerChromeExtensionAdapter) {

    // Test different paths for saving
    let paths = [
        {use: null, expect: 'sm_ce'},
        {use: undefined, expect: 'sm_ce'},
        {use: '', expect: 'sm_ce'},
        {use: 'site_prefix', expect: 'site_prefix'}
    ];
    // Test 'sync' and 'local'
    let syncs = [
        true,
        false
    ];
    // Test error and success
    let errors = [
        {message: 'failure'},
        null
    ];

    describe('Lifecycle', () => {

        it('should exist as a function', () => {
            expect.assertions(1);

            expect(SettingsManagerChromeExtensionAdapter).toEqual(expect.any(Function));
        });

    });

    describe('API', () => {

        syncs.forEach(sync => {

            describe(`sync: ${sync}`, () => {

                paths.forEach(path => {

                    describe(`path: ${JSON.stringify(path)}`, () => {

                        errors.forEach(error => {

                            describe(`error: ${JSON.stringify(error)}`, () => {
                                // The settings manager adapter
                                let settingsManagerChromeExtensionAdapter;
                                // The storage API under test (sync or local)
                                let currentStorageAPI;

                                beforeEach(() => {
                                    // Setup the Chrome API
                                    global.chrome = {
                                        storage: {
                                            sync: new StorageAPI(),
                                            local: new StorageAPI()
                                        },
                                        runtime: {
                                            lastError: error
                                        }
                                    };

                                    // Assign the current storage API
                                    currentStorageAPI = !!sync ? global.chrome.storage.sync : global.chrome.storage.local;

                                    // Instantiate the settings manager instance
                                    settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter(sync, path.use);
                                });


                                /**
                                 * Asserts that the "then" function was not invoked when an error condition was present.
                                 *
                                 * @param {*} result the value passed in
                                 * @returns {*} result
                                 */
                                function assertThen(result) {
                                    if (!!error) {
                                        // Simplest way to fail
                                        fail('"then" should not be invoked when an error is present');
                                    }

                                    // Return the value for chaining
                                    return result;
                                }

                                /**
                                 * Asserts that the "catch" function was not invoked when no error condition was present.
                                 *
                                 * @param {*} thrown the error
                                 */
                                function assertCatch(thrown) {
                                    if (!!error && !!thrown) {
                                        // The API should never throw with a reason; if 'thrown' exists, the error probably
                                        // came from the previous 'then' blocks (in which case, the test should fail)
                                        expect(thrown).not.toBeDefined();
                                    }

                                    if (!error) {
                                        // Easy way to fail
                                        fail('"catch" should not be invoked when no error is present');
                                    }
                                }

                                describe('load', () => {

                                    it('should invoke the Chrome API load function', () => {
                                        // Change expectation count based on error state
                                        expect.assertions(!!error ? 1 : 2);

                                        return settingsManagerChromeExtensionAdapter.load()
                                        .then(assertThen)
                                        .then(settings => expect(settings).toBeDefined())
                                        .catch(assertCatch)
                                        .then(() => expect(currentStorageAPI.get).toHaveBeenCalledWith([path.expect], expect.any(Function)));
                                    });

                                    it('should return saved settings', () => {
                                        // Change expectation count based on error state
                                        expect.assertions(!!error ? 0 : 2);

                                        let savedSettings = {
                                            one: 1,
                                            two: 'two',
                                            bool: true,
                                            sub: {
                                                root: 'parent'
                                            }
                                        };

                                        return settingsManagerChromeExtensionAdapter.clear()
                                        .then(assertThen)
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual({}))
                                        .then(() => settingsManagerChromeExtensionAdapter.save(savedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual(savedSettings))
                                        .catch(assertCatch);
                                    });

                                });

                                describe('save', () => {

                                    it('should invoke the Chrome API set function', () => {
                                        expect.assertions(1);

                                        let settings = {
                                            p1: true,
                                            p2: 'false',
                                            p3: 1
                                        }
                                        let expectedValue = {};
                                        expectedValue[path.expect] = settings;

                                        return settingsManagerChromeExtensionAdapter.save(settings)
                                        .then(assertThen)
                                        .catch(assertCatch)
                                        .then(() => expect(currentStorageAPI.set).toHaveBeenCalledWith(expectedValue, expect.any(Function)));
                                    });

                                    it('should save settings', () => {
                                        // Change expectation count based on error state
                                        expect.assertions(!!error ? 0 : 2);

                                        let savedSettings = {
                                            one: 1,
                                            two: 'two',
                                            bool: true,
                                            sub: {
                                                root: 'parent'
                                            }
                                        };

                                        return settingsManagerChromeExtensionAdapter.clear()
                                        .then(assertThen)
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual({}))
                                        .then(() => settingsManagerChromeExtensionAdapter.save(savedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual(savedSettings))
                                        .catch(assertCatch);
                                    });

                                    it('should overwrite previously saved settings', () => {
                                        // Change expectation count based on error state
                                        expect.assertions(!!error ? 0 : 3);

                                        let originalSavedSettings = {
                                            one: 1,
                                            two: 'two',
                                            bool: true,
                                            sub: {
                                                root: 'parent'
                                            }
                                        };
                                        let newSavedSettings = {
                                            three: 3,
                                            four: 'four',
                                            bool: false,
                                            sub: {
                                                none: null
                                            }
                                        };

                                        return settingsManagerChromeExtensionAdapter.clear()
                                        .then(assertThen)
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual({}))
                                        .then(() => settingsManagerChromeExtensionAdapter.save(originalSavedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual(originalSavedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.save(newSavedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual(newSavedSettings))
                                        .catch(assertCatch);
                                    });

                                });

                                describe('clear', () => {

                                    it('should invoke the Chrome API set function with the correct payload path and a null value', () => {
                                        expect.assertions(1);

                                        let expectedValue = {};
                                        expectedValue[path.expect] = null;

                                        return settingsManagerChromeExtensionAdapter.clear()
                                        .then(assertThen)
                                        .catch(assertCatch)
                                        .then(() => expect(currentStorageAPI.set).toHaveBeenCalledWith(expectedValue, expect.any(Function)));
                                    });

                                    it('should clear settings', () => {
                                        // Change expectation count based on error state
                                        expect.assertions(!!error ? 0 : 3);

                                        let savedSettings = {
                                            one: 1,
                                            two: 'two',
                                            bool: true,
                                            sub: {
                                                root: 'parent'
                                            }
                                        };

                                        return settingsManagerChromeExtensionAdapter.clear()
                                        .then(assertThen)
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual({}))
                                        .then(() => settingsManagerChromeExtensionAdapter.save(savedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual(savedSettings))
                                        .then(() => settingsManagerChromeExtensionAdapter.clear())
                                        .then(() => settingsManagerChromeExtensionAdapter.load())
                                        .then(settings => expect(settings).toEqual({}))
                                        .catch(assertCatch);
                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    });

    // Test the integration of this adapter with the actual SettingsManager
    describe('Integration', () => {
        // The SettingsManager
        let SettingsManager = require('@hal313/settings-manager').SettingsManager;

        // The settings manager adapter
        let settingsManagerChromeExtensionAdapter;
        // The settings manager
        let settingsManager;

        beforeEach(done => {
            // Setup the Chrome API
            global.chrome = {
                storage: {
                    local: new StorageAPI()
                },
                runtime: {
                    lastError: undefined
                }
            };

            // Instantiate the settings manager instance
            settingsManagerChromeExtensionAdapter = new SettingsManagerChromeExtensionAdapter();
            settingsManager = new SettingsManager(settingsManagerChromeExtensionAdapter);

            // Ensure that the assertion is executed
            expect.assertions(1);
            // Start with a clean slate (empty settings)
            settingsManager.clear(() => {

                // Load the settings
                settingsManager.load(settings => {

                    // Verify that there are no settings
                    expect(settings).toEqual({});
                    done();
                });
            });
        });

        it('should load settings', done => {
            expect.assertions(2);

            let firstSettings = {
                one: 1,
                two: 'two',
                bool: true,
                sub: {
                    root: 'parent'
                }
            };

            // Save some settings
            settingsManager.save(firstSettings, () => {

                // Load the settings
                settingsManager.load(settings => {

                    // Check to make sure that the settings are correct
                    expect(settings).toEqual(firstSettings);
                    // Done!
                    done();
                });
            });
        });

        it('should save settings', done => {
            expect.assertions(2);

            let firstSettings = {
                one: 1,
                two: 'two',
                bool: true,
                sub: {
                    root: 'parent'
                }
            };

            // Save some settings
            settingsManager.save(firstSettings, () => {

                // Load the settings
                settingsManager.load(settings => {

                    // Check that the settings are correct
                    expect(settings).toEqual(firstSettings);
                    // Done!
                    done();
                });
            });
        });

        it('should clear settings', done => {
            expect.assertions(3);

            let firstSettings = {
                one: 1,
                two: 'two',
                bool: true,
                sub: {
                    root: 'parent'
                }
            };

            // Save some settings
            settingsManager.save(firstSettings, () => {

                // Load the settings
                settingsManager.load(settings => {
                    expect(settings).toEqual(firstSettings);

                    // Clear the settings
                    settingsManager.clear(() => {

                        // Load settings
                        settingsManager.load(settings => {

                            // Expect there to be no saved settings
                            expect(settings).toEqual({});
                            done();
                        });
                    });
                });
            });
        });

        it('should merge settings', done => {
            expect.assertions(3);

            let firstSettings = {
                one: 1,
                two: 'two',
                bool: true,
                sub: {
                    root: 'parent'
                }
            };
            let secondSettings = {
                three: 3,
                four: 'four',
                bool: false,
                sub: {
                    none: null
                }
            };
            let mergedSettings = {
                one: 1,
                two: 'two',
                three: 3,
                four: 'four',
                bool: false,
                sub: {
                    none: null,
                    root: 'parent'
                }
            };

            // Save some settings
            settingsManager.save(firstSettings, () => {

                // Load the settings to check that the settings were saved
                settingsManager.load(settings => {
                    expect(settings).toEqual(firstSettings);

                    // Save a second set of settings
                    settingsManager.save(secondSettings, () => {

                        // Load the settings to check that the settings were saved
                        settingsManager.load(settings => {
                            // Verify that the settings were merged
                            expect(settings).toEqual(mergedSettings);
                            done();
                        });
                    });
                });
            });
        });

    });

}

// A mock of the Chrome Extension Storage API.
class StorageAPI {

    constructor() {
        let value = {

        };

        this.get = jest.fn(function getMock(path, callback) {
            if (!!callback) {
                callback(value[path]);
            }
        });

        this.set = jest.fn(function setMock(newValue, callback) {
            value = newValue;
            if(!!callback) {
                callback();
            }
        });

        // The "clear" API call; not needed because the adapter implementation calls "set[key]=null" instead of clear
        // this.clear = jest.fn(function clearMock(callback) {
        //     console.log('clear');
        //     value = {};
        //     if(!!callback) {
        //         callback();
        //     }
        // });
    }

}
