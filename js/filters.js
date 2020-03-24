'use strict';

(function () {
  var LOWER_PRICE_THRESHOLD = 10000;
  var HIGHER_PRICE_THRESHOLD = 50000;

  var filtersForm = document.querySelector('.map__filters');
  var formElements = filtersForm.querySelectorAll('select, fieldset');

  var typeSelect = filtersForm.querySelector('#housing-type');
  var priceSelect = filtersForm.querySelector('#housing-price');
  var roomsSelect = filtersForm.querySelector('#housing-rooms');
  var guestsSelect = filtersForm.querySelector('#housing-guests');
  var featuresFieldset = filtersForm.querySelector('#housing-features');

  // проверка наличия в объявлении выбранных дополнительных удобств
  var matchFeatures = function (features) {
    var selectedFeatures = featuresFieldset.querySelectorAll(':checked');

    for (var i = 0; i < selectedFeatures.length; i++) {
      var selectedFeature = selectedFeatures[i].value;

      if (!features.includes(selectedFeature)) {
        return false;
      }
    }

    return true;
  };

  // проверка соответствия объявления выбранному в select параметру
  var matchData = function (select, parameter) {
    var filter = select.value;
    var match = false;

    if (filter === 'any' || (parameter + '') === filter) {
      match = true;
    }

    return match;
  };

  // проверка соответствия объявления выбранному ценовому диапазону
  var matchPrice = function (price) {
    var filter = priceSelect.value;
    var match = false;

    switch (filter) {
      case 'any':
        match = true;
        break;
      case 'low':
        if (price <= LOWER_PRICE_THRESHOLD) {
          match = true;
        }
        break;
      case 'middle':
        if (price >= LOWER_PRICE_THRESHOLD && price <= HIGHER_PRICE_THRESHOLD) {
          match = true;
        }
        break;
      case 'high':
        if (price >= HIGHER_PRICE_THRESHOLD) {
          match = true;
        }
        break;
    }

    return match;
  };

  // проверка наличия в объявлении всех выбранных условий
  var matchAll = function (ad) {
    return matchData(typeSelect, ad.offer.type)
      && matchData(roomsSelect, ad.offer.rooms)
      && matchData(guestsSelect, ad.offer.guests)
      && matchPrice(ad.offer.price)
      && matchFeatures(ad.offer.features);
  };

  // проверка наличия поля offer
  var checkOffer = function (ad) {
    return Boolean(ad.offer);
  };

  // фильтрация полученных с сервера данных по всем фильтрам
  var filterData = function () {
    var data = window.data.ads;

    window.data.filteredAds = data.filter(function (ad) {
      return checkOffer(ad) && matchAll(ad);
    });
  };

  var formChangeHandler = function () {
    window.cards.close();
    window.debounce(function () {
      filterData();
      window.pins.redraw();
    });
  };

  var disableForm = function () {
    filtersForm.classList.add('map__filters--disabled');
    filtersForm.removeEventListener('change', formChangeHandler);

    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = true;
    }
  };

  var enableForm = function () {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = false;
    }

    filtersForm.addEventListener('change', formChangeHandler);
    filtersForm.classList.remove('map__filters--disabled');
  };

  window.filters = {
    enable: enableForm,
    disable: disableForm,
    apply: filterData
  };
})();
