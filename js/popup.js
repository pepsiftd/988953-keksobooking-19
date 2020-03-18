'use strict';

(function () {
  var successPopupTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorPopupTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var main = document.querySelector('main');

  var showPopup = function (template) {
    var newPopup = template.cloneNode(true);
  };

  window.popup = {
    success: showSuccessPopup,
    error: showErrorPopup
  }
})();
