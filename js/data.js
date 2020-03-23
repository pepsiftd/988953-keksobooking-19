'use strict';

(function () {
  var ads = [];
  var filteredAds = [];

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
    filteredAds: filteredAds,
    load: loadData
  };
})();
