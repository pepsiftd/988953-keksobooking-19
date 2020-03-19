'use strict';

(function () {
  var successPopupTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorPopupTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var main = document.querySelector('main');
  var currentPopup;

  var closePopup = function (popup) {
    main.removeChild(popup);
    document.removeEventListener('keydown', escPressHandler);
  };

  var escPressHandler = function (keydownEvt) {
    window.util.isEscEvent(keydownEvt, function () {
      closePopup(currentPopup);
    });
  };

  var popupClickHandler = function (clickEvt) {
    closePopup(currentPopup);
  };

  var showPopup = function (template) {
    currentPopup = template.cloneNode(true);

    document.addEventListener('keydown', escPressHandler);
    document.addEventListener('click', popupClickHandler);

    main.appendChild(currentPopup);
  };

  var showSuccessPopup = function () {
    showPopup(successPopupTemplate);
  };

  var showErrorPopup = function () {
    showPopup(errorPopupTemplate);

  };

  window.popup = {
    success: showSuccessPopup,
    error: showErrorPopup
  }
})();
