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

function getBaseUrlFromUrl(url) {
  let baseUrl = null;
  if (url.indexOf('http') === 0) {
    const urlParts = url.split('/');
    baseUrl = urlParts[0] + '//' + urlParts[2];
  }
  return baseUrl;
}

function getClientBaseUrl() {
  const url = window.location.href;
  const baseUrl = getBaseUrlFromUrl(url);
  return baseUrl;
}

function detectIE9() {
  let detected = false;
  if (navigator && navigator.userAgent) {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('MSIE') !== -1) {
      const parts = userAgent.split('MSIE');
      const version = parseInt(parts[1]);
      if (version === 9) {
        detected = true;
      }
    }
  }
  return detected;
}

function detectCrossDomainRequest(backendUrl) {
  let detected = false;
  const clientBaseUrl = getClientBaseUrl();
  const backendBaseUrl = getBaseUrlFromUrl(backendUrl);
  if ((clientBaseUrl !== null) && (backendBaseUrl !== null) 
        && (clientBaseUrl !== backendBaseUrl)) {
    detected = true;
  }
  return detected;
}

function httpGetWithXMLHttpRequest(url, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if ((xhr.readyState === 4) && (xhr.status === 200)) {
      successCallback(xhr.responseText);
    }

    if ((xhr.readyState === 4) && (xhr.status !== 200)) {
      if (typeof errorCallback === 'function') {
        errorCallback(xhr);
      }
    }
  };
  if (typeof errorCallback === 'function') {
    xhr.addEventListener('error', function() {
      errorCallback(xhr);
    });
  }
  xhr.open('GET', url, true);
  xhr.send();
}

function httpGetWithXDomainRequest(url, successCallback, errorCallback) {
  console.log('IE9-crossdomain');
  const xdr = new XDomainRequest();
  xdr.open('GET', url);
  xdr.onprogress = function() {};
  xdr.onload = function() {
    successCallback(xdr.responseText);
  };
  if (typeof errorCallback === 'function') {
    xdr.onerror = function() {
      errorCallback(xdr);
    };
  }
  setTimeout(function() {
    xdr.send();
  }, 0);
}

// get captcha endpoint handler from configured captchaEndpointUrl value,
// the expected result will be:
// simple-captcha-endpoint.ashx -- for asp.net backend
// simple-captcha-endpoint -- for java backend
// simple-captcha-endpoint.php -- for php backend
// or a custom path that user configured on backend
function getCaptchaEndpointHandler(configuredCaptchaEndpointUrl) {
  const splited = configuredCaptchaEndpointUrl.split('/');
  return splited[splited.length - 1];
}

// get backend base url from configured captchaEndpointUrl value
function getBackendBaseUrl(configuredCaptchaEndpointUrl, captchaEndpointHandler) {
  let lastIndex = configuredCaptchaEndpointUrl.lastIndexOf(captchaEndpointHandler);
  return configuredCaptchaEndpointUrl.substring(0, lastIndex);
}

const helpers = {
  string: {
    format: function() {
      let str = arguments[0];
      for (const index in arguments) {
        const regex = new RegExp("\\{" + (index - 1) + "\\}", "g");
        str = str.replace(regex, arguments[index]);
      }
      return str;
    }
  },

  time: {
    currentTimestamp: function() {
      const currentTime = Date.now ? Date.now() : new Date().getTime();
      return currentTime;
    }
  },

  sanitizer: {
    sanitize: function(input) {
      input = input.replace(/[^a-zA-Z0-9\.\-\_\~\!\$\&\(\)\*\+\,\;\=\:\@\%\#\/\?]/gim, '');
      return input;
    }
  },

  dom: {
    createScriptElement: function(id, source, callback) {
      const script = document.createElement('script');
      script.id = id;
      script.src = source;
    
      if (typeof callback === 'function') {
        script.onload = callback;
      }
            
      return script;
    }
  },

  object: {
    mergeObjects: function(target, source) {
      let merged = {};
      for (let key in target) {
        const value = source[key];
        merged[key] = (value === void 0) ? target[key] : value;
      }
      return merged;
    },

    isEmptyObject: function(obj) {
      if (obj) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            return false;
          }
        }
      }
      return true;
    }
  },

  ajax: {
    get: function(url, successCallback, errorCallback) {
      if (detectIE9() && detectCrossDomainRequest(url)) {
        // for cross-domain on IE9 support
        httpGetWithXDomainRequest(url, successCallback, errorCallback);
      } else {
        httpGetWithXMLHttpRequest(url, successCallback, errorCallback);
      }
    }
  },

  url: {
    createUrl(url, params) {
      let p = [];
      for (let pKey in params) {
        if (typeof pKey === 'string') {
          const pValue = params[pKey];
          if ((pValue !== null) && (pValue !== '')) {
            p.push(pKey + '=' + pValue);
          }
        }
      }
      const paramsPattern = /\?+/g;
      return paramsPattern.test(url) ? (url + '&' + p.join('&')) : (url + '?' + p.join('&')); 
    },

    changeRelativeToAbsoluteUrls(originalCaptchaHtml, configuredCaptchaEndpointUrl) {
      const captchaEndpointHandler = getCaptchaEndpointHandler(configuredCaptchaEndpointUrl);
      const backendUrl = getBackendBaseUrl(configuredCaptchaEndpointUrl, captchaEndpointHandler);
    
      const relativeUrls = originalCaptchaHtml.match(/(src|href)=\"([^"]+)\"/g);
      let relativeUrl, absoluteUrl,
          changedCaptchaHtml = originalCaptchaHtml;
    
      for (let i = 0; i < relativeUrls.length; i++) {
        relativeUrl = relativeUrls[i].slice(0, -1).replace(/src=\"|href=\"/, '');
        absoluteUrl = relativeUrl.replace(/.*\?get=/, backendUrl + captchaEndpointHandler + '?get=');
        changedCaptchaHtml = changedCaptchaHtml.replace(relativeUrl, absoluteUrl);
      }
    
      return changedCaptchaHtml;
    }
  }

}

export default helpers;
