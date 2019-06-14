(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.SettingsManagerChromeExtensionAdapter = mod.exports;
  }
})(this, function (_exports) {
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
     * @returns {Promise} resolves with the settings or rejects on error
     */


    _createClass(SettingsManagerChromeExtensionAdapter, [{
      key: "load",
      value: function load() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          _this.storage.get([_this.path], function (settings) {
            if (!!getError()) {
              reject();
            } else {
              resolve(settings || {});
            }
          });
        });
      }
    }, {
      key: "save",

      /**
       * Saves values.
       *
       * @param {Object} settings the settings to save
       * @returns {Promise} resolves on success or rejects on error
       */
      value: function save(settings) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var value = {};
          value[_this2.path] = settings;

          _this2.storage.set(value, function () {
            if (!!getError()) {
              reject();
            } else {
              resolve();
            }
          });
        });
      }
    }, {
      key: "clear",

      /**
       * Clears values.
       *
       * @returns {Promise} resolves on success or rejects on error
       */
      value: function clear() {
        // Do not call clear - that will clear all settings! Just set the path value to null
        return this.save(null);
      }
    }]);

    return SettingsManagerChromeExtensionAdapter;
  }();

  _exports.SettingsManagerChromeExtensionAdapter = SettingsManagerChromeExtensionAdapter;
  ;
});