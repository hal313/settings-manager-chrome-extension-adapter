export function runSpecs(SettingsManagerChromeExtensionAdapter) {

    // Test different paths for saving
    let paths = [
        {use: null, expect: 'sm_ce'},
        {use: undefined, expect: 'sm_ce'},
        {use: '', expect: 'sm_ce'},
        {use: 'site_prefix', expect: 'site_prefix'}
    ];
    // Test 'sync' and 'local'
    let syncs = [true, false];
    // Test error and success
    let errors = [null, {message: 'failure'}];


    describe('Lifecycle', () => {

        it('should exist as a function', () => {
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

                                describe('load', () => {

                                    it('should invoke the Chrome API load function', () => {
                                        return new Promise((resolve, reject) => {

                                            function callback(/*value*/) {
                                                expect(currentStorageAPI.get).toHaveBeenCalledWith([path.expect], expect.any(Function));
                                                resolve();
                                            };

                                            if (!error) {
                                                settingsManagerChromeExtensionAdapter.load(callback, () => reject('should not call error on success'));
                                            } else {
                                                settingsManagerChromeExtensionAdapter.load(() => reject('should not call success on error'), callback);
                                            }
                                        });
                                    });

                                });

                                describe('save', () => {

                                    it('should invoke the Chrome API set function', () => {
                                        return new Promise((resolve, reject) => {
                                            let settings = {
                                                p1: true,
                                                p2: 'false',
                                                p3: 1
                                            }
                                            let expectedValue = {};
                                            expectedValue[path.expect] = settings;

                                            function callback() {
                                                expect(currentStorageAPI.set).toHaveBeenCalledWith(expectedValue, expect.any(Function));
                                                resolve();
                                            };

                                            if (!error) {
                                                settingsManagerChromeExtensionAdapter.save(settings, callback, () => reject('should not call error on success'));
                                            } else {
                                                settingsManagerChromeExtensionAdapter.save(settings, () => reject('should not call success on error'), callback);
                                            }

                                        });
                                    });

                                });

                                describe('clear', () => {

                                    it('should invoke the Chrome API set function with the correct payload path and a null value', () => {
                                        return new Promise((resolve, reject) => {
                                            let expectedValue = {};
                                            expectedValue[path.expect] = null;

                                            function callback() {
                                                expect(currentStorageAPI.set).toHaveBeenCalledWith(expectedValue, expect.any(Function));
                                                resolve();
                                            }

                                            if (!error) {
                                                settingsManagerChromeExtensionAdapter.clear(callback, () => reject('should not call error on success'));
                                            } else {
                                                settingsManagerChromeExtensionAdapter.clear(() => reject('should not call success on error'), callback);
                                            }
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    });

}

class StorageAPI {

    constructor() {
        let value = {};

        this.get = jest.fn(function getMock(path, callback) {
            if (!!callback) {
                callback(value);
            }
        });

        this.set = jest.fn(function setMock(newValue, callback) {
            // console.log('set', newValue);
            value = newValue;
            if(!!callback) {
                callback();
            }
        });

        // this.clear = jest.fn(function clearMock(callback) {
        //     console.log('clear');
        //     value = {};
        //     if(!!callback) {
        //         callback();
        //     }
        // });
    }

}
