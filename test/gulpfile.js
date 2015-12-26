var gulp = require('gulp');
var less = require('../');

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
      },
      plugins: [
        new LessPluginCleanCSS({
          advanced: true
        }),
        new LessPluginAutoPrefix({
          browsers: ['> 0%'],
          cascade: true
        })

      ]
    }))
    .pipe(gulp.dest('./out'));
});

gulp.task('subfolder-and-plugins', function () {
  var LessPluginCleanCSS = require('less-plugin-clean-css');
  var LessPluginAutoPrefix = require('less-plugin-autoprefix');

  gulp.src('./fixtures/*/**.less')
    .pipe(less({
      sourceMap: {
        sourceMapRootpath: '../fixtures'
      },
      plugins: [
        new LessPluginCleanCSS({
          advanced: true
        }),
        new LessPluginAutoPrefix({
          browsers: ['> 0%'],
          cascade: true
        })

      ]
    }))
    .pipe(gulp.dest('./out'));
});