'use strict';

// {
//         "author": {
//         "avatar": строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём. Например, 01, 02 и т. д. Адреса изображений не повторяются
//         },
//     "offer": {
//     "title": строка, заголовок предложения
//     "address": строка, адрес предложения. Для простоты пусть пока представляет собой запись вида "{{location.x}}, {{location.y}}", например, "600, 350"
//     "price": число, стоимость
//     "type": строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
//     "rooms": число, количество комнат
//     "guests": число, количество гостей, которое можно разместить
//     "checkin": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
//     "checkout": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
//     "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
//     "description": строка с описанием,
//     "photos": массив строк случайной длины, содержащий адреса фотографий "http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
//     },

//     "location": {
//     "x": случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
//     "y": случайное число, координата y метки на карте от 130 до 630.
//     }
// }



var ADS_AMOUNT = 8;

var chooseRandomFromArray = function (array) {
  var randomIndex = Math.round(Math.random() * (array.length - 1));
  return {
    value: array[randomIndex],
    index: randomIndex
  };
};

var createRandomAdsArray = function (amount) {
  var adsArray = [];
  var notChosen = [];

  for (var j = 0; j < amount; j++) {
    notChosen[j] = j + 1;
  }

  for (var i = 0; i < amount; i++) {
    var randomNumber = chooseRandomFromArray(notChosen);
    notChosen.splice(randomNumber.index, 1);

    adsArray[i] =
    {
      'author': {
        'avatar': 'img/avatars/user' + ('0' + randomNumber.value).slice(-2) + '.png' // 'img/avatars/user01.png'
      },
      'offer': {
        'title': 'строка, заголовок предложения',
        'address': '600, 350',
        'price': 1500,
        'type': 'flat', //palace, flat, house или bungalo
        'rooms': 4,
        'guests': 2,
        'checkin': '12:00', //12:00, 13:00 или 14:00,
        'checkout': '12:00', //12:00, 13:00 или 14:00
        'features': ['wifi', 'parking'], //'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner',
        'description': 'строка с описанием',
        'photos': [
          'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
        ]
      },
      'location': {
        'x': 500, // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
        'y': 200 // случайное число, координата y метки на карте от 130 до 630.
      }
    }
  }

  return adsArray;
};

console.log(createRandomAdsArray(8));
