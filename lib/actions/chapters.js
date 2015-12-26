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
  var inputFolder = path.join(__cwd, config.input);
  var outputPathForHtml = path.join(__cwd, config.output, 'html');

  /* remove output/html, then make output/html again */
  var setup = function (done) {
    async.waterfall([
      function (callback) { rimraf(outputPathForHtml, callback);},
      function (callback) { fs.ensureDir(outputPathForHtml, callback); },
      function (path, callback) { __blogger.log('Set up completed'); callback(null, path); }
    ], done);
  };

  /* Can contain multiple branches
     * for now, there are only two branches that are going
     * to run in parallel:
     *  - the first one is copying the public folder to output/html/public
     *  - reading input from md files and writing the html content in output/html
  */
  var mainProcess = function (done) {
    async.parallel([
      function(callback) { ncp(path.join(__cwd, 'public'), path.join(outputPathForHtml, 'public'), callback); },
      function(callback) { readAndWrite(callback); }
    ],
    function(err, results) {
      if (err) { console.log(err);}
      else { done(); }
    });
  };

  /* reads the md input files and filters out directories and hidden files */
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

  /* does the heavy lifting:
   * - read md file
   * - get the title
   * - convert the md file to html with pandoc
   * - Run the syntax for ts
   * - wrap the html fragment with main.html
   * - write to output/html
  */
  var processEachFile = function (file, outPath, mainHtml, done) {
    async.waterfall([
    function(callback) {
      fs.readFile(file.path, 'utf8', callback);
    },
    function (mdContent, callback) {
      var pageTitleRegx = new RegExp('[\s\S]*#\s*(.*)');
      var pageTitle = (mdContent.match(pageTitleRegx)) ? mdContent.match(pageTitleRegx)[1].trim() : '';
      callback(null, pageTitle);
    },
    function (pageTitle, callback) {
      var newPath = path.join(outPath, file.folder);
      fs.ensureDir(newPath, function (err) {
        callback(err, pageTitle);
      });
    },
    function (pageTitle, callback) {
      var newPath = path.join(outPath, file.folder, file.name.replace('.md', '-content.html'));
      exec('pandoc ' + file.path + ' -t html -o ' + newPath, {}, function (error, stdout, stderr) {
        callback(error, {newPath: newPath, pageTitle: pageTitle});
      });
    },
    function (data, callback) {
      fs.readFile(data.newPath, 'utf8', function (err, htmlFragment) {
        callback(err, {fragment: htmlFragment, pageTitle: data.pageTitle, newPath: data.newPath });
      });
    },
    function (data, callback) {
      var standaloneContent = mainHtml.replace(/@title/, data.pageTitle).replace(/@content/, data.fragment);
      var inputPathRegex = new RegExp(config.input.replace(/[/\\]/, '') + '/(.*)');
      var nestCount = data.newPath.match(inputPathRegex)[1].split('/').length;
      var newPublicPath = function () {
        var publicPath = '';
        if (nestCount === 1) { publicPath += './'; }
        else { for (var i = 0; i < nestCount; i++ ) { publicPath += '../'; } }
        publicPath = publicPath + 'public/';
        return publicPath;
      };
      standaloneContent = standaloneContent.replace(/public\//g, newPublicPath())
                        .replace(/<pre class="typescript"><code>/g, '<pre class="typescript brush:ts">')
                        .replace(/<\/code><\/pre>/g, '</pre>');
      fs.outputFile(data.newPath.replace('-content.html', '.html'), standaloneContent, function (err) {
        callback(err, data);
      });
    },
    function (data, callback) { callback(null, 'ne'); }
    ], done);
  };

  /* reads the main.html once and keeps a reference.
     then it processes each md file
  */
  var readAndWrite = function (done) {
    async.waterfall([
      function (callback) {
        var mainFile = path.join(__cwd, 'main.html');
        fs.readFile(mainFile, 'utf8', function (err, mainHtml) { callback(err, mainHtml); });
      },
      function(mainHtml, callback) {
        readMdFiles(function (files) { callback(null, files, mainHtml); });
      },
      function (files, mainHtml, callback) {
        __blogger.info('Processing files ....');
        async.each(files, function(file, callback) {
          processEachFile(file, outputPathForHtml, mainHtml, callback);
        }, function(err) {
          if( err ) { console.log('A file failed to process', err); }
          else {
            __blogger.log('All files have been processed successfully');
            callback(null, 'going to the next step of the overall branches');
          }
        });
      },
    ], function (err) {
      if (err) { console.log(err); done(err); }
      else { done(null, 'done done reading and writing'); }
    });
  };

  /* MAIN */
  async.waterfall([
    /* first set up the folders that we need */
    function (callback) { setup(callback); },
    function (path, callback) { mainProcess(callback); }
    ],
    function (err) {
      if (err) { console.log(err); }
      else { __blogger.log('All Done!'); }
    }
  )
};
