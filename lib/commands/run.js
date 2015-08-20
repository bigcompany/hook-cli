var rs = require("run-service");

module['exports'] = function run (opts, cb) {
  var service = opts.service;
  var fn = rs({
    
  });
  fn({}, function(){
    cb(null);
  });
};