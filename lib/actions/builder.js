var book = require('./book');
var path = require('path');

var builder = {
	build: function (options) {
    var formats = options.formats ? options.formats.split(',').map(function (format) { return format.replace(/^\s*/, '').replace(/\s*$/,''); }) : '';
    var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
    options.config = config;
    options.formats = formats;
    book.build(options);
	}
};

module.exports = builder;
