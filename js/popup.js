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

  var escPressHandler = function (keydownEvt) {
    window.util.isEscEvent(keydownEvt, function () {
      closePopup(currentPopup);
    });
  };

  var popupClickHandler = function () {
    closePopup(currentPopup);
  };

  var closePopup = function (popup) {
    main.removeChild(popup);
    document.removeEventListener('keydown', escPressHandler);
    document.removeEventListener('click', popupClickHandler);
  };

  var showPopup = function (template, errorText) {
    currentPopup = template.cloneNode(true);
    if (errorText) {
      var captionParagraph = currentPopup.querySelector('.error__message');
      captionParagraph.textContent = errorText;
    }

    document.addEventListener('keydown', escPressHandler);
    document.addEventListener('click', popupClickHandler);

    main.appendChild(currentPopup);
  };

  var showSuccessPopup = function () {
    window.page.reset();
    showPopup(successPopupTemplate);
  };

  var showErrorPopup = function (retryClickHandler, errorText) {
    showPopup(errorPopupTemplate, errorText);

    var retryButton = currentPopup.querySelector('.error__button');

    retryButton.addEventListener('click', retryClickHandler);
  };

  window.popup = {
    success: showSuccessPopup,
    error: showErrorPopup
  };
})();
