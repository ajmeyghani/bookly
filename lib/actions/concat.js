/*
* Concat so that we can splitup each chapter into files.
* Concat each chapters folder and spit a single file for each chapter folder.
* and output to <chaptername>/manuscript
* Optional: create a file called manuscript/book.txt that lists the content of manuscript.
*/
var fs = require('fs-extra');
var path = require('path');
var through2 = require('through2')
var rimraf = require('rimraf');
var klaw = require('klaw');
var concat = require('concat-files');

module.exports = function (options, done) {
  var config = (options.config) ? require(path.join(__cwd, options.config)) : require(path.join(__cwd, 'config.js'));
  options.config = config;
  var outputpath = config.output;
  var inputFolder = path.join(__cwd, config.input);

  var readMdFiles = function (done) {
    var files = []
    var folderRegex = new RegExp(config.input + '/(.*)');
    var excludeDirFilter = through2.obj(function (item, enc, next) {
      var fileSplit = item.path.split('/');
      var filename = fileSplit.pop();
      if (!item.stats.isDirectory() && !/^\./.test(filename) && filename.search('-content') === -1 && /\.md$|\.markdown$/.test(filename))  {
        this.push({ path: item.path, name: filename, folder: fileSplit.join('/').match(folderRegex)[1] });
      }
      next();
    });
    klaw(inputFolder).pipe(excludeDirFilter).on('data', function (item) { files.push(item); })
        .on('end', function () { done(files); });
  };

  readMdFiles(function (files) {
    var chapters = {};
    files.forEach(function (file) {
      // chapters.path = file.path;
      if (!chapters[file.folder]) {
        chapters[file.folder] = [file.name];
      } else {
        chapters[file.folder].push(file.name);
      }
    });
    // console.log(chapters);
    var concatPaths = [];
    Object.keys(chapters).forEach(function (key) {
      var args = chapters[key].join(' ');
      concatPaths.push({
        path: key,
        args: args
      });
    });
    concatPaths.forEach(function (p, idx) {
      var isLastFile = concatPaths.length - 1 === idx;
      var filename = p.path.split('/').pop(); /* naming the file after the folder */
      var extension = p.args.split(' ')[0].match(/.*(\..*)/)[1];
      var manuscriptFolder = path.join(options.manuscript ? options.manuscript : 'manuscript');
      var concatOutPathFile = path.join(__cwd, config.output, manuscriptFolder, p.path, filename + extension);
      var outPathFolder = path.join(__cwd, config.output, manuscriptFolder, p.path);
      var inputfiles = p.args.split(' ')
                      .map(function (arg) { return path.join(config.input, p.path, arg); });
      var argsplit = p.args.split(' ');
      rimraf(path.join(__cwd, manuscriptFolder), function (emErr) {
        if (emErr) { return console.log(emErr);}
        fs.ensureDir(outPathFolder, function (err) {
          if (err) { return console.log(err);}
          concat(inputfiles, concatOutPathFile, function(concErr) {
            if (concErr) { return console.log(concErr);}
            if (isLastFile) {
              __blogger.log('Finished concatenating chapters');
            }
          });
        });
      });
    });
  });
};
