'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var formInputs = adForm.querySelectorAll('input, select, textarea, button');

  var submitButton = adForm.querySelector('.ad-form__submit');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var titleInput = adForm.querySelector('#title');
  var addressInput = adForm.querySelector('#address');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');

  var photoChooser = adForm.querySelector('.ad-form__upload input[type=file]');
  var avatarChooser = adForm.querySelector('.ad-form__field input[type=file]');

  var formChangeHandler = function (evt) {
    if (evt.target === capacitySelect || evt.target === roomNumberSelect) {
      window.validate.capacity();
      if (capacitySelect.validity.valid && capacitySelect.classList.contains('ad-form__element--invalid')) {
        removeRedShadow(capacitySelect);
      }
    }

    if (evt.target === priceInput || evt.target === typeInput) {
      window.validate.price();
      if (priceInput.validity.valid && priceInput.classList.contains('ad-form__element--invalid')) {
        removeRedShadow(priceInput);
      }
    }

    if (evt.target === timeinSelect || evt.target === timeoutSelect) {
      window.validate.time(evt.target);
    }

    if (evt.target === titleInput) {
      window.validate.title();
      if (titleInput.validity.valid && titleInput.classList.contains('ad-form__element--invalid')) {
        removeRedShadow(titleInput);
      }
    }
  };

  var photoUploadHandler = function () {
    window.photo.add();
  };

  var avatarUploadHandler = function () {
    window.photo.setAvatar();
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    sendForm();
  };

  var submitButtonClickHandler = function () {
    removeInvalidIndication();
    indicateInvalid();
  };

  var sendForm = function () {
    submitButton.blur();

    var sendSuccessHandler = function () {
      window.popup.success();
    };

    var sendErrorHandler = function () {
      window.popup.error(function () {
        sendForm();
      });
    };

    window.ajax.upload(new FormData(adForm), sendSuccessHandler, sendErrorHandler);
  };

  var resetForms = function () {
    window.photo.clear();
    adForm.reset();
    filtersForm.reset();
  };

  var disableForms = function () {
    adForm.classList.add('ad-form--disabled');
    window.filters.disable();

    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = true;
    }

    photoChooser.removeEventListener('change', photoUploadHandler);
    avatarChooser.removeEventListener('change', avatarUploadHandler);

    adForm.removeEventListener('change', formChangeHandler);
    adForm.removeEventListener('submit', formSubmitHandler);
    submitButton.removeEventListener('click', submitButtonClickHandler);
    resetButton.removeEventListener('click', resetClickHandler);
  };

  var enableForms = function () {
    adForm.classList.remove('ad-form--disabled');

    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = false;
    }

    addressInput.readOnly = true;

    window.validate.capacity();
    window.validate.time();
    window.validate.price();

    photoChooser.addEventListener('change', photoUploadHandler);
    avatarChooser.addEventListener('change', avatarUploadHandler);

    adForm.addEventListener('change', formChangeHandler);
    adForm.addEventListener('submit', formSubmitHandler);
    submitButton.addEventListener('click', submitButtonClickHandler);
    resetButton.addEventListener('click', resetClickHandler);
  };

  var indicateInvalid = function () {
    var invalidElements = adForm.querySelectorAll('input:invalid, select:invalid');
    for (var i = 0; i < invalidElements.length; i++) {
      setRedShadow(invalidElements[i]);
    }
  };

  var removeInvalidIndication = function () {
    var invalidElements = adForm.querySelectorAll('.ad-form__element--invalid');
    for (var i = 0; i < invalidElements.length; i++) {
      removeRedShadow(invalidElements[i]);
    }
  };

  var setRedShadow = function (element) {
    element.classList.add('ad-form__element--invalid');
  };

  var removeRedShadow = function (element) {
    element.classList.remove('ad-form__element--invalid');
  };

  var resetClickHandler = function () {
    window.page.reset();
  };

  window.form = {
    send: sendForm,
    reset: resetForms,
    disable: disableForms,
    enable: enableForms
  };
})();
