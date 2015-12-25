var html = require('./html');
module.exports = (function () {
  var buildBook = function (options) {
    if (options.isDefault) {
      __blogger.info('Building the book with default configuration');
      html(options);
    } else if (options.isAll) {
      __blogger.info('building the book in all formats');
    } else if (options.isChaptersOnly) {
      __blogger.info('building the chapters only');
    } else if (options.formats[0]) {
      __blogger.info('building the book in ' + options.formats.join(', ') + ' format(s)');
    }
    // if (options.isChaptersOnly) {
    //   html(options);
    //   // pdfChapters(options);
    // }

    // if (options.formats) {
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
    // }
  };
  return {
    build: buildBook
  };
})();
