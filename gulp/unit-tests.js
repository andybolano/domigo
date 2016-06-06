'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');


gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
