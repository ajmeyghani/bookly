var scaffold = {
  run: function(thing, opts, flags) {
    __blogger.info(thing);
    __blogger.info(opts);
    console.log("Flags: %j", flags);
    __blogger.info("Running the command from: "+ process.cwd()); // current directory: whereever it is:
    __blogger.warn("The directory where this script is " + __dirname); // directory from which the code is running from: node_modules/boiler/lib/actions
  }
};

module.exports = scaffold;
