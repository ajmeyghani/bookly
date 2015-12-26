/* read input from <input> and generate fenced code blocks at
<output>/mdx
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
  var inputFolder = path.join(__cwd, config.input);

  var readMdFiles = function (done) {
    var files = []
    var folderRegex = new RegExp(config.input + '.*');
    var excludeDirFilter = through2.obj(function (item, enc, next) {
      var fileSplit = item.path.split('/');
      var filename = fileSplit.pop();
      if (!item.stats.isDirectory() && !/^\./.test(filename) && filename.search('-content') === -1) {
        this.push({ path: item.path, name: filename, folder: fileSplit.join('/').match(folderRegex)[0] });
      }
      next();
    });
    klaw(inputFolder).pipe(excludeDirFilter).on('data', function (item) { files.push(item); })
        .on('end', function () { done(files); });
  };

  rimraf(path.join(__cwd, config.output, 'mdx'), function (rerr) {
    readMdFiles(function (files) {
      var language = {
        from: 'typescript',
        to: 'java'
      };
      var toFencedBlock = '~~~~ {.numberLines .' + language.to + ' language=' + language.to + ' startFrom="1"}';
      var regex = {
        from: new RegExp('```' + language.from, 'g')
      };

      var doWork = function(index) {
          if ( index === files.length ) {
            /* mdx has been made, now we can create the other formats */
              var htmlBookPath = path.join(__cwd, config.output, config.name + '.html');
              async.waterfall([
                function (callback) { rimraf(htmlBookPath, function (remErr) { callback(remErr); }); },
                function (callback) {
                  var htmlBookArgs = [
                    'pandoc',
                    path.join(__cwd, 'book.txt'),
                    path.join(__cwd, config.input) + '/**/*.md',
                    '-s -o',
                    path.join(__cwd, config.output) + '/' + config.name + '.html',
                    '--toc --toc-depth=5',
                    '--template=' + path.join(__cwd, 'template.html'),
                    '--section-divs'
                  ];
                  var htmlBookCmd = htmlBookArgs.join(' ');
                  callback(null, htmlBookCmd);
                },
                function (htmlBookCmd, callback) { exec(htmlBookCmd, function (err, stinerr, stouerr) { callback(err); }); },
                function (callback) {
                  fs.readFile(htmlBookPath, 'utf-8', function (readErr, bookContent) {
                    if (readErr) { return console.log(readErr); }
                    var hjsContent = bookContent.replace(/<pre class="typescript"><code>/g, '<pre class="typescript brush:ts">')
                    .replace(/<\/code><\/pre>/g, '</pre>');
                    callback(readErr, hjsContent);
                  });
                },
                function (hjsContent, callback) {
                  fs.writeFile(htmlBookPath, hjsContent, function (writeErr) {
                    if (writeErr) {return console.log(writeErr);}
                    __blogger.log('Finished making the html book.');
                    callback(writeErr, 'done');
                  });
                }
              ], function (err) {
                if (err) { return console.log(err);}
              });
          } else {
            var file = files[index];
            var filePaths = file.path.replace(inputFolder, config.output + '/mdx').split('/');
            var filename = filePaths[filePaths.length - 1];
            var outputPathDirs = filePaths.slice(0, filePaths.length - 1).join('/');
            var filePathToWrite = path.join(outputPathDirs, filename);
            if (rerr) { return console.log(rerr);}
            fs.readFile(file.path, 'utf-8', function (err, data) {
              if (err) {return console.log(err);}
              data = data.replace(regex.from, toFencedBlock)
              .replace(/```/g, '~~~~~~~~~');
              fs.ensureDir(outputPathDirs, function (enErr) {
                if (enErr) { return console.log(enErr);}
                fs.writeFile(filePathToWrite, data, function (writeErr) {
                  if (writeErr) { return console.log(writeErr); }
                  doWork(index + 1);
                });
              });
            });
          }
      };
      doWork(0);
    });

  });
};
