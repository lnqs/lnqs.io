/* jshint browserify: true*/
/* globals $ */
'use strict';

module.exports = {
  setup: function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    for (var w = 0; w < canvas.width; w += 4.0) {
      for (var h = 0; h < canvas.height; h += 3.0) {
        var rgb = Math.random() * 256 | 0;
        ctx.fillStyle = 'rgba(' + [rgb, rgb, rgb, 0.035].join() + ')';
        ctx.fillRect(w, h, 8.0, 8.0);
      }
    }

    $('head').append('<style type="text/css">body::before { background-image: url(' + canvas.toDataURL('image/png') + '); }</style>');
  }
};
