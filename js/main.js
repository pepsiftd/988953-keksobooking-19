'use strict';

var ADS_AMOUNT = 8;
var ADS_MAX_PRICE = 15000;
var ADS_MIN_PRICE = 1000;
var ADS_MAX_ROOMS = 4;
var ADS_MAX_GUESTS = 4;
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
    fragment.appendChild(createNewPin(array[j]));
  }
};

// открываем карту
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// находим template и место для вставки
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var pinsContainer = document.querySelector('.map__pins');

// собираем массив объявлений и фрагмент из него
var ads = createRandomAdsArray(ADS_AMOUNT);
var fragment = document.createDocumentFragment();
fillFragment(ads, fragment);

// вставляем фрагмент в блок
pinsContainer.appendChild(fragment);

