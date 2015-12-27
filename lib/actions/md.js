var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
module.exports = function (options, mdBookPath) {
  var config = options.config;
  async.waterfall([
    function (callback) {
      rimraf(mdBookPath, function (err) {
        callback(err);
      });
    },
    function (callback) {
      var patterns = options.patterns ?
          options.patterns.split(',').map(function (p) { return p.replace(/^\s*/, '').replace(/\s*$/, ''); }) :
         [ '**/*.md' ];
      var inputPatterns = patterns.map(function (p) { return path.join(__cwd, config.input) + '/' + p; });
      var mdCmdArgs = [
        'pandoc',
        path.join(__cwd, 'book.txt'),
        inputPatterns.join(' '),
        '-o',
        path.join(config.output, config.name + '.md')
      ];
      var mdCmdCommand = mdCmdArgs.join(' ');
      callback(null, mdCmdCommand);
    },
    function (mdCmdCommand, callback) {
      exec(mdCmdCommand, function (err, inerr, outerr) {
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
