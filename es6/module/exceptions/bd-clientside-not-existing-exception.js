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

import resourceStrings from '../resource-strings';

export default class BdClientSideNotExistingException extends Error {
  constructor() {
    super(resourceStrings.bd_client_side_not_existing)
  }
}
