'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var titleInput = adForm.querySelector('#title');

  var validateTitle = function () {
    var text = titleInput.value.trim();
    var min = titleInput.minLength;
    var max = titleInput.maxLength;

    titleInput.setCustomValidity('');

    if (!titleInput.customError && (text.length < min || text.length > max)) {
      titleInput.setCustomValidity('Заголовок должен содержать не менее ' + min + ' и не более ' + max + ' символов');
    }
  };

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

  window.validate = {
    capacity: validateCapacity,
    price: validatePrice,
    time: validateTime,
    title: validateTitle
  };
})();
