'use strict';

var ADS_AMOUNT = 8;
var ADS_MAX_PRICE = 15000;
var ADS_MIN_PRICE = 1000;
var ADS_MAX_ROOMS = 4;
var ADS_MAX_GUESTS = 4;
var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65 + 22 - 6; // button + ::after - translate
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MIN_Y = 130;
var PIN_MAX_Y = 630;
var PIN_MAX_X = document.querySelector('.map__pins').clientWidth;

var ADS_TITLES =
[
  'Снять хату',
  'Снять бунгало',
  'Сдам избушку',
  'Сдам шалаш',
  'Аренда квартиры посуточно',
  'Аренда комнаты',
  'Размещение в 2-х комнатном номере',
  'Размещение в президентском пентхаусе'
];

var ADS_TYPES =
[
  'palace',
  'flat',
  'house',
  'bungalo'
];

var ADS_CHECKIN_TIMES =
[
  '12:00',
  '13:00',
  '14:00'
];

var ADS_CHECKOUT_TIMES =
[
  '12:00',
  '13:00',
  '14:00'
];

var ADS_FEATURES =
[
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var ADS_DESCRIPTIONS =
[
  'Отличное место со всеми удобствами',
  'Потрясающие виды, тихое и удобное расположение',
  'Много магазинов, хорошая транспортная доступность',
  'Вид на соседний дом и убаюкивающие звуки автострады',
  'Заманчивое предложение, по этой цене только сегодня, трансфер от аэропорта включен в стоимость'
];

var ADS_PHOTOS =
[
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var chooseRandomFromArray = function (array) {
  var randomIndex = getRandomInteger(array.length - 1);
  return {
    value: array[randomIndex],
    index: randomIndex
  };
};

var getRandomInteger = function (max, min) {
  min = min ? Math.ceil(min) : 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var chooseSomeFromArray = function (array) {
  var length = getRandomInteger(array.length); // случайное количество элементов, не больше, чем в исходном массиве
  var unused = array.slice(); // копируем массив
  var chosenItems = [];

  for (var i = 0; i < length; i++) {
    var randomItem = chooseRandomFromArray(unused);
    chosenItems[i] = randomItem.value;
    unused.splice(randomItem.index, 1); // убираем выбранный пункт, чтобы не повторялся
  }

  return chosenItems;
};

var generateAvatarLinks = function (amount) {
  var notChosen = []; // массив с цифрами от 0 до amount-1 для генерации неповторяющихся адресов картинок аватарок
  var avatarLinks = [];

  // заполняем notChosen цифрами от 0 до amount-1
  for (var j = 0; j < amount; j++) {
    notChosen[j] = j + 1;
  }

  // заполняем массив адресами картинок в случайном порядке
  for (var i = 0; i < amount; i++) {
    var randomNumber = chooseRandomFromArray(notChosen);

    notChosen.splice(randomNumber.index, 1);
    // 'img/avatars/user01.png'
    avatarLinks[i] = 'img/avatars/user' + ('0' + randomNumber.value).slice(-2) + '.png';
  }

  return avatarLinks;
};

var createRandomAdsArray = function (amount) {
  var adsArray = [];
  var avatarLinks = generateAvatarLinks(amount);

  // заполняем массив объявлений
  for (var i = 0; i < amount; i++) {
    var location =
    {
      'x': getRandomInteger(PIN_MAX_X),
      'y': getRandomInteger(PIN_MAX_Y, PIN_MIN_Y)
    };

    adsArray[i] =
    {
      'author': {
        'avatar': avatarLinks[i]
      },
      'offer': {
        'title': chooseRandomFromArray(ADS_TITLES).value,
        'address': location.x + ', ' + location.y,
        'price': getRandomInteger(ADS_MAX_PRICE, ADS_MIN_PRICE),
        'type': chooseRandomFromArray(ADS_TYPES).value,
        'rooms': getRandomInteger(ADS_MAX_ROOMS, 1),
        'guests': getRandomInteger(ADS_MAX_GUESTS, 1),
        'checkin': chooseRandomFromArray(ADS_CHECKIN_TIMES).value,
        'checkout': chooseRandomFromArray(ADS_CHECKOUT_TIMES).value,
        'features': chooseSomeFromArray(ADS_FEATURES),
        'description': chooseRandomFromArray(ADS_DESCRIPTIONS).value,
        'photos': chooseSomeFromArray(ADS_PHOTOS)
      },
      'location': {
        'x': location.x,
        'y': location.y
      }
    };
  }

  return adsArray;
};

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

// собираем массив данных для объявлений
var ads = createRandomAdsArray(ADS_AMOUNT);

var showAds = function () {
  //собираем фрагмент из массива данных объявлений
  var fragment = document.createDocumentFragment();
  fillFragment(ads, fragment);

  // вставляем фрагмент в блок
  pinsContainer.appendChild(fragment);
};

// находим карту
var map = document.querySelector('.map');

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

  showAds();
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
var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

disablePage();
setAddress();

var validateCapacity = function () {
  capacitySelect.setCustomValidity('');

  if (roomNumberSelect.value === '100' && parseInt(capacitySelect.value, 10) !== 0) {
    capacitySelect.setCustomValidity('Нельзя заселиться во дворец');
  }

  if (parseInt(roomNumberSelect.value, 10) < capacitySelect.value) {
    capacitySelect.setCustomValidity('Гостей не должно быть больше, чем комнат');
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
}

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

validateCapacity();
validateTime();
validatePrice();
adForm.addEventListener('change', formChangeHandler);

// отрисовка карточек

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
    case 'flat':
      rusType = 'Квартира';
    case 'house':
      rusType = 'Дом';
    case 'bungalo':
      rusType = 'Бунгало';
  };

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
var createCardsCollection = function (ads) {
  var cards = [];

  for (var i = 0; i < ads.length; i++) {
    cards[i] = createNewCard(ads[i]);
  }

  return cards;
};

// обработка показа и скрытия карточек

// создаем массив article карточек
var cards = createCardsCollection(ads);
// находим элемент, перед которым будем вставлять карточку
var filtersContainer = document.querySelector('.map__filters-container');
// переменная для открытой в настоящий момент карточки
var currentCard;

// обработчики нажатий
// на крестик в окне карточки
var popupCloseClickHandler = function (evt) {
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
}

// добавляем обработчик клика на контейнер с метками
pinsContainer.addEventListener('click', mapPinsClickHandler);
