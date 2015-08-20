var mkdirp = require('mkdirp'),
    fs = require('fs');

var scaffold = fs.readFileSync(__dirname + '/../../scaffold/service.js').toString();

module['exports'] = function init (opts, cb) {
  console.log('creating new hook...');
  
  
  checkOrCreateHookDirectory(function(){
    promptHook(function(err, hook){
      checkOrCreateHook(hook, function(){
        cb(null);
      });
    });
  })
  
};


function promptHook (cb) {
  console.log('prompting for data');
  var hook = {
    "name": "echo",
    "owner": "Marak"
  };
  
  console.log('creating hook', hook);
  
  cb(null, hook);
};


function checkOrCreateHook (hook, cb) {
  console.log('check or create', hook);
  
  var file = process.cwd() + '/hooks/' + hook.name + '.js';
  fs.readFile(file, function(err, f){
    if (err) {
      if (err.code === "ENOENT") {
        console.log('hook not found: ' + file);
        console.log('creating: ' + file);
        console.log(scaffold);
        
        return fs.writeFile(file, scaffold, function(err){
          if (err) {
            throw err;
          }
          cb(null);
        });
        //mkdirp.sync(hooksDir);
      }
      throw err;
    }
    console.log('cannot init. already exists: ' + file);
  });
  
};

function checkOrCreateHookDirectory (cb) {
  fs.readdir(process.cwd() + '/hooks', function(err, dir){
    if (err) {
      if (err.code === "ENOENT") {
        var hooksDir = process.cwd() + '/hooks';
        console.log('directory not found: ' + hooksDir);
        console.log('creating: ' + hooksDir);
        mkdirp.sync(hooksDir);
      }
      throw err;
    }
    console.log(dir);
    cb(null);
  });
};