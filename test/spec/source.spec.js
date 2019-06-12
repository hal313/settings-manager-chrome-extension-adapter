(function() {
    'use strict';

    var ChromeExtensionAPIMock = require('./../util/ChromeExtensionAPIMock'),
        ChromeExtensionSettingsManager = require('../../src/ChromeExtensionSettingsManager');

    require('./../util/SpecRunner')().runSpecs(ChromeExtensionSettingsManager, ChromeExtensionAPIMock);
})();