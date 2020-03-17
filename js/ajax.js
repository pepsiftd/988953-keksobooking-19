'use strict';

(function () {
  var SERVER = 'https://js.dump.academy/keksobooking/data';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  var load = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var loadHandler = function () {
      if (xhr.status === StatusCode.OK) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    };

    xhr.addEventListener('load', loadHandler);

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', SERVER);
    xhr.send();
  }

  window.ajax = {
    load: load
  };
})();
