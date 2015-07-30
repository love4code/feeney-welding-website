/**
 *  I was running a gulp script with Stylus then I decided it would be nice to have live reload so I went and
 *  grabbed a chunk of JavaScript out of the Google Webkit and merged the two. To run my Stylus watcher setup
 *  with the BrowserSync use   'gulp serve'
 */

'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var stylus = require('gulp-stylus');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('stylus', function () {
  gulp.src('app/css/styl/main.styl')
      .pipe(stylus())
      .pipe(gulp.dest('app/css'));
});


// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
      .pipe(reload({stream: true, once: true}))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// Watch files for changes & reload
gulp.task('serve', ['stylus'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.{html,php}'], reload);
  gulp.watch(['app/css/**/**/**/**/*.{styl,css}'], ['stylus', reload]);
  gulp.watch(['app/js/**/*.js'], ['jshint']);
  gulp.watch(['app/images/**/*'], reload);
});


/*
// Build production files, the default task  (Don't need this until the site is complete, it will require some work to set up too).
gulp.task('default', ['clean'], function (cb) {
  runSequence(
      'styles', // mine is 'stylus'
      ['jshint', 'html', 'scripts', 'images', 'fonts', 'copy'],
      'generate-service-worker',
      cb);
});
*/