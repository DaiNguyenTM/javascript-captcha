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

// BotDetect CAPTCHA JavaScript Plugin -- ES6

import helpers from './helpers';
import InvalidCaptchaSettingsException from './exceptions/invalid-captcha-settings-exception';
import CaptchaTagNotFoundException from './exceptions/captcha-tag-not-found-exception';
import { createJsCaptchaIntegrationCoreInstance } from './js-captcha-integration-core';

/** plugin info */
const pluginInfo = {
  releaseNo: '4.5.0-RC2',
  pluginId: '206'
};

/** Captcha object */
class Captcha {

  static get releaseNo() {
    return pluginInfo.releaseNo;
  }

  constructor(settings) {
    settings = sanitizeSettings(settings);

    executeRequiredSettingsCheck(settings);

    var integrationCore = createJsCaptchaIntegrationCoreInstance(settings);
    integrationCore.integrationType = pluginInfo.pluginId;
    this._integrationCore = integrationCore;
  }

  get integrationCore() {
    return this._integrationCore;
  }

  get settings() {
    return this.integrationCore.settings;
  }

  getCaptchaData() {
    return this.integrationCore.getCaptchaData();
  }

  reloadCaptcha() {
    this.integrationCore.reloadCaptcha();
  }

  displayCaptcha() {
    const captchaFormId = this.integrationCore.captchaFormId;
    const captchaTag = getCaptchaTag(captchaFormId);

    if (!captchaTag) {
      throw new CaptchaTagNotFoundException(captchaFormId);
    }

    this.integrationCore.getHtml(
      function(captchaHtml) {
        captchaTag.innerHTML = captchaHtml;
      },
      function(errorMessage) {
        captchaTag.innerHTML = errorMessage;
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

function executeRequiredSettingsCheck(settings) {
  if (!(settings.captchaFormId && settings.captchaEndpointUrl && settings.languageTag)) {
    throw new InvalidCaptchaSettingsException();
  }
}

function getCaptchaTag(captchaFormId) {
  const tagSelectors = [
    '[captchaformid="' + captchaFormId + '"]',
    '[captchaFormId="' + captchaFormId + '"]',
    '[captcha-form-id="' + captchaFormId + '"]',
    '[data-captchaformid="' + captchaFormId + '"]',
    '[data-captchaFormId="' + captchaFormId + '"]',
    '[data-captcha-form-id="' + captchaFormId + '"]',
  ];
  let captchaTag = null;
  for (let i = 0; i < tagSelectors.length; i++) {
    const selector = tagSelectors[i];
    const element = document.querySelector(selector);
    if (element) {
      captchaTag = element;
      break;
    }
  }
  return captchaTag;
}

function createCaptchaInstance(settings) {
  const captcha = new Captcha(settings);
  return captcha;
}

(function(window) {
  window.Captcha = Captcha;
  window.createCaptchaInstance = createCaptchaInstance;
})(window);

export { 
  Captcha, 
  createCaptchaInstance 
};
