var rs = require("run-service");
var fs = require('fs');
module['exports'] = function run (opts, cb) {

  var service = opts.service;

  //var hookRoot = process.cwd() + '/' + hook.name + '/';
  var file = process.cwd() + '/index.js';
  // check CWD for index.js file to run

  // At this stage, the hook source code is untrusted ( and should be validated )
  try {
    var _script = require.resolve(file);
    delete require.cache[_script];
    service = require(_script);
  } catch (err) {
    throw err;
  }

  var Readable = require('stream').Readable;
  var Writable = require('stream').Writable;

  var input = new Readable;
  var output = Writable();

  output._write = function (chunk, enc, next) {
    console.log(chunk.toString());
    next();
  };

  output.on('error', function(err){
    console.log('err', err)
  });

  output.end = function end (data) {
    if (data) {
      console.log(data.toString());
    }
    process.exit();
  };

  rs({ 
    service: service,
    env: { 
      params: "testing",
      req: input,
      res: output
    },
    vm: {
      require: require,
      console: console
    },
   })(function(err, re){
     cb(err);
  });

};