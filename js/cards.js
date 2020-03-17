'use strict';

(function () {
  var ESC_KEY = 'Escape';

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

  // создание DOM-элемента карточки с её заполнением
  var createNewCard = function (ad) {
    var newCard = cardTemplate.cloneNode(true);

    newCard.querySelector('.popup__title').textContent = ad.offer.title;
    newCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    newCard.querySelector('.popup__text--price').innerHTML = ad.offer.price + '&#x20bd;<span>/ночь</span>';
    newCard.querySelector('.popup__type').textContent = translateAdType(ad.offer.type);
    newCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    addCardFeatures(newCard, ad.offer.features);

    newCard.querySelector('.popup__description').textContent = ad.offer.description;
    newCard.querySelector('.popup__avatar').src = ad.author.avatar;

    addCardPhotos(newCard, ad.offer.photos);

    return newCard;
  };

  // создание коллекции карточек из массива объектов объявлений ads для последующей вставки на страницу
  var createCardsCollection = function () {
    var cards = [];
    var ads = window.data;

    for (var i = 0; i < ads.length; i++) {
      cards[i] = createNewCard(ads[i]);
    }

    return cards;
  };

  // создаём массив article карточек
  var cards = createCardsCollection();

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
    if (evt.key === ESC_KEY) {
      closeCurrentCard();
    }
  };

  // удаляет из DOM открытую карточку, подчищает обработчики
  var closeCurrentCard = function () {
    map.removeChild(currentCard);
    var closeButton = currentCard.querySelector('.popup__close');
    closeButton.removeEventListener('click', popupCloseClickHandler);
    document.removeEventListener('keydown', escPressHandler);
    currentCard = '';
  };

  window.cards = {
    list: cards,
    current: currentCard,
    show: showCard
  };
})();
