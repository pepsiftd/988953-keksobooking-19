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

  // служебная функция очистки элемента от дочерних элементов
  var clearChildren = function (element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  };

  // добавление в карточку newCard дополнительных параметров из массива features
  // в виде <li class="popup__feature popup__feature--{{features[i]}}"></li>
  var addCardFeatures = function (newCard, features) {
    var featuresContainer = newCard.querySelector('.popup__features');
    clearChildren(featuresContainer);

    if (features.length === 0) {
      newCard.removeChild(featuresContainer);
      return -1;
    }

    for (var i = 0; i < features.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + features[i]);
      featuresContainer.appendChild(feature);
    }

    return 0;
  };

  // добавление в карточку newCard фотографий из массива photos
  // используя имеющийся в шаблоне пример
  var addCardPhotos = function (newCard, photos) {
    var photosContainer = newCard.querySelector('.popup__photos');
    var photoTemplate = newCard.querySelector('.popup__photo');

    if (photos.length === 0) {
      newCard.removeChild(photosContainer);
      return -1;
    }

    for (var i = 0; i < photos.length; i++) {
      var newPhoto = photoTemplate.cloneNode(true);
      newPhoto.src = photos[i];
      photosContainer.appendChild(newPhoto);
    }

    photosContainer.removeChild(photoTemplate);
    return 0;
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

  window.cards = cards;
})();
