var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
module.exports = function (options, pdfBookPath) {
  var config = options.config;
  async.waterfall([
    function (callback) {
      rimraf(pdfBookPath, function (err) {
        callback(err);
      });
    },
    function (callback) {
      var patterns = options.patterns ?
          options.patterns.split(',').map(function (p) { return p.replace(/^\s*/, '').replace(/\s*$/, ''); }) :
         [ '**/*.md' ];
      var inputPatterns = patterns.map(function (p) { return path.join(__cwd, config.output, 'mdx') + '/' + p; });
      var pdfCmdArgs = [
        'pandoc -N --template=' + path.join(__cwd, 'template.tex'),
        '--variable mainfont=\"Palatino\" --variable sansfont=\"Century Gothic\" --variable monofont=\"Consolas\" --variable fontsize=12pt',
        '--variable version=\'1.0.0\'',
        path.join(__cwd, 'book.txt'),
        inputPatterns.join(' '),
        '--latex-engine=xelatex --toc --toc-depth=5',
        '-o ' +  pdfBookPath
      ];
      var pdfCmdCommand = pdfCmdArgs.join(' ');
      callback(null, pdfCmdCommand);
    },
    function (pdfCmdCommand, callback) {
      exec(pdfCmdCommand, function (err, inerr, outerr) {
        callback(err);
      });
    },
    function (callback) {
      __blogger.log('Finished making the .pdf book.');
      callback(null);
    }
  ], function (err) {
    if (err) { return console.log(err); }
  });
};
