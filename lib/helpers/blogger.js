var chalk = require('chalk');
var log = require('chip')();
var colors = require('colors');
var fs = require("fs");
var path = require("path");

var help = {
	printHelp: function () {
    console.log('  Description:\n'.inverse.green);
    console.log('    Bookly uses pandoc behind the scenes to create books from markdown files. \n'+
                     '    It makes writing books fun! \n');

		console.log('  Commands:\n'.inverse.green);
		console.log('    build:'.white, 'Creates the book from input markdown files to a given format(s) \n'+
										 '    new:'.white, 'Starts the project, with the necessary files and folders \n' +
										 '    else:'.white, 'not implemented yet \n');

		console.log('  Examples:\n'.inverse.green);

		console.log('    build to pdf:', 'bookly build --to pdf --config config.js\n'.white);

    console.log('    build to different formats:', 'bookly build --to \'pdf, epub, html\'\n'.white);
	},
	docsFor: function(file){
		var filePath = "./lib/docs/" + file + ".md";

		fs.readFile(filePath, "utf-8", function(err, data){
			if ( err ) {throw new Error(); console.log(err)}
			console.log(data);
		});
	},
	/* helpers */
	log:   function (msg) { log.info(chalk.green(msg))},
	info:  function (msg) { log.debug(chalk.magenta(msg))},
	warn:  function (msg) { log.warn(chalk.yellow(msg))},
	error: function (msg) { log.error(chalk.red(msg))}
};

module.exports = help;
