var chapters = require('./chapters');
var ph = require('./ph');
module.exports = (function () {
  var buildBook = function (options) {
    if (options.isDefault || options.isChaptersOnly) {
      __blogger.info('Building the chapters in html');
      chapters(options);
    } else if (options.isRender) {
      __blogger.info('Rendering the html outputs to pdf');
      ph(options);
    } else if (options.isAll) {
      __blogger.info('building the book in all formats');
    } else if (options.formats[0]) {
      //   if ( options.formats.indexOf('html') !== -1 ) {
      //     console.log('building the book in html format');
      //   }
      //   if ( options.formats.indexOf('pdf') !== -1 ) {
      //     console.log('building the book in pdf format');
      //   }
      //   if ( options.formats.indexOf('epub') !== -1 ) {
      //     console.log('building the book in epub format');
      //   }
      //   if ( options.formats.indexOf('mobi') !== -1 ) {
      //     console.log('building the book in mobi format');
      //   }
      __blogger.info('building the book in ' + options.formats.join(', ') + ' format(s)');
    } else {
      __blogger.warn('Option not valid');
    }
  };
  return {
    build: buildBook
  };
})();
