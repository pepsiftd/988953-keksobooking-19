'use strict';

(function () {
  var DATA_SERVER = 'https://js.dump.academy/keksobooking/data';
  var FORM_SERVER = 'https://js.dump.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;

  var StatusCode = {
    OK: 200
  };

  var sendXhrRequest = function (method, url, successHandler, errorHandler, data) {
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

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (successHandler, errorHandler) {
    sendXhrRequest('GET', DATA_SERVER, successHandler, errorHandler);
  };

  var upload = function (data, successHandler, errorHandler) {
    sendXhrRequest('POST', FORM_SERVER, successHandler, errorHandler, data);
  };

  window.ajax = {
    load: load,
    upload: upload
  };
})();
