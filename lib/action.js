var program = require("commander");

var action = {
// add
// -------------
	/**
	* ##`add(options, callback)`
	*
	* ### Description ###
	*
	* Adds/creates tasks on the commander module/program.
	*
	* ### Parameters: ###
	* 1. __options__ : *object* The configuration object that contains the following:

	*   - name: *string* (required): The name of the task/action/keyword
	*   - arg: *string* The argument that refers to the the value that is immediately followed by the keyword/action.
	*   - params: *string* The argument that refers to the array of arguments followed by the `arg` argument.
	*   - description: *string* The action/task description.
	* 2. __callback__ : *function* The function that does the heavy lifting. This callback takes three parameters:
	*
	*   - [data]: the first parameter references the tasks/program object.
	*   - [arg]: the second parameter refers to the argument that is followed by the keyword/task name.
	*   - [params]: the third argument references the array of arguments passed after the `arg`.
	*
	* ### Usage ###
	*   You can use the add method to register tasks or commands with a keyword and a parameter. Then pass it a callback to do whatever you like to do.
	*
	* ### Examples ###
	*
	*   Example1: Creating/adding a command that prints "Salute [name]" given a string
	*
	*     var action = require("./action");
	*     action.add({name: "hello", arg: "name"}, function(d, name) {
	*     	console.log("Salute " + name);
	*     });
	*
	*     use: boiler hello person -> Salute person
	*
	*    Example 2: Create/add a command/action that prints a list of names, and name it helloall
	*
	*     var action = require("./action");
	*     action.add({name: "helloall", arg: "dummy", params: "names"}, function(d, what, nms) {
	*     nms.forEach(function(n) {
	*     	console.log("hello " + n);
	*     });
	*
	*     // note: we need the dummy placeholder for the correct parsing of the parameters. Limitation of the underlying module.
	*
	*     use: boiler helloall x n1 n2 n3 //-> hello n1 \n hello n2 \n hello n3
	*/

	add: function(options, callback) {
		var cmdString = options.name;
		if(options.arg) { cmdString += " <" + options.arg + ">"; }
		if(options.params)  { cmdString +=" ["+options.params+"...]"; }
		try {
			if(!options.name) {
				throw new Error("All Task/action definitions need to have a name. i.e. action.add({ name: 'taskname', .... })")
			} else {
				program
					.command(cmdString)
					.description(options.description)
					.action(function(arg, params) {
						callback(program, arg, params);
					});
			}
		} catch(e) {
			__blogger.error(e.stack);
		}
		return program;
	}
}

module.exports = action;
