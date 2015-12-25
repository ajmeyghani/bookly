var inquirer = require("inquirer");
var book = require('./book');
var path = require('path');

var builder = {
	build: function (options) {
    console.log('__CWD is: ', __cwd);
    console.log('dirname is: ', __dirname);
    console.log('Base is: ', __base);
    var formats = options.formats ? options.formats.split(',').map(function (format) { return format.replace(/^\s*/, '').replace(/\s*$/,''); }) : '';
    var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
    if (process.argv.length === 3) {
      book.build({config: config, isDefault: true});
    } else {
      if (options.isAll) {
        book.build({config: config, isAll: true});
      } else {
        if (options.isChaptersOnly) {
          book.build({config: config, isChaptersOnly: true});
        } else {
          // catch all other ...
          // book.build({isDefault: true, config: config})
          book.build({formats: formats, config: config })
        }
      }
    }
	}
};

module.exports = builder;
