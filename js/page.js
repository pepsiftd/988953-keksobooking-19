'use strict';

(function () {
  // флаг активации страницы
  var pageIsActive = false;

  var setPageStatus = function () {
    window.page.isActive = pageIsActive;
  };

  // отключение полей и селектов, затемнение карты и формы
  var disablePage = function () {
    pageIsActive = false;
    setPageStatus();

    window.map.disable();
    window.form.disable();
  };

  // открытие карты и формы, включение полей и селектов
  var activatePage = function () {
    pageIsActive = true;
    setPageStatus();

    window.map.activate();
    window.form.enable();
    window.pins.show();
  };

  // сброс и выключение форм, скрытие карты, меток и карточек
  var resetPage = function () {
    disablePage();

    window.form.reset();
    window.pins.remove();
    window.cards.close();
  };

  window.page = {
    isActive: pageIsActive,
    activate: activatePage,
    disable: disablePage,
    reset: resetPage
  };

  disablePage();
})();
