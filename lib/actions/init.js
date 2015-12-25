var fs = require('fs-extra');
var path = require('path');
var ncp = require('ncp').ncp;
ncp.limit = 16;
var shell = require('../helpers/hdshell');
var initer = {
  run: function (options) {
    console.log(options.name);
    console.log('__CWD is: ', __cwd);
    console.log('dirname is: ', __dirname);
    console.log('Base is: ', __base);
    // action ...
    console.log('initing the project ...');
    var newPath = path.join(__cwd, options.name);
    fs.ensureDir(newPath, function (makeErr) {
      if (makeErr) { return console.log(makeErr);}
      // shell.run('touch ' + options.name + '/hello.txt');
      ncp(path.join(__base, 'scaffold'), path.join(__cwd, options.name), function (err) {
       if (err) {
         return console.error(err);
       }
       console.log('done!');
      });
    });
  }
};

module.exports = initer;
