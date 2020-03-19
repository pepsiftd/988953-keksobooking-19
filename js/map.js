'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65 + 22 - 6; // button height + :after - translateY
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;
  var PIN_MAX_X = document.querySelector('.map__pins').clientWidth;

  // находим карту
  var map = document.querySelector('.map');

  // обработка показа и скрытия карточек

  // массив article карточек
  var cards = window.cards.list;

  // на метку объявления на карте (кроме главной метки)
  var mapPinsClickHandler = function (evt) {
    // нажатие на map__pin
    if (evt.target.classList.contains('map__pin') && !evt.target.classList.contains('map__pin--main')) {
      window.cards.show(cards[evt.target.value]);
    }
    // нажатие на img внутри map__pin
    if (evt.target.parentNode.classList.contains('map__pin') && !evt.target.parentNode.classList.contains('map__pin--main')) {
      window.cards.show(cards[evt.target.parentNode.value]);
    }
  };

  // добавляем обработчик клика на контейнер с метками
  var pinsContainer = document.querySelector('.map__pins');
  pinsContainer.addEventListener('click', mapPinsClickHandler);

  // активация-деактивация карты
  var disableMap = function () {
    map.classList.add('map--faded');

    resetMainPin();
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
  };

  // находим формы и поля ввода
  var adForm = document.querySelector('.ad-form');
  var filtersForm = document.querySelector('.map__filters');

  // главная метка
  var mapPinMain = document.querySelector('.map__pin--main');
  var mainPinInitialCoords = {
    x: mapPinMain.offsetLeft + 'px',
    y: mapPinMain.offsetTop + 'px'
  };

  var resetMainPin = function () {
    mapPinMain.style.left = mainPinInitialCoords.x;
    mapPinMain.style.top = mainPinInitialCoords.y;

    setAddress();
  };

  var getMainPinCoordinates = function () {
    var mainPin = {
      x: parseInt(mapPinMain.style.left.slice(0, -2), 10) + Math.round(MAIN_PIN_WIDTH / 2),
      y: parseInt(mapPinMain.style.top.slice(0, -2), 10)
    };

    // если страница активна, y по острому концу, если нет - y в середине метки
    mainPin.y += window.page.isActive ? MAIN_PIN_HEIGHT : Math.round(mapPinMain.clientHeight / 2);

    return mainPin;
  };

  // устанавливает в поле адреса координаты главной метки
  var setAddress = function () {
    var pin = getMainPinCoordinates();
    addressInput.value = pin.x + ', ' + pin.y;
  };

  var mapPinMainMousedownHandler = function (evt) {
    if (evt.button === 0) {
      if (!window.page.isActive) {
        window.page.activate();
      }

      setAddress();
    }

    // перетаскивание
    var coords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var mouseMoveHandler = function (moveEvt) {
      dragged = true;

      var moveMainPin = function () {
        var shift = {
          x: coords.x - moveEvt.clientX,
          y: coords.y - moveEvt.clientY
        };

        var newY = mapPinMain.offsetTop - shift.y;
        var newX = mapPinMain.offsetLeft - shift.x;
        var newPinY = newY + MAIN_PIN_HEIGHT;
        var newPinX = newX + Math.round(MAIN_PIN_WIDTH / 2);

        if (newPinX >= 0 && newPinX <= PIN_MAX_X) {
          coords.x = moveEvt.clientX;
          mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
        }

        if (newPinY >= PIN_MIN_Y && newPinY <= PIN_MAX_Y) {
          coords.y = moveEvt.clientY;
          mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        }
      };

      moveMainPin();

      setAddress();
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      if (dragged) {
        var draggedClickHandler = function (clickEvt) {
          clickEvt.preventDefault();
          mapPinMain.removeEventListener('click', draggedClickHandler);
        };
        mapPinMain.addEventListener('click', draggedClickHandler);
      }
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var mapPinMainEnterPressHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      if (!window.page.isActive) {
        window.page.activate();
      }
    }
  };

  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainEnterPressHandler);

  var addressInput = adForm.querySelector('#address');

  window.map = {
    disable: disableMap,
    activate: activateMap
  };
})();
