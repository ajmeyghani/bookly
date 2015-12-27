var inquirer = require("inquirer");
var book = require('./book');
var path = require('path');
var mdx = require('./mdx');

/* TODO refactor the options */
var builder = {
	build: function (options) {
    var formats = options.formats ? options.formats.split(',').map(function (format) { return format.replace(/^\s*/, '').replace(/\s*$/,''); }) : '';
    var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
    options.config = config;
    options.formats = formats;
    book.build(options);
	},
  makeMdx: function (options) {
    var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
    var formats = options.formats ? options.formats.split(',').map(function (format) { return format.replace(/^\s*/, '').replace(/\s*$/,''); }) : '';
    options.config = config;
    options.formats = formats;
    mdx(options, function () {
      console.log('done');
    });
  }
};

module.exports = builder;
