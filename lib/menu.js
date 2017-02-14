/* jshint browserify: true */
/* global $ */
'use strict';

function Menu(element, selectionCallback) {
  this.keydownHandler = function () {
    var items = element.children('li');
    var active = null;

    items.each(function (index, element) {
      if ($(element).hasClass('active')) {
        active = index;
      }
    });

    if (event.keyCode == 38) { // arrow up
      $(items[active]).removeClass('active');
      $(items[active ? active - 1 : items.length - 1]).addClass('active');
    } else if (event.keyCode == 40) { // arrow down
      $(items[active]).removeClass('active');
      $(items[(active + 1) % items.length]).addClass('active');
    } else if (event.keyCode == 13) { // Enter
      selectionCallback($(items[active]).attr('id'));
    }
  };

  $(window).on('keydown', this.keydownHandler);
}

Menu.prototype.disable = function () {
  $(window).off('keydown', this.keydownHandler);
};

module.exports = Menu;
