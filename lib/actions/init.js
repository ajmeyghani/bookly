var fs = require('fs-extra');
var path = require('path');
var ncp = require('ncp').ncp;
ncp.limit = 16;

var initer = {
  run: function (options) {
    var newPath = path.join(__cwd, options.name);
    fs.ensureDir(newPath, function (makeErr) {
      if (makeErr) { return console.log(makeErr);}
      ncp(path.join(__base, 'scaffold'), path.join(__cwd, options.name), function (err) {
       if (err) {
         return console.error(err);
       }
       __blogger.log('Done!')
       __blogger.info('Now you can `cd ' + options.name + '`');
      });
    });
  }
};

module.exports = initer;
