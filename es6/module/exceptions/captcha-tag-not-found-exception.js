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

import helpers from '../helpers';
import resourceStrings from '../resource-strings';

export default class CaptchaTagNotFoundException extends Error {
  constructor(captchaFormId) {
    const message = helpers.string.format(resourceStrings.captcha_tag_not_found, captchaFormId);
    super(message)
  }
}
