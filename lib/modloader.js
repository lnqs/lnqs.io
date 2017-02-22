/* jshint browserify: true */
/* globals $ */
'use strict';

var aes = require('crypto-js/aes');
var encUtf8 = require('crypto-js/enc-utf8');
var modules = require('modules');

var loadDelayedTimeout = null;

function decrypt(data, passphrase) {
  return aes.decrypt(data, passphrase).toString(encUtf8);
}

function findModule(identifier) {
  for (var i = 0; i < modules.length; i++) {
    try {
      var module = JSON.parse(decrypt(modules[i], identifier));
      if (module.identifier == identifier) {
        return module;
      }
    } catch (err) {}
  }

  return undefined;
}

module.exports = {
  exists: function (identifier) {
    return !!findModule(identifier);
  },
  load: function (identifier) {
    var module = findModule(identifier);
    if (!module) {
      throw Error('Failed to load or decrypt module `' + identifier + '`');
    }

    if (this.atExit) {
        this.atExit();
        this.atExit = null;
    }

    if (loadDelayedTimeout) {
      clearTimeout(loadDelayedTimeout);
      loadDelayedTimeout = null;
    }

    setTimeout(function () { $('main').addClass('flash fadeout'); }, 0);
    setTimeout(function () {
        $('main').html('<style type="text/css">' + module.css + '</style>' + module.html);
        eval(module.js); // jshint ignore:line
    }, 50);
    setTimeout(function () { $('main').removeClass('flash fadeout'); }, 100);
  },
  loadDelayed: function (identifier) {
    if (loadDelayedTimeout) {
      clearTimeout(loadDelayedTimeout);
      loadDelayedTimeout = null;
    }

    var self = this;
    loadDelayedTimeout = setTimeout(function () { self.load(identifier); }, 2000);
  },
  cancelDelayedLoading: function () {
    if (loadDelayedTimeout) {
      clearTimeout(loadDelayedTimeout);
      loadDelayedTimeout = null;
    }
  },
  atExit: null
};
