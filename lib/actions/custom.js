var jf = require("jsonfile");
var inquirer = require("inquirer");
var action = {
	run: function(options) {
		var question = {
			type: "list",
			name: "kind",
			message: "What kind of custom thing do you need to do ?",
			choices: [ "bake", "cook"],
			filter: function( val ) { return val.toLowerCase(); }
		};
		inquirer.prompt( question, function( answers ) {

			if(answers.kind === "bake") {
				var questions = [
					{
						type: "input",
						name: "baseUrl",
						message: "What is the base url? eg: http://coolwebsite.com or http://local.website.com:8888",
						validate: function( value ) {
							var isValid = value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/);  // url to allow port number at the end
							return isValid ? true : "Not a valid URL :(";
						}
					},
					{
						type: "input",
						name: "urls",
						message: "Enter ending path names separated by commas: eg: about.htm, contact.htm",
						filter: function lowcase (val) { return val.toLowerCase(); }
					},
					{
						type: "input",
						name: "viewports",
						message: "Enter viewport values separated by commas: eg: 800, 1200, 300",
						validate: function (value) {
							return !value.match(/[^0-9, ]+/) ? true : "Only use commas and numbers"
						},
						filter: function toNum (val) {
							var values = val.replace(/\s+/g, "").split(',');
							var viewports = values.map(function (v) {
									return +v;
							});
							return viewports;
						}
					}
				];

				inquirer.prompt( questions, function startBaking (answers) {
					var settings = {
						pages: answers.urls.replace(/\s+/g, "").split(','),
						baseUrl: answers.baseUrl.replace(/\/+$/g, ''),
						urls: [],
						viewports: answers.viewports
					};

					settings.pages.forEach(function makeUrl (page) {
						settings.urls.push(settings.baseUrl + "/" + page);
					});

					__blogger.info(settings.url + "  " + settings.viewports);

				});
			} else if(answers.kind === "cook") {
				var bQs = [
					{
						type: "input",
						name: "baseUrl",
						message: "What is the base url? eg: http://coolwebsite.com or http://local.website.com:8888",
						validate: function( value ) {
							var isValid = value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/);  // url to allow port number at the end
							return isValid ? true : "Not a valid URL :(";
						}
					},
					{
						type: "input",
						name: "urls",
						message: "Enter ending path names separated by commas: eg: about.htm, contact.htm",
						filter: function lowcase (val) { return val.toLowerCase(); }
					},
					{
						type: "confirm",
						name: "isLocal",
						message: "Are you testing with a local server?"
					}
				];

				inquirer.prompt( bQs, function startCooking(answers) {
					var settings = {
						pages: answers.urls.replace(/\s+/g, "").split(','),
						baseUrl: answers.baseUrl.replace(/\/+$/g, ''),
						viewport: answers.viewport,
						browsers: answers.browsers,
						isLocalTesting: answers.isLocal
					};

					__blogger.info("Start cooking ...");
					if(answers.local){
						__blogger.warn("Make sure you run `the local task` if you want to test locally.");
					}
					__blogger.info(settings);

				});
			} else {
				__blogger.info("option does not exist");
			}
		});
	},
	runNoPrompt: function (options) {
		if (!(options.kind && options.settings)) {
			__blogger.warn("no options were found or you are missing an option !");
			__blogger.log("Try: boiler custom -k cook -s path/to/jsonsettings.json");
			__blogger.info("Here is an example for the json file:");
			__blogger.info(
				""+
				"{"+
						"\"baseUrl\" : \"http://google.local.com\"," +
						"\"paths\": [\"page1.php\", \"page2.php\"]," +
						"\"viewports\" : [300, 500, 1280]"+
				"}"+
				""
			);
			options.prompt.help();
		}

		if (options.kind === "responsive" || options.kind === "r") {
			var file = process.cwd()+"/"+options.settings;
			jf.readFile(file, function(err, data) {

				var settings = {
					paths: data.paths,
					viewports: data.viewports,
					baseUrl: data.baseUrl.replace(/\/+$/g, ''),
					urls: []
				};
				settings.paths.forEach(function read (path) {
					settings.urls.push(settings.baseUrl + "/" + path.replace(/\/+$/g, ''));
				});

				__blogger.info("Generating screenshots ...");
				snap.run({urls: settings.urls, viewports: settings.viewports});
			});
		} else if( options.kind === "cross_browser" || options.kind === "c") {
			__blogger.info("cross browser testing coming soon ...");
		} else {
			__blogger.info("Option not available...");
		}
	}
};

module.exports = action;
