"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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

var resourceStrings = {
  bd_client_side_not_existing: "BotDetect client-side instance doesn't exist.",
  invalid_captcha_settings: "Invalid captcha settings!\n  The JavaScript Captcha Plugin requires the three \"captchaFormId\", \"captchaEndpointUrl\", and \"languageTag\" properties to be set.\n  For example:\n  var captcha = createCaptchaInstance({\n    captchaFormId: 'your_form',\n    languageTag: 'en-US',\n    captchaEndpointUrl: 'https://your-app-backend-hostname.your-domain.com/simple-captcha-endpoint-url'\n  });\n  ",
  captcha_tag_not_found: "Could not find captcha tag! \n  Please add <captcha captchaFormId=\"{0}\"></captcha> element in your HTML template.",
  captcha_error: "<div style=\"color: red; font-size: 12px; width: 260px; border: 1px solid red; padding: 5px; background: #fff;\">\n                  Captcha Error: please check the JavaScript console and app logs in order to find more details.</div>"
};
var _default = resourceStrings;
exports["default"] = _default;
//# sourceMappingURL=resource-strings.js.map