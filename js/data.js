'use strict';

(function () {
  var ads = [];

  var loadData = function (callback) {
    var loadSuccessHandler = function (response) {
      window.data.ads = response;
      console.log(window.data.ads);
      callback();
    };

    var loadErrorHandler = function (errorText) {
      console.log(errorText);
    };

    window.ajax.load(loadSuccessHandler, loadErrorHandler);
  };

  window.data = {
    ads: ads,
    load: loadData
  }
})();
