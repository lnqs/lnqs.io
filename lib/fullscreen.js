/* jshint browserify: true*/
/* globals $ */
'use strict';

module.exports = {
  enter: function (exitCallback) {
    document.body.requestFullScreen = document.body.requestFullScreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen;
    document.body.requestFullScreen();

    $(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange', function () {
      if (!document.fullScreen && !document.mozFullScreen && !document.webkitIsFullScreen) {
        exitCallback();
      }
    });
  }
};
