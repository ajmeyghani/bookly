/* reads <output>/html/<input> for html only files excluding -content
and then converts the to pdf and output to
<output>/pdf/<input>/.../....pdf */

/*
 * read md files, create -content.html and .html files
*/
var fs = require('fs-extra');
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var through2 = require('through2')
var rimraf = require('rimraf');
var klaw = require('klaw');
var ncp = require('ncp').ncp;
ncp.limit = 16;

module.exports = function (options) {
  var config = options.config;
  var outputpath = config.output;
  var inputFolder = path.join(__cwd, config.output, 'html');

  var readHtmlFiles = function (done) {
    var files = []
    var excludeDirFilter = through2.obj(function (item, enc, next) {
      var fileSplit = item.path.split('/');
      var filename = fileSplit.pop();
      var folderMatch = 'html/(.*)';
      if (!item.stats.isDirectory() && !/^\./.test(filename) && filename.search('-content') === -1 && /\.htm$|\.html$/.test(filename) && !/public/.test(item.path))  {
        var joinedFolder = fileSplit.join('/');
        if (joinedFolder.match(folderMatch)) {
          var theFolderPath = path.join(joinedFolder.match(folderMatch)[1]);
        } else {
          var theFolderPath = '';
        }
        this.push({ path: item.path, name: filename, folder: theFolderPath});
      }
      next();
    });
    klaw(inputFolder).pipe(excludeDirFilter).on('data', function (item) { files.push(item); })
        .on('end', function () { done(files); });
  };
  readHtmlFiles(function (files) {
    // console.log(files);
    rimraf(path.join(__cwd, config.output, 'pdf'), function (err) {
      if (err) { return console.log(err);}
      files.forEach(function (file) {
        var pdfOutputPath = path.join(__cwd, outputpath, 'pdf', file.folder, file.name.replace('.html', '.pdf'));
        var phantomArgs = ['phantomjs', path.join(__base, 'lib/actions/render.js'), file.path, pdfOutputPath];
        exec(phantomArgs.join(' '), function (err, sterr, stoerr) {
          if (err) { return console.log(err);}
        });
      });
    });
  });
};
