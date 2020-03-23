'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAX_PINS_AMOUNT = 5;

  var createNewPin = function (ad) {
    var newPin = pinTemplate.cloneNode(true);
    var pinImage = newPin.querySelector('img');
    var pinX = ad.location.x - Math.round(PIN_WIDTH / 2);
    var pinY = ad.location.y - PIN_HEIGHT;

    newPin.style.left = pinX + 'px';
    newPin.style.top = pinY + 'px';
    pinImage.src = ad.author.avatar;
    pinImage.alt = ad.offer.title;

    return newPin;
  };

  var fillFragment = function (array, fragment) {
    var pinsAmount = Math.min(array.length, MAX_PINS_AMOUNT);
    for (var j = 0; j < pinsAmount; j++) {
      var newPin = createNewPin(array[j]);
      newPin.value = j;
      fragment.appendChild(newPin);
    }
  };

  // находим template и место для вставки
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');

  var showPins = function () {
    var fragment = document.createDocumentFragment();
    fillFragment(window.data.filteredAds, fragment);

    // вставляем фрагмент в блок
    pinsContainer.appendChild(fragment);
  };

  var redrawPins = function () {
    removePins();
    window.cards.create();
    showPins();
  };

  // загрузка данных объявлений, создание карточек объявлений, открытие фильтров
  var loadAndShowPins = function () {
    window.data.load(function () {
      window.filters.enable();
      window.filters.apply();
      window.cards.create();
      showPins();
    });
  };

  var currentPin;

  var activatePin = function (pin) {
    currentPin = pin;
    pin.classList.add('map__pin--active');
  };

  var deactivateCurrentPin = function () {
    if (currentPin) {
      currentPin.classList.remove('map__pin--active');
    }
  };

  var removePins = function () {
    var pins = pinsContainer.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pinsContainer.removeChild(pins[i]);
      }
    }
  };

  window.pins = {
    show: loadAndShowPins,
    remove: removePins,
    redraw: redrawPins,
    setCurrent: activatePin,
    deactivateCurrent: deactivateCurrentPin
  };
})();
