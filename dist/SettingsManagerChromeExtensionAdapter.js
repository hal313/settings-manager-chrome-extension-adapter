(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@hal313/settings-manager"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@hal313/settings-manager"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settingsManager);
    global.SettingsManagerChromeExtensionAdapter = mod.exports;
  }
})(this, function (_exports, _settingsManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SettingsManagerChromeExtensionAdapter = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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


  var SettingsManagerChromeExtensionAdapter =
  /*#__PURE__*/
  function () {
    function SettingsManagerChromeExtensionAdapter(useSync, path) {
      _classCallCheck(this, SettingsManagerChromeExtensionAdapter);

      this.path = path || 'sm_ce';
      this.storage = !!useSync ? chrome.storage.sync : chrome.storage.local;
    }
    /**
     * Loads values.
     *
     * @param {Function} successCallback the callback invoked on success (with parameter {})
     */


    _createClass(SettingsManagerChromeExtensionAdapter, [{
      key: "load",
      value: function load(successCallback, errorCallback) {
        this.storage.get([this.path], function (settings) {
          if (!!getError()) {
            (0, _settingsManager.executeAsync)(errorCallback);
          } else {
            (0, _settingsManager.executeAsync)(successCallback, [settings]);
          }
        });
      }
    }, {
      key: "save",

      /**
       * Saves values.
       *
       * @param {Object} settings the settings to save
       * @param {Function} successCallback the success callback to invoke on success
       */
      value: function save(settings, successCallback, errorCallback) {
        var value = {};
        value[this.path] = settings;
        this.storage.set(value, function () {
          if (!!getError()) {
            (0, _settingsManager.executeAsync)(errorCallback);
          } else {
            (0, _settingsManager.executeAsync)(successCallback);
          }
        });
      }
    }, {
      key: "clear",

      /**
       * Clears values.
       *
       * @param {Function} successCallback the success callback to invoke on success
       */
      value: function clear(successCallback, errorCallback) {
        // Do not call clear - that will clear all settings! Just set the path value to null
        this.save(null, successCallback, errorCallback);
      }
    }]);

    return SettingsManagerChromeExtensionAdapter;
  }();

  _exports.SettingsManagerChromeExtensionAdapter = SettingsManagerChromeExtensionAdapter;
  ;
});