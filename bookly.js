#!/usr/bin/env node
GLOBAL.__base = require('path').dirname(require.main.filename) + "/";
GLOBAL.__cwd = process.cwd() + "/";

/* Utilities */
GLOBAL.__blogger = require('./lib/helpers/blogger');

/* core */
var app = require('./lib/config');
var fs = require('fs-extra');
var program = require('commander');
var action = require('./lib/action');

/* Commands */
var init = require('./lib/actions/init');
var builder = require("./lib/actions/builder");
var concat = require("./lib/actions/concat");

/* global settings */
var global = { keyword: process.argv[2] };

/* program */
program
	.version(app.version)
	.usage("<command> [options]")
	.option("-f, --formats <formats>", "File format to convert to: `pdf, epub, html, mobi, md`")
	.option("-c, --config <config file>", "The config file containing book name, input and output paths")
  .option("-a, --all-formats", "If present, it will build the book in all formats")
  .option("-e, --chapters-only", "If you only want to build each chapter (pdf and html)")
  .option("-r, --render", "Can be executed after build -e. Converts each chapter to pdf with phantomjs")
  .option("-p, --patterns <patterns>", "Input patterns to use: eg. '**/*.markdown, **/**/*.md'")
  .option("-n, --version-number <versionnumber>", "Specifies a version for the book")
  .option("-m, --manuscript <folder name>", "Folder name for the manuscript")
	// .on("--help", function(){ __blogger.printHelp() }) // for custom help

action.add(
	{
		name: "build",
		// arg: "format",
		description: "Create the book in different formats"
	},
	function(prompt, converTo) {
		builder.build({
      formats: prompt.formats,
      config: prompt.config,
      isRender: prompt.render,
      isChaptersOnly: prompt.chaptersOnly,
      patterns: prompt.patterns ,
      isAll: prompt.allFormats,
      version: prompt.versionNumber
    });
});

action.add(
  {
    name: "new",
    arg: "name",
    description: "Start a new project"
  },
  function(prompt, projectName) {
    init.run({name: projectName});
});

action.add(
  {
    name: "concat",
    // arg: "name",
    description: "Concats files in each chapter folder into one"
  },
  function(prompt, projectName) {
    concat({
      config: prompt.config,
      patterns: prompt.patterns,
      manuscript: prompt.manuscript
    });
});

action.add(
	{
		name: "help",
		description: "Provides overview of the options and actions/keywords"
	},
	function(bookly) {
		bookly.help();
});

action.add(
	{
		name: "docs",
		description: "Prints the docs to the console with examples."
	},
	function(data) {
		__blogger.printHelp();
});

action.add(
	{
		name: "docsfor",
		arg: "command_name",
		description: "Print the help for a given action or command: eg: bookly docsfor build"
	},
	function(data, what) {
		__blogger.docsFor(what);
});

/* catch invalid commands */
action.add(
	{
		name: "*",
		description: "Catch invalid tasks"
	},
	function(data){
		__blogger.warn("Comand Doesn't exist");
		__blogger.info("See the available options and tasks below:");
		program.help();
});

/* read args */
program.parse(process.argv);

/* if no args, show help */
if(!global.keyword) { program.help(); }
