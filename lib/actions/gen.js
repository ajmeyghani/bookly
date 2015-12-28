var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
module.exports = function (opts, whenDone) {
  var options = opts.settings;
  var config = options.config;
  var extension = opts.extension;
  var extBookPath = opts.extBookPath;
  var isMdx = opts.isMdx;
  function commands (ext, inPatterns) {
    var bookTxtPath = path.join(__cwd, 'book.txt');
    var allCmdArgs = {
      epub: [
        'pandoc -S -o',
        extBookPath,
        bookTxtPath,
        inPatterns.join(' '),
        '--highlight-style haddock',
        '--epub-cover-image=' + path.join(__cwd, 'cover.png'),
        '--epub-stylesheet=' + path.join(__cwd, 'book.epub.css'),
        '--toc-depth=5'
        ],
      pdf: [
        'pandoc -N --template=' + path.join(__cwd, 'template.tex'),
        '--highlight-style haddock',
        '--variable mainfont=\"Palatino\" --variable sansfont=\"Century Gothic\" --variable monofont=\"Consolas\" --variable fontsize=12pt',
        '--variable version=' + (options.version || ' '),
        bookTxtPath,
        inPatterns.join(' '),
        '--latex-engine=xelatex --toc --toc-depth=5',
        '-o ' +  extBookPath
        ],
      html: [
        'pandoc',
        bookTxtPath,
        inPatterns.join(' '),
        '-s -o',
        extBookPath,
        '--toc --toc-depth=5',
        '--template=' + path.join(__cwd, 'template.html'),
        '--section-divs'
      ],
      md: [
        'pandoc',
        bookTxtPath,
        inPatterns.join(' '),
        '-o',
        extBookPath
      ],
      docx: [
        'pandoc',
        bookTxtPath,
        inPatterns.join(' '),
        '--highlight-style=haddock',
        '-o',
        extBookPath,
        '--reference-docx=' + path.join(__cwd, 'template.docx'),
        '--toc'
      ],
      tex: [
        'pandoc -N --template=' + path.join(__cwd, 'template.tex'),
        '--highlight-style haddock',
        '--variable mainfont=\"Palatino\" --variable sansfont=\"Century Gothic\" --variable monofont=\"Consolas\" --variable fontsize=12pt',
        '--variable version=' + (options.version || ' '),
        bookTxtPath,
        inPatterns.join(' '),
        '--latex-engine=xelatex --toc --toc-depth=5',
        '-o ' +  extBookPath
      ]
    };
    return allCmdArgs[ext];
  };
  var patterns = options.patterns ?
      options.patterns.split(',').map(function (p) { return p.replace(/^\s*/, '').replace(/\s*$/, ''); }) :
     [ '**/*.md' ];
  async.waterfall([
    function (callback) { rimraf(extBookPath, function (remErr) { callback(remErr); }); },
    function (callback) {
      var inputPatterns = patterns.map(function (p) { return path.join(__cwd, isMdx ? (config.output + '/mdx') : (config.input)) + '/' + p; });
      var extBookArgs = commands(extension, inputPatterns);
      var extBookCommand = extBookArgs.join(' ');
      callback(null, extBookCommand);
    },
    function (extBookCommand, callback) { exec(extBookCommand, function (err, stinerr, stouerr) { callback(err); }); },
    function (callback) {
      __blogger.log('Finished making the ' + extension + ' book.');
      callback(null);
    }
  ], function (err) {
    if (err) { return console.log(err);} else {
      if (whenDone) { whenDone(); }
    }
  });
};
