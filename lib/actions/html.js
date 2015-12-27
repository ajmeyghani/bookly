var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
module.exports = function (options, htmlBookPath) {
  var config = options.config;
  var patterns = options.patterns ?
      options.patterns.split(',').map(function (p) { return p.replace(/^\s*/, '').replace(/\s*$/, ''); }) :
     [ '**/*.md' ];
  async.waterfall([
    function (callback) { rimraf(htmlBookPath, function (remErr) { callback(remErr); }); },
    function (callback) {
      var inputPatterns = patterns.map(function (p) { return path.join(__cwd, config.input) + '/' + p; });
      var htmlBookArgs = [
        'pandoc',
        path.join(__cwd, 'book.txt'),
        inputPatterns.join(' '),
        '-s -o',
        path.join(__cwd, config.output) + '/' + config.name + '.html',
        '--toc --toc-depth=5',
        '--template=' + path.join(__cwd, 'template.html'),
        '--section-divs'
      ];

      var htmlBookCmd = htmlBookArgs.join(' ');
      callback(null, htmlBookCmd);
    },
    function (htmlBookCmd, callback) { exec(htmlBookCmd, function (err, stinerr, stouerr) { callback(err); }); },
    function (callback) {
      fs.readFile(htmlBookPath, 'utf-8', function (readErr, bookContent) {
        if (readErr) { return console.log(readErr); }
        var hjsContent = bookContent.replace(/<pre class="typescript"><code>/g, '<pre class="typescript brush:ts">')
        .replace(/<\/code><\/pre>/g, '</pre>');
        callback(readErr, hjsContent);
      });
    },
    function (hjsContent, callback) {
      fs.writeFile(htmlBookPath, hjsContent, function (writeErr) {
        if (writeErr) {return console.log(writeErr);}
        __blogger.log('Finished making the .html book.');
        callback(writeErr, 'done');
      });
    }
  ], function (err) {
    if (err) { return console.log(err);}
  });
};
