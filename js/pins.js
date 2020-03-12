'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

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
    for (var j = 0; j < array.length; j++) {
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

  var showAds = function () {
    // собираем фрагмент из массива данных объявлений
    var fragment = document.createDocumentFragment();
    fillFragment(window.data, fragment);

    // вставляем фрагмент в блок
    pinsContainer.appendChild(fragment);
  };

  window.pins = {
    show: showAds
  };
})();
