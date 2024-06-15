"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsCaptchaIntegrationCore = void 0;
exports.createJsCaptchaIntegrationCoreInstance = createJsCaptchaIntegrationCoreInstance;
exports.getJsCaptchaIntegrationCoreReleaseNo = getJsCaptchaIntegrationCoreReleaseNo;
var _helpers = _interopRequireDefault(require("./helpers"));
var _resourceStrings = _interopRequireDefault(require("./resource-strings"));
var _bdClientsideNotExistingException = _interopRequireDefault(require("./exceptions/bd-clientside-not-existing-exception"));
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
                                                                                                                                                                                                                                                                                                                                                                                              */ // BotDetect CAPTCHA JavaScript Integration Core -- ES6
var defaultSettings = {
  captchaFormId: '',
  // form identifier that has to match one of the <captchaForm><id> values in the bdc-config.xml
  languageTag: '',
  // language tag
  captchaEndpointUrl: '' // captcha endpoint url on your app's backend
};

var defaultIntegrationType = '0'; // unknown integration type
var JsCaptchaIntegrationCore = /*#__PURE__*/function () {
  function JsCaptchaIntegrationCore(settings) {
    _classCallCheck(this, JsCaptchaIntegrationCore);
    var mergedSettings = _helpers["default"].object.mergeObjects(defaultSettings, settings);
    this._settings = sanitizeSettings(mergedSettings);
  }
  _createClass(JsCaptchaIntegrationCore, [{
    key: "settings",
    get: function get() {
      return this._settings;
    }
  }, {
    key: "captchaEndpointUrl",
    get: function get() {
      return this.settings.captchaEndpointUrl;
    }
  }, {
    key: "captchaFormId",
    get: function get() {
      return this.settings.captchaFormId;
    }
  }, {
    key: "languageTag",
    get: function get() {
      return this.settings.languageTag;
    }
  }, {
    key: "integrationType",
    get: function get() {
      return this._integrationType === void 0 ? defaultIntegrationType : this._integrationType;
    },
    set: function set(type) {
      this._integrationType = type;
    }
  }, {
    key: "getCaptchaData",
    value: function getCaptchaData() {
      return getBdClientSideInstance(this).getCaptchaData();
    }
  }, {
    key: "reloadCaptcha",
    value: function reloadCaptcha() {
      getBdClientSideInstance(this).reloadCaptcha();
    }
  }, {
    key: "getHtml",
    value: function getHtml(successCallback, errorCallback) {
      var userSpecifiedLanguageTag = this.languageTag;
      var self = this;
      var url = _helpers["default"].url.createUrl(this.captchaEndpointUrl, {
        get: 'html',
        c: this.captchaFormId,
        l: userSpecifiedLanguageTag,
        ji: false,
        // disable script include
        _: _helpers["default"].time.currentTimestamp()
      });
      _helpers["default"].ajax.get(url, function (captchaHtml) {
        captchaHtml = _helpers["default"].url.changeRelativeToAbsoluteUrls(captchaHtml, self.captchaEndpointUrl);
        successCallback(captchaHtml);
        loadScriptInclude(self, userSpecifiedLanguageTag);
      }, function () {
        if (typeof errorCallback === 'function') {
          errorCallback(_resourceStrings["default"].captcha_error);
        }
      });
    }
  }], [{
    key: "releaseNo",
    get: function get() {
      return '4.5.0';
    }
  }]);
  return JsCaptchaIntegrationCore;
}(); // private functions
exports.JsCaptchaIntegrationCore = JsCaptchaIntegrationCore;
function sanitizeSettings(settings) {
  var sanitized = {};
  for (var key in settings) {
    var value = settings[key];
    sanitized[key] = _helpers["default"].sanitizer.sanitize(value);
  }
  return sanitized;
}
function getBdClientSideInstance(jsc) {
  if (window.botdetect === void 0) {
    throw new _bdClientsideNotExistingException["default"]();
  }
  return window.botdetect.getInstanceByCaptchaFormId(jsc.captchaFormId);
}
function loadScriptInclude(jsc, userSpecifiedLanguageTag) {
  // remove included script if it exists
  var scriptId = 'script_include_' + jsc.captchaFormId;
  var includedScript = document.getElementById(scriptId);
  if (includedScript) {
    includedScript.parentNode.removeChild(includedScript);
  }

  // include new script to body
  var captchaId = document.getElementById('BDC_VCID_' + jsc.captchaFormId).value;
  var scriptIncludeUrl = _helpers["default"].url.createUrl(jsc.captchaEndpointUrl, {
    get: 'script-include',
    c: jsc.captchaFormId,
    l: userSpecifiedLanguageTag,
    t: captchaId,
    cs: jsc.integrationType
  });
  var scriptIncludeElement = _helpers["default"].dom.createScriptElement(scriptId, scriptIncludeUrl);
  document.body.appendChild(scriptIncludeElement);
}
function createJsCaptchaIntegrationCoreInstance(settings) {
  return new JsCaptchaIntegrationCore(settings);
}
function getJsCaptchaIntegrationCoreReleaseNo() {
  return JsCaptchaIntegrationCore.releaseNo;
}
(function (window) {
  window.JsCaptchaIntegrationCore = JsCaptchaIntegrationCore;
  window.createJsCaptchaIntegrationCoreInstance = createJsCaptchaIntegrationCoreInstance;
  window.getJsCaptchaIntegrationCoreReleaseNo = getJsCaptchaIntegrationCoreReleaseNo;
})(window);
//# sourceMappingURL=js-captcha-integration-core.js.map