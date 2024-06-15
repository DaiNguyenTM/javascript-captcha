"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Captcha = void 0;
exports.createCaptchaInstance = createCaptchaInstance;
var _helpers = _interopRequireDefault(require("./helpers"));
var _invalidCaptchaSettingsException = _interopRequireDefault(require("./exceptions/invalid-captcha-settings-exception"));
var _captchaTagNotFoundException = _interopRequireDefault(require("./exceptions/captcha-tag-not-found-exception"));
var _jsCaptchaIntegrationCore = require("./js-captcha-integration-core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                              Copyright Captcha, Inc. 2004-2023. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                              BotDetect, BotDetect CAPTCHA, Lanap, Lanap CAPTCHA, Lanap BotDetect, 
                                                                                                                                                                                                                                                                                                                                                                                              Lanap BotDetect CAPTCHA, Lanapsoft, Lanapsoft CAPTCHA, 
                                                                                                                                                                                                                                                                                                                                                                                              Lanapsoft BotDetect, Lanapsoft BotDetect CAPTCHA, and Lanap Software 
                                                                                                                                                                                                                                                                                                                                                                                              are trademarks of Captcha, Inc. All other product, brand, and company 
                                                                                                                                                                                                                                                                                                                                                                                              names are mentioned for identification purposes only and are trademarks 
                                                                                                                                                                                                                                                                                                                                                                                              or registered trademarks of their respective owners.
                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                              Captcha, Inc. - formerly: Lanapsoft, Inc. / Lanap, Inc.
                                                                                                                                                                                                                                                                                                                                                                                              */ // BotDetect CAPTCHA JavaScript Plugin -- ES6
/** plugin info */
var pluginInfo = {
  releaseNo: '4.5.0-RC2',
  pluginId: '204'
};

/** Captcha object */
var Captcha = /*#__PURE__*/function () {
  function Captcha(settings) {
    _classCallCheck(this, Captcha);
    settings = sanitizeSettings(settings);
    executeRequiredSettingsCheck(settings);
    var integrationCore = (0, _jsCaptchaIntegrationCore.createJsCaptchaIntegrationCoreInstance)(settings);
    integrationCore.integrationType = pluginInfo.pluginId;
    this._integrationCore = integrationCore;
  }
  _createClass(Captcha, [{
    key: "integrationCore",
    get: function get() {
      return this._integrationCore;
    }
  }, {
    key: "settings",
    get: function get() {
      return this.integrationCore.settings;
    }
  }, {
    key: "getCaptchaData",
    value: function getCaptchaData() {
      return this.integrationCore.getCaptchaData();
    }
  }, {
    key: "reloadCaptcha",
    value: function reloadCaptcha() {
      this.integrationCore.reloadCaptcha();
    }
  }, {
    key: "displayCaptcha",
    value: function displayCaptcha() {
      var captchaFormId = this.integrationCore.captchaFormId;
      var captchaTag = getCaptchaTag(captchaFormId);
      if (!captchaTag) {
        throw new _captchaTagNotFoundException["default"](captchaFormId);
      }
      this.integrationCore.getHtml(function (captchaHtml) {
        captchaTag.innerHTML = captchaHtml;
      }, function (errorMessage) {
        captchaTag.innerHTML = errorMessage;
      });
    }
  }], [{
    key: "releaseNo",
    get: function get() {
      return pluginInfo.releaseNo;
    }
  }]);
  return Captcha;
}(); // private functions
exports.Captcha = Captcha;
function sanitizeSettings(settings) {
  var sanitized = {};
  for (var key in settings) {
    var value = settings[key];
    sanitized[key] = _helpers["default"].sanitizer.sanitize(value);
  }
  return sanitized;
}
function executeRequiredSettingsCheck(settings) {
  if (!(settings.captchaFormId && settings.captchaEndpointUrl && settings.languageTag)) {
    throw new _invalidCaptchaSettingsException["default"]();
  }
}
function getCaptchaTag(captchaFormId) {
  var tagSelectors = ['[captchaformid="' + captchaFormId + '"]', '[captchaFormId="' + captchaFormId + '"]', '[captcha-form-id="' + captchaFormId + '"]', '[data-captchaformid="' + captchaFormId + '"]', '[data-captchaFormId="' + captchaFormId + '"]', '[data-captcha-form-id="' + captchaFormId + '"]'];
  var captchaTag = null;
  for (var i = 0; i < tagSelectors.length; i++) {
    var selector = tagSelectors[i];
    var element = document.querySelector(selector);
    if (element) {
      captchaTag = element;
      break;
    }
  }
  return captchaTag;
}
function createCaptchaInstance(settings) {
  var captcha = new Captcha(settings);
  return captcha;
}
(function (window) {
  window.Captcha = Captcha;
  window.createCaptchaInstance = createCaptchaInstance;
})(window);
//# sourceMappingURL=captcha.js.map