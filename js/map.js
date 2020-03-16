'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESC_KEY = 'Escape';
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65; // button + ::after - translate
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;
  var PIN_MAX_X = document.querySelector('.map__pins').clientWidth;

  // находим карту
  var map = document.querySelector('.map');

  // обработка показа и скрытия карточек

  // массив article карточек
  var cards = window.cards;
  // находим элемент, перед которым будем вставлять карточку
  var filtersContainer = document.querySelector('.map__filters-container');
  // переменная для открытой в настоящий момент карточки
  var currentCard;

  // обработчики нажатий в карточках
  // на крестик в окне карточки
  var popupCloseClickHandler = function () {
    closeCurrentCard();
  };

  // на Escape при открытой карточке
  var escPressHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      closeCurrentCard();
    }
  };

  // на метку объявления на карте (кроме главной метки)
  var mapPinsClickHandler = function (evt) {
    // нажатие на map__pin
    if (evt.target.classList.contains('map__pin') && !evt.target.classList.contains('map__pin--main')) {
      showCard(cards[evt.target.value]);
    }
    // нажатие на img внутри map__pin
    if (evt.target.parentNode.classList.contains('map__pin') && !evt.target.parentNode.classList.contains('map__pin--main')) {
      showCard(cards[evt.target.parentNode.value]);
    }
  };

  // вставляет переданную из массива карточку на карту, обзывает её текущей и вешает обработчики
  var showCard = function (cardToShow) {
    if (currentCard) {
      closeCurrentCard();
    }

    map.insertBefore(cardToShow, filtersContainer);
    currentCard = cardToShow;

    var closeButton = currentCard.querySelector('.popup__close');
    closeButton.addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', escPressHandler);
  };

  // удаляет из DOM открытую карточку, подчищает обработчики
  var closeCurrentCard = function () {
    map.removeChild(currentCard);
    var closeButton = currentCard.querySelector('.popup__close');
    closeButton.removeEventListener('click', popupCloseClickHandler);
    document.removeEventListener('keydown', escPressHandler);
    currentCard = '';
  };

  // добавляем обработчик клика на контейнер с метками
  var pinsContainer = document.querySelector('.map__pins');
  pinsContainer.addEventListener('click', mapPinsClickHandler);

  // активация-деактивация страницы

  // находим формы и поля ввода
  var adForm = document.querySelector('.ad-form');
  var filtersForm = document.querySelector('.map__filters');
  var formInputs = adForm.querySelectorAll('input, select, textarea, button');

  // главная метка
  var mapPinMain = document.querySelector('.map__pin--main');

  // флаг активации страницы
  var pageIsActive = false;

  // отключение полей и селектов, затемнение карты и формы
  var disablePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('map__filters--disabled');

    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = true;
    }

    pageIsActive = false;
  };

  // открытие карты и формы, включение полей и селектов
  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    filtersForm.classList.remove('map__filters--disabled');

    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = false;
    }

    addressInput.readOnly = true;

    pageIsActive = true;

    window.pins.show();
  };

  var getMainPinCoordinates = function () {
    var mainPin = {
      x: parseInt(mapPinMain.style.left.slice(0, -2), 10) + Math.round(MAIN_PIN_WIDTH / 2),
      y: parseInt(mapPinMain.style.top.slice(0, -2), 10)
    };

    // если страница активна, y по острому концу, если нет - y в середине метки
    mainPin.y += pageIsActive ? MAIN_PIN_HEIGHT : Math.round(mapPinMain.clientHeight / 2);

    return mainPin;
  };

  // устанавливает в поле адреса координаты главной метки
  var setAddress = function () {
    var pin = getMainPinCoordinates();
    addressInput.value = pin.x + ', ' + pin.y;
  };

  var mapPinMainMousedownHandler = function (evt) {
    if (evt.button === 0) {
      if (!pageIsActive) {
        activatePage();
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
      // moveEvt.preventDefault();
      dragged = true;

      var moveMainPin = function () {
        var shift = {
          x: coords.x - moveEvt.clientX,
          y: coords.y - moveEvt.clientY
        };

        var newY = mapPinMain.offsetTop - shift.y;
        var newX = mapPinMain.offsetLeft - shift.x;
        var newPinY = newY + mapPinMain.clientHeight;
        var newPinX = newX + Math.round(mapPinMain.clientWidth / 2);

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

    var mouseUpHandler = function (upEvt) {
      // upEvt.preventDefault();

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
      if (!pageIsActive) {
        activatePage();
      }
    }
  };

  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainEnterPressHandler);

  var addressInput = adForm.querySelector('#address');

  disablePage();
  setAddress();

  // перемещение метки


})();
