var inquirer = require("inquirer");
var html = require('./html');
var path = require('path');

var builder = {
	build: function (options) {
    // console.log(options.config, options.format.trim().split(','), options.input);
    console.log('__CWD is: ', __cwd);
    console.log('dirname is: ', __dirname);
    console.log('Base is: ', __base);
    var formats = options.formats ? options.formats.split(',').map(function (format) { return format.replace(/^\s*/, '').replace(/\s*$/,''); }) : '';
    var inputFolder = options.input;
    var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
    console.log(options);
    console.log(config);
    if (options.isAll) {
      console.log('converting all ....');
      // book.build({config: config, isAll: true});
    } else {
      if (options.isChaptersOnly) {
        console.log('converting only chapters to pdf and html');
        // html({config: options.config, formats: formats, input: inputFolder}); // this will go inside the book buildChapters method.
        // book.build({config: config, isChaptersOnly: true});
      } else {
        // book.build({formats: formats, config: config })
        if ( formats.indexOf('html') !== -1 ) {
          console.log('building the book in html format');
        }
        if ( formats.indexOf('pdf') !== -1 ) {
          console.log('building the book in pdf format');
        }
        if ( formats.indexOf('epub') !== -1 ) {
          console.log('building the book in epub format');
        }
        if ( formats.indexOf('mobi') !== -1 ) {
          console.log('building the book in mobi format');
        }
      }
    }


		// action ...
	}
};

module.exports = builder;
