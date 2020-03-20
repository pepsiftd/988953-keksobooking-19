'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');
  var formElements = filtersForm.querySelectorAll('select, fieldset');

  var disableForm = function () {
    filtersForm.classList.add('map__filters--disabled');

    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = true;
    }
  };

  var enableForm = function () {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = false;
    }

    filtersForm.classList.remove('map__filters--disabled');
  };

  window.filters = {
    enable: enableForm,
    disable: disableForm
  };
})();
