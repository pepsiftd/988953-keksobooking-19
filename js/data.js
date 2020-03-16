'use strict';

(function () {
  var ADS_AMOUNT = 8;
  var ADS_MAX_PRICE = 15000;
  var ADS_MIN_PRICE = 1000;
  var ADS_MAX_ROOMS = 4;
  var ADS_MAX_GUESTS = 4;
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

  var generateAvatarLinks = function (amount) {
    var notChosen = []; // массив с цифрами от 0 до amount-1 для генерации неповторяющихся адресов картинок аватарок
    var avatarLinks = [];

    // заполняем notChosen цифрами от 0 до amount-1
    for (var j = 0; j < amount; j++) {
      notChosen[j] = j + 1;
    }

    // заполняем массив адресами картинок в случайном порядке
    for (var i = 0; i < amount; i++) {
      var randomNumber = window.util.chooseRandomFromArray(notChosen);

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
        'x': window.util.getRandomInteger(PIN_MAX_X),
        'y': window.util.getRandomInteger(PIN_MAX_Y, PIN_MIN_Y)
      };

      adsArray[i] =
      {
        'author': {
          'avatar': avatarLinks[i]
        },
        'offer': {
          'title': window.util.chooseRandomFromArray(ADS_TITLES).value,
          'address': location.x + ', ' + location.y,
          'price': window.util.getRandomInteger(ADS_MAX_PRICE, ADS_MIN_PRICE),
          'type': window.util.chooseRandomFromArray(ADS_TYPES).value,
          'rooms': window.util.getRandomInteger(ADS_MAX_ROOMS, 1),
          'guests': window.util.getRandomInteger(ADS_MAX_GUESTS, 1),
          'checkin': window.util.chooseRandomFromArray(ADS_CHECKIN_TIMES).value,
          'checkout': window.util.chooseRandomFromArray(ADS_CHECKOUT_TIMES).value,
          'features': window.util.chooseSomeFromArray(ADS_FEATURES),
          'description': window.util.chooseRandomFromArray(ADS_DESCRIPTIONS).value,
          'photos': window.util.chooseSomeFromArray(ADS_PHOTOS)
        },
        'location': {
          'x': location.x,
          'y': location.y
        }
      };
    }

    return adsArray;
  };

  // собираем массив данных для объявлений
  var ads = createRandomAdsArray(ADS_AMOUNT);

  window.data = ads;
})();
