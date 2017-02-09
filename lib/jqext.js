/* jshint browserify: true*/
/* globals $ */

module.exports = {
  setup: function () {
    $.fn.animatedHTML = function (html) {
      var self = this;
      setTimeout(function () { $(self).addClass('fadeout'); }, 0);
      setTimeout(function () { $(self).html(html); }, 50);
      setTimeout(function () { $(self).removeClass('fadeout'); }, 100);
    };
  }
};
