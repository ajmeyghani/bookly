var chapters = require('./chapters');
var ph = require('./ph');
var mdx = require('./mdx');
var pdf = require('./pdf');
var html = require('./html');
var epub = require('./epub');
var path = require('path');
var md = require('./md');
var exec = require('child_process').exec;
module.exports = (function () {
  var buildBook = function (options) {
    var config = options.config;
    var htmlBookPath = path.join(__cwd, config.output, config.name + '.html');
    var pdfBookPath = path.join(__cwd, config.output, config.name + '.pdf');
    var epubBookPath = path.join(__cwd, config.output, config.name + '.epub');
    var mdBookPath = path.join(__cwd, config.output, config.name + '.md');
    var mobiBookPath = path.join(config.name + '.mobi');

    var mobi = function (options, mobiBookPath) {
      var mobiArgs = [
        'kindlegen',
        path.join(__cwd, config.output, config.name + '.epub'),
        '-c0 -o',
        mobiBookPath
      ];
      var mobiCmCommand = mobiArgs.join(' ');
      exec(mobiCmCommand, function (err, inerr, outerr) {
        if (err) { console.log(err, inerr, outerr); }
        else { __blogger.log('Finished making the .mobi book.'); }
      });
    };

    if (options.isDefault || options.isChaptersOnly) {
      console.log('Building the chapters in html');
      chapters(options);
    } else if (options.isRender) {
      console.log('Rendering the html outputs to pdf');
      ph(options);
    } else if (options.isAll) {
      console.log('building the book in all formats');
      chapters(options);
      mdx(options, function () {
        epub(options, epubBookPath, function () {
          mobi(options, mobiBookPath);
        });
        pdf(options, pdfBookPath);
        html(options, htmlBookPath);
        md(options, mdBookPath);
      });
    } else if (options.formats[0]) {
      mdx(options, function () {
        if ( options.formats.indexOf('html') !== -1 ) {
          console.log('building the book in html format');
          html(options, htmlBookPath);
        }
        if ( options.formats.indexOf('pdf') !== -1 ) {
          console.log('building the book in pdf format');
          pdf(options, pdfBookPath);
        }
        if ( options.formats.indexOf('epub') !== -1 ) {
          console.log('building the book in epub format');
          epub(options, epubBookPath);
        }
        if ( options.formats.indexOf('md') !== -1 ) {
          console.log('building the book in me format');
          md(options, mdBookPath);
        }
        if ( options.formats.indexOf('mobi') !== -1 ) {
          epub(options, epubBookPath, function () {
            mobi(options, mobiBookPath);
          });
        }
      });

      __blogger.info('building the book in ' + options.formats.join(', ') + ' format(s)');
    } else {
      __blogger.warn('Option not valid');
    }
  };
  return {
    build: buildBook
  };
})();
