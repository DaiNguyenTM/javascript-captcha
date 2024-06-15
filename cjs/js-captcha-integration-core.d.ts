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

interface CaptchaSettings {
  languageTag?: string;
  captchaFormId: string;
  captchaEndpointUrl: string;
}

interface JsCaptchaIntegrationCore {
  settings: CaptchaSettings;
  integrationType: string;
  languageTag: string;
  captchaFormId: string;
  captchaEndpointUrl: string;
  getCaptchaData(): string;
  reloadCaptcha(): void;
  getHtml(successCallback: Function, errorCallback: Function): void;
}

declare function getJsCaptchaIntegrationCoreReleaseNo(): string;
declare function createJsCaptchaIntegrationCoreInstance(settings: {}): JsCaptchaIntegrationCore;

export { 
  CaptchaSettings,
  JsCaptchaIntegrationCore,
  getJsCaptchaIntegrationCoreReleaseNo,
  createJsCaptchaIntegrationCoreInstance
};
