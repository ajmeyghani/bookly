var inquirer = require("inquirer");

var builder = {
	build: function (options) {
    console.log(options.config, options.format);
    console.log('__CWD is: ', __cwd);
    console.log('dirname is: ', __dirname);
    console.log('Base is: ', __base);
		// action ...
	}
};

module.exports = builder;
