'use strict';

(function () {
  // служебная функция очистки элемента от дочерних элементов
  var clearChildren = function (element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  };

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

  window.util = {
    clearChildren: clearChildren,
    chooseRandomFromArray: chooseRandomFromArray,
    getRandomInteger: getRandomInteger,
    chooseSomeFromArray: chooseSomeFromArray
  }
})();
