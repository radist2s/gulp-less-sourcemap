var less = require('less');
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var defaults = require('lodash.defaults');
var fs = require('fs');

/**
 * @param {Function|Object} options
 * @returns {*}
 */
module.exports = function (options) {

  function transform (lessFile, enc, next) {
    var self = this;

    if (lessFile.isNull()) {
      this.push(lessFile); // pass along
      return next();
    }

    if (lessFile.isStream()) {
      this.emit('error', new PluginError('gulp-less-sourcemap', 'Streaming not supported'));
      return next();
    }

    var str = lessFile.contents.toString('utf8');

    var opts = options || {};

    // You can pass options as callback who return generated options object
    // based on dynamic arguments of transform function
    if (typeof options === 'function') {
      opts = options.apply(this, arguments) || {};
    }

    // Clone default options
    opts = defaults({}, opts)

    // Mixes in default options
    opts = defaults(
      opts,
      {
        compress: false,
        paths: [],
        generateSourceMap: true
      }
    );

    if (opts.generateSourceMap) {
      var sourceMapFileName = gutil.replaceExtension(path.basename(lessFile.path), '.css.map');
      var sourceMapFilePath = path.join(path.dirname(lessFile.path), sourceMapFileName);

      // Mixes in default sourcemap generation options
      opts = defaults(
        opts,
        {
          writeSourceMap: function (output) {
            var sourcemapFile = new (gutil.File)({
              cwd: lessFile.cwd,
              base: lessFile.base,
              path: sourceMapFilePath,
              contents: new Buffer(output, 'utf8')
            });

            self.push(sourcemapFile);
          },
          sourceMapURL: sourceMapFileName,
          sourceMap: 'yes', // if true then write inline sourcemap
          sourceMapRootpath: '',
          sourceMapBasepath: lessFile.base
        }
      );
    }

    // Injects the path of the current file.
    opts.filename = lessFile.path;

    less.render(str, opts, function (err, css) {
      if (err) {

        // convert the keys so PluginError can read them
        err.lineNumber = err.line;
        err.fileName = err.filename;

        // add a better error message
        err.message = err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;

        self.emit('error', new PluginError('gulp-less-sourcemap', err));
      } else {
        lessFile.contents = new Buffer(css, 'utf8');
        lessFile.path = gutil.replaceExtension(lessFile.path, '.css');
        self.push(lessFile);
      }
      next();
    });
  }

  return through2.obj(transform);
};
