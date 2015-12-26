#!/usr/bin/env node
GLOBAL.__base = require('path').dirname(require.main.filename) + "/";
GLOBAL.__cwd = process.cwd() + "/";
GLOBAL.__brErrors = [];
GLOBAL.__brMsg = [];

/* Utilities */
GLOBAL.__blogger = require('./lib/helpers/blogger');

/* core */
var app = require('./lib/config');
var fs = require('fs-extra');
var program = require('commander');
var inquirer = require('inquirer');
var action = require('./lib/action');

/* Commands */
var server = require("./lib/actions/builder");
var scaffold = require("./lib/actions/scaffold");
var init = require('./lib/actions/init');
// var custom = require(__base + "actions/custom");

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
	// .on("--help", function(){ __blogger.printHelp() }) // for custom help

action.add(
	{
		name: "build",
		// arg: "format",
		description: "Create the book in different formats"
	},
	function(prompt, converTo) {
		server.build({
      formats: prompt.formats,
      config: prompt.config,
      isChaptersOnly: prompt.chaptersOnly,
      isAll: prompt.allFormats
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


/* example with prompt */
// -------------
	/**
	* ##`bookly custom -k <custom thing> -s <settings-file>`
	*
	* ### Parameters: ###
	*
	* 1. __k__ : *string* (required) a custom thing. Could be the name of an action.
	* 2. __s__ : *string* The path to the settings.json file that has the options.
  *
	*/
// action.add(
// 	{
// 		name: "custom",
// 		description: "Test task without prompt. -k: task name, -s: path to settings.json"
// 	},
// 	function(data) {
// 		custom.runNoPrompt({kind: data.kind, settings: data.settings, prompt: data});
// });

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

/* booly b inputfolder format1, format2 */
action.add(
	{
		name: "b",
		arg:"input folder",
		params: "configs",
		description: "Shortcut for the build command"
	},
	function(data, t, ops) {
		scaffold.run(t, ops, {flag1: "flag1 value", flag2: "flag2 value"});
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
