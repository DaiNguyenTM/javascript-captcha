/*
Copyright Captcha, Inc. 2004-2024. All rights reserved.

BotDetect, BotDetect CAPTCHA, Lanap, Lanap CAPTCHA, Lanap BotDetect, 
Lanap BotDetect CAPTCHA, Lanapsoft, Lanapsoft CAPTCHA, 
Lanapsoft BotDetect, Lanapsoft BotDetect CAPTCHA, and Lanap Software 
are trademarks of Captcha, Inc. All other product, brand, and company 
names are mentioned for identification purposes only and are trademarks 
or registered trademarks of their respective owners.

Captcha, Inc. - formerly: Lanapsoft, Inc. / Lanap, Inc.
*/

// BotDetect CAPTCHA JavaScript Integration Core -- ES6

import helpers from './helpers';
import resourceStrings from './resource-strings';
import BdClientSideNotExistingException from './exceptions/bd-clientside-not-existing-exception';

const defaultSettings = {
  captchaFormId: '', // form identifier that has to match one of the <captchaForm><id> values in the bdc-config.xml
  languageTag: '', // language tag
  captchaEndpointUrl: '' // captcha endpoint url on your app's backend
};

const defaultIntegrationType = '0'; // unknown integration type

class JsCaptchaIntegrationCore {

  static get releaseNo() {
    return '4.5.0';
  }

  constructor(settings) {
    const mergedSettings = helpers.object.mergeObjects(defaultSettings, settings);
    this._settings = sanitizeSettings(mergedSettings);
  }

  get settings() {
    return this._settings;
  }

  get captchaEndpointUrl() {
    return this.settings.captchaEndpointUrl;
  }

  get captchaFormId() {
    return this.settings.captchaFormId;
  }

  get languageTag() {
    return this.settings.languageTag;
  }

  set integrationType(type) {
    this._integrationType = type;
  }

  get integrationType() {
    return (this._integrationType === void 0) ?
              defaultIntegrationType
              : this._integrationType;
  }

  getCaptchaData() {
    return getBdClientSideInstance(this).getCaptchaData();
  }

  reloadCaptcha() {
    getBdClientSideInstance(this).reloadCaptcha();
  }

  getHtml(successCallback, errorCallback) {
    const userSpecifiedLanguageTag = this.languageTag;

    const self = this;
    const url = helpers.url.createUrl(this.captchaEndpointUrl, {
      get: 'html',
      c: this.captchaFormId,
      l: userSpecifiedLanguageTag,
      ji: false, // disable script include
      _: helpers.time.currentTimestamp()
    });

    helpers.ajax.get(url, 
      function(captchaHtml) {
        captchaHtml = helpers.url.changeRelativeToAbsoluteUrls(captchaHtml, self.captchaEndpointUrl);
        successCallback(captchaHtml);
        loadScriptInclude(self, userSpecifiedLanguageTag);
      },
      function() {
        if (typeof errorCallback === 'function') {
          errorCallback(resourceStrings.captcha_error);
        }
      }
    );
  }
}

// private functions

function sanitizeSettings(settings) {
  let sanitized = {};
  for (let key in settings) {
    const value = settings[key];
    sanitized[key] = helpers.sanitizer.sanitize(value);
  }
  return sanitized;
}

function getBdClientSideInstance(jsc) {
  if (window.botdetect === void 0) {
    throw new BdClientSideNotExistingException();
  }

  return window.botdetect.getInstanceByCaptchaFormId(jsc.captchaFormId);
}

function loadScriptInclude(jsc, userSpecifiedLanguageTag) {
  // remove included script if it exists
  const scriptId = 'script_include_' + jsc.captchaFormId;
  const includedScript = document.getElementById(scriptId);
  if (includedScript) {
    includedScript.parentNode.removeChild(includedScript);
  }

  // include new script to body
  const captchaId = document.getElementById('BDC_VCID_' + jsc.captchaFormId).value;
  const scriptIncludeUrl = helpers.url.createUrl(jsc.captchaEndpointUrl, {
    get: 'script-include',
    c: jsc.captchaFormId,
    l: userSpecifiedLanguageTag,
    t: captchaId,
    cs: jsc.integrationType
  });
  const scriptIncludeElement = helpers.dom.createScriptElement(scriptId, scriptIncludeUrl);
  document.body.appendChild(scriptIncludeElement);
}

function createJsCaptchaIntegrationCoreInstance(settings) {
  return new JsCaptchaIntegrationCore(settings);
}

function getJsCaptchaIntegrationCoreReleaseNo() {
  return JsCaptchaIntegrationCore.releaseNo;
}

(function(window) {
  window.JsCaptchaIntegrationCore = JsCaptchaIntegrationCore;
  window.createJsCaptchaIntegrationCoreInstance = createJsCaptchaIntegrationCoreInstance;
  window.getJsCaptchaIntegrationCoreReleaseNo = getJsCaptchaIntegrationCoreReleaseNo;
})(window);

export { 
  JsCaptchaIntegrationCore, 
  createJsCaptchaIntegrationCoreInstance,
  getJsCaptchaIntegrationCoreReleaseNo
};
