'use strict';

(function () {
  // находим шаблон карточки
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  // перевод типа объявления на русский
  var translateAdType = function (type) {
    var rusType = '';
    switch (type) {
      case 'palace':
        rusType = 'Дворец';
        break;
      case 'flat':
        rusType = 'Квартира';
        break;
      case 'house':
        rusType = 'Дом';
        break;
      case 'bungalo':
        rusType = 'Бунгало';
    }

    return rusType;
  };

  // добавление в карточку newCard дополнительных параметров из массива features
  // в виде <li class="popup__feature popup__feature--{{features[i]}}"></li>
  var addCardFeatures = function (newCard, features) {
    var featuresContainer = newCard.querySelector('.popup__features');
    window.util.clearChildren(featuresContainer);

    if (features.length === 0) {
      newCard.removeChild(featuresContainer);
      return;
    }

    for (var i = 0; i < features.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + features[i]);
      featuresContainer.appendChild(feature);
    }
  };

  // добавление в карточку newCard фотографий из массива photos
  // используя имеющийся в шаблоне пример
  var addCardPhotos = function (newCard, photos) {
    var photosContainer = newCard.querySelector('.popup__photos');
    var photoTemplate = newCard.querySelector('.popup__photo');

    if (photos.length === 0) {
      newCard.removeChild(photosContainer);
      return;
    }

    for (var i = 0; i < photos.length; i++) {
      var newPhoto = photoTemplate.cloneNode(true);
      newPhoto.src = photos[i];
      photosContainer.appendChild(newPhoto);
    }

    photosContainer.removeChild(photoTemplate);
  };

  // добавление в указанное поле карточки указанного текста (при его наличии)
  var addFieldContent = function (field, text, alt) {
    if (text) {
      if (alt) {
        field[alt] = text;
      } else {
        field.textContent = text;
      }
    } else {
      field.parentNode.removeChild(field);
    }
  };

  // создание DOM-элемента карточки с её заполнением
  var createNewCard = function (ad) {
    var newCard = cardTemplate.cloneNode(true);

    addFieldContent(newCard.querySelector('.popup__title'), ad.offer.title);
    addFieldContent(newCard.querySelector('.popup__text--address'), ad.offer.address);
    addFieldContent(newCard.querySelector('.popup__text--price'), ad.offer.price + '&#x20bd;<span>/ночь</span>', 'innerHTML');
    addFieldContent(newCard.querySelector('.popup__type'), translateAdType(ad.offer.type));
    addFieldContent(newCard.querySelector('.popup__text--capacity'), ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    addFieldContent(newCard.querySelector('.popup__text--time'), 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);

    addCardFeatures(newCard, ad.offer.features);

    addFieldContent(newCard.querySelector('.popup__description'), ad.offer.description);
    addFieldContent(newCard.querySelector('.popup__avatar'), ad.author.avatar, 'src');

    addCardPhotos(newCard, ad.offer.photos);

    return newCard;
  };

  // создание коллекции карточек из массива объектов объявлений ads для последующей вставки на страницу
  var cards = [];

  var createCardsCollection = function () {
    var ads = window.data.filtered;

    for (var i = 0; i < ads.length; i++) {
      cards[i] = createNewCard(ads[i]);
    }

    window.cards.list = cards;
  };

  // находим карту
  var map = document.querySelector('.map');

  // находим элемент, перед которым будем вставлять карточку
  var filtersContainer = document.querySelector('.map__filters-container');

  // переменная для открытой в настоящий момент карточки
  var currentCard;

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

  // обработчики нажатий в карточках
  // на крестик в окне карточки
  var popupCloseClickHandler = function () {
    closeCurrentCard();
  };

  // на Escape при открытой карточке
  var escPressHandler = function (evt) {
    window.util.isEscEvent(evt, function () {
      closeCurrentCard();
    });
  };

  // удаляет из DOM открытую карточку, снимает флаг "active" с текущей метки, подчищает обработчики
  var closeCurrentCard = function () {
    if (currentCard) {
      map.removeChild(currentCard);
      window.pins.deactivateCurrent();
      var closeButton = currentCard.querySelector('.popup__close');
      closeButton.removeEventListener('click', popupCloseClickHandler);
      document.removeEventListener('keydown', escPressHandler);
      currentCard = '';
    }
  };

  window.cards = {
    create: createCardsCollection,
    list: cards,
    current: currentCard,
    show: showCard,
    close: closeCurrentCard
  };
})();
