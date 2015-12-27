var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
module.exports = function (options, epubBookPath) {
  var config = options.config;
  async.waterfall([
    function (callback) {
      rimraf(epubBookPath, function (err) {
        callback(err);
      });
    },
    function (callback) {
      var patterns = options.patterns ?
          options.patterns.split(',').map(function (p) { return p.replace(/^\s*/, '').replace(/\s*$/, ''); }) :
         [ '**/*.md' ];
      var inputPatterns = patterns.map(function (p) { return path.join(__cwd, config.output, 'mdx') + '/' + p; });
      var epubCmdArgs = [
        'pandoc -S -o',
        epubBookPath,
        path.join(__cwd, 'book.txt'),
        inputPatterns.join(' '),
        '--highlight-style haddock',
        '--epub-cover-image=' + path.join(__cwd, 'cover.png'),
        '--epub-stylesheet=' + path.join(__cwd, 'book.epub.css'),
        '--toc-depth=5'
      ];
      var epubCmdCommand = epubCmdArgs.join(' ');
      callback(null, epubCmdCommand);
    },
    function (epubCmdCommand, callback) {
      exec(epubCmdCommand, function (err, inerr, outerr) {
        callback(err);
      });
    },
    function (callback) {
      __blogger.log('Finished making the .epub book.');
      callback(null);
    }
  ], function (err) {
    if (err) { return console.log(err); }
  });
};
