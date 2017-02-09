/*jslint node: true*/
'use strict';

var aes = require('crypto-js/aes');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');

module.exports = function (output) {
  var modules = {};
  var lastFile = null;

  function processFile(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-lnsq-module', 'Streaming not supported'));
      return;
    }

    var type = path.extname(file.path).substring(1);
    var basename = path.basename(file.path, path.extname(file.path));
    var identifier = path.basename(path.dirname(file.path));

    if (basename == 'index' && (type == 'html' || type == 'css' || type == 'js')) {
      modules[identifier] = modules[identifier] || {html: null, css: null, js: null};
      modules[identifier][type] = file.contents.toString();
      lastFile = file;
    }

    setImmediate(cb, null, null);
  }

  function endStream(cb) {
    if (!lastFile) {
      cb();
      return;
    }

    var encrypted = [];
    Object.keys(modules).forEach(function(identifier) {
      var module = modules[identifier];
      module.identifier = identifier;
      encrypted.push(aes.encrypt(JSON.stringify(module), identifier).toString());
    });

    var file = lastFile.clone({contents: false});
    file.contents = new Buffer('module.exports = ' + JSON.stringify(encrypted) + ';');
    file.path = path.join(file.base, output);
    setImmediate(cb, null, file);
  }

  return through.obj(processFile, endStream);
};
