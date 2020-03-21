'use strict';

(function () {
  var ads = [];
  var filtered = [];

  var loadData = function (callback) {
    var loadSuccessHandler = function (response) {
      window.data.ads = response;
      callback();
    };

    var loadErrorHandler = function (errorText) {
      window.popup.error(function () {
        loadData();
      }, errorText);
    };

    window.ajax.load(loadSuccessHandler, loadErrorHandler);
  };

  window.data = {
    ads: ads,
    filtered: filtered,
    load: loadData
  };
})();
