/**
 * Determines if a value is a function.
 *
 * @param {*} candidate the candidate to test
 * @returns {boolean} true, if candidate is a Function
 */
export function isFunction(candidate) {
    return 'function' === typeof candidate;
}

/**
 * Determines if a value is an object.
 *
 * @param {*} candidate the candidate to test
 * @returns {boolean} true, if candidate is an object
 */
export function isObject(candidate) {
    return null !== candidate && 'object' === typeof candidate && !isArray(candidate);
}

/**
 * Determines if a value is an array.
 *
 * @param {*} candidate the candidate to test
 * @returns {boolean} true, if candidate is an array
 */
export function isArray(candidate) {
    return Array.isArray(candidate);
}

/**
 * Merges two objects; members of the second object take precedence over the first object.
 *
 * @param {Object} target an object to merge to
 * @returns {Object} the target object, populated with the source object's members
 */
export function merge(target, source) {
    // Merge algorithm adapted from:
    // From (http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically)

    let array = isArray(source),
        dest = array && [] || {};

    if (array) {
        target = target || [];
        dest = dest.concat(target);
        source.forEach(function onItem(e, i) {
            if ('undefined' === typeof dest[i]) {
                dest[i] = e;
            } else if ('object' === typeof e) {
                dest[i] = merge(target[i], e);
            } else {
                if (target.indexOf(e) === -1) {
                    dest.push(e);
                }
            }
        });
    } else {
        if (isObject(target)) {
            Object.keys(target || {}).forEach(function (key) {
                dest[key] = target[key];
            });
        }
        Object.keys(source || {}).forEach(function (key) {
            if (!isObject(source[key]) || !source[key]) {
                dest[key] = source[key];
            }
            else {
                if (!target[key]) {
                    dest[key] = source[key];
                } else {
                    dest[key] = merge(target[key], source[key]);
                }
            }
        });
    }

    return dest;
}

/**
 * Executes a function.
 *
 * @param {Function} fn the function to execute
 * @param {*[]} args an array of arguments to execute the function with
 * @param {Object} [context] the optional context
 * @returns {*} the return value of the function execution, or null if no function is provided
 */
export function execute(fn, args, context) {
    return new Promise((resolve, reject) => {
        if (isFunction(fn)) {
            try {
                resolve(fn.apply(context || {}, args))
            } catch (error) {
                reject(error);
            }
        }
        resolve();
    });
}

/**
 * A store implementation in memory.
 */
export class InMemoryStore {

    /**
     * Creates an instance.
     */
    constructor() {
        this.settings = {};
    }

    /**
     * Loads values.
     *
     * @returns {Promise} resolves with the settings
     */
    load() {
        return Promise.resolve(merge({}, this.settings));
    };

    /**
     * Saves values.
     *
     * @param {Object} settings the settings to save
     * @returns {Promise} resolves with the settings
     */
    save(settings) {
        // Assign the settings
        this.settings = settings;

        // Return the settings
        return this.load();
    };

    /**
     * Clears values.
     *
     * @returns {Promise} resolves with empty settings
     */
    clear() {
        // Save the empty settings
        return this.save({});
    };

};

/**
 * Implementation for SettingsManager, a class for storing settings.
 *
 * @param {Object} [backingStore] optional backing store to wrap
 */
export class SettingsManager {

    /**
     * Creates a SettingsManager instance backed by an optional store.
     *
     * @param {Store} [backingStore] optional store implementation to use
     */
    constructor(backingStore) {
        this.backingStore = backingStore || new InMemoryStore();
    }

    /**
     * Loads values.
     *
     * @param {Function} [successCallback] the callback invoked on success (invoked with the settings)
     * @param {Function} [errorCallback] the error callback, invoked on failure
     * @returns {Promise} always resolves (never rejects) after the callback has been invoked
     */
    load(successCallback, errorCallback) {
        return cleanBackingStoreFunctionPromise(this.backingStore.load(), successCallback, errorCallback);
    };

    /**
     * Saves values.
     *
     * @param {Object} settings the settings to save
     * @param {Function} [successCallback] the callback invoked on success
     * @param {Function} [errorCallback] the error callback, invoked on failure
     * @returns {Promise} always resolves (never rejects) after the callback has been invoked
     */
    save(settings, successCallback, errorCallback) {
        if (!settings || !isObject(settings)) {
            return cleanPromise(execute(errorCallback, ['"settings" is not an object']));
        } else {
            return cleanBackingStoreFunctionPromise(
                // Merge with existing settings
                this.backingStore.load().then(loadedSettings => this.backingStore.save(merge(loadedSettings, settings))).then(() => this.backingStore.load()),
                successCallback,
                errorCallback
            );
        }
    };

    /**
     * Clears values.
     *
     * @param {Function} successCallback the success callback to invoke on success
     * @param {Function} [errorCallback] the error callback, invoked on failure
     * @returns {Promise} resolves
     */
    clear(successCallback, errorCallback) {
        return cleanBackingStoreFunctionPromise(this.backingStore.clear(), successCallback, errorCallback);
    };

}


/**
 * Cleans a promise by adding a no-op then and a no-op catch.
 *
 * @param {Promise} promise the promise to clean
 * @return {Promise} a promise which always resolves nothing
 */
function cleanPromise(promise) {
    return promise.then(() => {}).catch(() => {});
}

/**
 * Cleans a promise from a backing store call and invokes the correct callback.
 *
 * @param {Promise} backingStorePromise the promise from the backing store function
 * @param {Function} [successCallback] the success callback (invoked with the result from the backing store function)
 * @param {Function} [errorCallback] the error callback (invoked with the error from the backing store function)
 */
function cleanBackingStoreFunctionPromise(backingStorePromise, successCallback, errorCallback) {
    return backingStorePromise
    .then(result => cleanPromise(execute(successCallback, [result])))
    .catch(error => cleanPromise(execute(errorCallback, [error])));
}
