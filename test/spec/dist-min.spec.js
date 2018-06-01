/* global require:false */

(function() {
    'use strict';

    var ChromeExtensionAPIMock = require('./../util/ChromeExtensionAPIMock'),
        ChromeExtensionSettingsManager = require('../../dist/ChromeExtensionSettingsManager.min'),
        specRunner = require('./../util/SpecRunner')();

        specRunner.runSpecs(ChromeExtensionSettingsManager, ChromeExtensionAPIMock);
})();