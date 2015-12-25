// --------------
/*
	- Description: Helper for running shell commands.

	## Params
	- commands: array of commands or a string of commands:
	- callback: function to run after the commands have been executed.

	## Usage:
	first require the module and then commands given an array:

		var shell = require("hdshell");
		shell.run(["command", "command"]);

	## Examples

		shell.run("mkdir foldername && cd $_ && echo done")
		shell.run(["mkdir p", "cd p"]);

*/
// --------------
var exec = require('child_process').exec; // for running shell commands.
var shell = {
	run: function (commands, callback) {
    var command = (typeof commands !== "string") ? commands.join(' && ') : commands;
		exec(command, function (error, stdout, stderr) {
			if(callback) {callback();}
		});
	}
};

module.exports = shell;
