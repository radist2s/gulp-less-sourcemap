var gulp = require('gulp');
var less = require('../');
var path = require('path');

gulp.task('default', function () {
  gulp.src('./fixtures/buttons.less')
    .pipe(less({
      sourceMap: {
        sourceMapRootpath: '../fixtures'
      }
    }))
    .pipe(gulp.dest('./out'));
});

gulp.task('subfolder', function () {
  gulp.src('./fixtures/*/**.less')
    .pipe(less({
      sourceMap: {
        sourceMapRootpath: '../fixtures'
      }
    }))
    .pipe(gulp.dest('./out'));
});