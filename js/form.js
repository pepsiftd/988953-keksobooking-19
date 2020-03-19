'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');

  var adForm = document.querySelector('.ad-form');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');

  var validateCapacity = function () {
    capacitySelect.setCustomValidity('');

    if (roomNumberSelect.value === '100' && parseInt(capacitySelect.value, 10) !== 0) {
      capacitySelect.setCustomValidity('Нельзя заселиться во дворец');
    }

    if (parseInt(roomNumberSelect.value, 10) < capacitySelect.value) {
      capacitySelect.setCustomValidity('Гостей не должно быть больше, чем комнат');
    }

    if (roomNumberSelect.value !== '100' && parseInt(capacitySelect.value, 10) === 0) {
      capacitySelect.setCustomValidity('Пожалуйста, выберите количество гостей');
    }
  };

  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');

  var validatePrice = function () {
    var minPrice = 0;

    switch (typeInput.value) {
      case 'bungalo':
        minPrice = 0;
        break;
      case 'flat':
        minPrice = 1000;
        break;
      case 'house':
        minPrice = 5000;
        break;
      case 'palace':
        minPrice = 10000;
    }

    priceInput.min = minPrice;
    priceInput.placeholder = minPrice;
  };

  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');

  var validateTime = function (target) {
    if (target === timeinSelect) {
      timeoutSelect.value = timeinSelect.value;
    }

    if (target === timeoutSelect) {
      timeinSelect.value = timeoutSelect.value;
    }
  };

  var formChangeHandler = function (evt) {
    if (evt.target === capacitySelect || evt.target === roomNumberSelect) {
      validateCapacity();
    }

    if (evt.target === priceInput || evt.target === typeInput) {
      validatePrice();
    }

    if (evt.target === timeinSelect || evt.target === timeoutSelect) {
      validateTime(evt.target);
    }
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();

    sendForm();
  };

  var sendForm = function () {
    var sendSuccessHandler = function () {
      window.popup.success();
    };

    var sendErrorHandler = function () {
      window.popup.error();
    };

    window.ajax.upload(new FormData(adForm), sendSuccessHandler, sendErrorHandler);
  };

  var resetForms = function () {
    adForm.reset();
    filtersForm.reset();
  };

  var resetPage = function () {
    resetForms();
    window.map.disable();
    window.pins.remove();
    window.cards.close();
  };

  var resetClickHandler = function () {
    resetPage();
  };

  validateCapacity();
  validateTime();
  validatePrice();
  adForm.addEventListener('change', formChangeHandler);
  adForm.addEventListener('submit', formSubmitHandler);
  resetButton.addEventListener('click', resetClickHandler);

  window.form = {
    send: sendForm,
    reset: resetForms
  };
})();
