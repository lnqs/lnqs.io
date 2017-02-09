/*jslint node: true*/
'use strict';

var autoprefixer = require('gulp-autoprefixer');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var cleancss = require('gulp-clean-css');
var csslint = require('gulp-csslint');
var env = require('gulp-environments');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var glob = require('glob');
var gutil = require('gulp-util');
var htmlhint = require('gulp-htmlhint');
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var jshint = require('gulp-jshint');
var lazypipe = require('lazypipe');
var newer = require('gulp-newer');
var path = require('path');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var stripAnsi = require('strip-ansi');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');

var lnqsModules = require('./build/gulp-lnsq-modules');

var sources = {
  html: ['index.html'],
  css: ['style.css'],
  js: ['main.js'],
  modules: ['modules/**/*.html', 'modules/**/*.js', 'modules/**/*.css']
};

gutil.log('Environment: ' + (env.production() ? 'PRODUCTION' : 'DEVELOPMENT'));

var errors = lazypipe()
  .pipe(plumber, {
    errorHandler: function (err) {
      console.log(err);
      setTimeout(function () {
        browserSync.notify(stripAnsi(err.toString(), 5000));
      }, 3000);
      this.emit('end');
    }
  });

var html = lazypipe()
  .pipe(function () {
    return env.production(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }));
  });

var css = lazypipe()
  .pipe(function () { return env.development(sourcemaps.init()); })
  .pipe(csslint)
  .pipe(csslint.formatter)
  .pipe(csslint.formatter, 'fail')
  .pipe(autoprefixer, 'last 1 version', '> 1%', 'ie 8', 'ie 7')
  .pipe(cleancss, {keepSpecialComments: 0})
  .pipe(function () { return env.development(sourcemaps.write()); });

var js = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, 'fail')
  .pipe(tap, function (file) {
    file.contents = browserify(file.path, {paths: ['./lib', './node_modules', './cache'], debug: env.development()}).bundle();
  })
  .pipe(buffer)
  .pipe(function () { return env.development(sourcemaps.init({loadMaps: true})); })
  .pipe(uglify)
  .pipe(function () { return env.development(sourcemaps.write()); });

gulp.task('html', ['css', 'js', 'modules'], function () {
  return gulp.src(sources.html, {base: '.'})
    .pipe(errors())
    .pipe(newer({dest: 'dist', extra: ['cache/*']}))
    .pipe(htmlhint())
    .pipe(htmlhint.reporter('fail'))
    .pipe(html())
    .pipe(inlinesource({rootpath: path.resolve('cache')}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('css', [], function () {
  return gulp.src(sources.css)
    .pipe(errors())
    .pipe(newer('cache'))
    .pipe(css())
    .pipe(gulp.dest('cache'));
});

gulp.task('js', ['modules'], function () {
  return gulp.src(sources.js)
    .pipe(errors())
    .pipe(newer({dest: 'cache', extra: ['cache/*.js', 'lib/**/*.js']}))
    .pipe(js())
    .pipe(gulp.dest('cache'));
});

gulp.task('modules', function () {
  return gulp.src(sources.modules)
    .pipe(errors())
    .pipe(newer({dest: 'cache/modules.js', extra: ['lib/**/*.js']}))
    .pipe(gulpif(/.*\.html/i, html()))
    .pipe(gulpif(/.*\.css/i, css()))
    .pipe(gulpif(/.*\.js/i, js()))
    .pipe(lnqsModules('modules.js'))
    .pipe(uglify())
    .pipe(gulp.dest('cache'));
});

gulp.task('serve', ['build'], function () {
  browserSync.init({server: {baseDir: './dist'}});
  gulp.watch([].concat(sources.html, sources.css, sources.js, sources.modules, ['lib/**/*.js']), ['html']);
});

gulp.task('build', ['html']);

gulp.task('default', ['build']);
