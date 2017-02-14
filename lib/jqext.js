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

    $.fn.autoDisplay = function (data, doneCallback) {
      var self = this;
      data = data.slice();

      function next() {
        if (data.length > 0) {
          $(self).animatedHTML(data.shift());
          setTimeout(next, 3000);
        } else {
          doneCallback();
        }
      }

      next();
    };

    $.fn.replaceRandomLetter = function () {
      $(this).each(function () {
        var html = $(this).html();
        var p = Math.random() * html.length | 0;
        html = html.substring(0, p) + Math.random().toString(36).slice(-1) + html.substring(p + 1);
        $(this).html(html);
      });
    };

    $.fn.garbageFill = function () {
      $(this).each(function () {
        var element = $('<span style="position:absolute">x</span>');
        $(this).append(element);
        var charWidth = element.innerWidth();
        var charHeight = element.innerHeight();
        element.remove();

        var numChars = ($(this).innerHeight() / charHeight) * ($(this).innerWidth() / charWidth);

        var chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-={}|[]\\:";\'?,./';
        var garbage = [];
        for (var i = 0; i < numChars; i++) {
          garbage.push(chars[Math.random() * chars.length | 0]);
        }
        $(this).html(garbage.join(''));
      });
    };
  }
};
