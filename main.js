/* jshint browserify: true*/
/* globals $, modloader */
'use strict';

global.$ = require('jquery');
global.modloader = require('modloader');

var audio = require('audio');
var background = require('background');
var fullscreen = require('fullscreen');
var jqext = require('jqext');

jqext.setup();

var compat = [
  !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/),
  document.body.requestFullScreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen,
  window.AudioContext || window.webkitAudioContext,
  window.performance && window.performance.navigation
].every(function (e) { return e; });

if (!compat) {
  $('main').html('<h1>I\'m afraid I can\'t let you in.</h1>');
} else if (window.performance.navigation.type != 1) {
  var visits = document.cookie.match(/v=([0-9]+)/);
  visits = (visits && visits.length > 1) ? parseInt(visits[1]) : 0;
  document.cookie = 'v=' + (visits + 1) + '; expires=Sat, 01 Jan 2084 12:00:00 UTC';

  var greetings = [
    'Welcome to my place!',
    'Nice to see you again!',
    'Welcome back again!',
    'We\'ve got a frequent visitor, don\'t we?',
    'Seems like someone is not giving up...',
    'You know how it works...'
  ];

  $('main').html(
    '<div>' +
      '<h1>' + greetings[Math.min(Math.max(Math.sqrt(visits / 20), 0), greetings.length - 1) | 0] + '</h1>' +
      'Please <a href="#" id="enter">enter</a> and stay as long as you want.' +
    '</div>');
} else {
  $('main').html(
    '<div>' +
      '<h1>I\'m proud to see you know how to reload a page.</h1>' +
      'Please <a href="#" id="enter">enter</a> and stay as long as you want.' +
    '</div>');
}

$('#enter').click(function () {
  audio.play();
  background.setup();

  fullscreen.enter(function () {
    $('main').html('<h1>It\'s really a shame to see you leave...</h1>');
    audio.stop();

    if (modloader.atExit) {
      modloader.atExit();
    }
  });

  modloader.load('entry');
});
