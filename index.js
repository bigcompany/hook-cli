var cli = {};
module['exports'] = cli;

cli.run = function (stdin, stdout, opts, cb){
  
  var argv = opts.argv;
  var request = require('hyperquest');
  //var through = require("through2");
  var colors = require('colors');

  var config = require('./config');

  var debug = console.log;

  // TODO: add ability to signin and list your own hooks
  // TODO: add ability to configure username

  // TODO: make services list enumerable from live site
  var services = {
    "echo": {},
    "coin": {},
    "colors": {},
    "image": {},
    "geoip": {},
    "markdown": {},
    "spellcheck": {}
  };

  var commands = {
    "init": {},
    "push": {},
    "pull": {},
    "run": {},
    "test": {}
  };

  cli.commands = {};
  for (var c in commands) {
    cli.commands[c] = require('./lib/commands/' + c);
  }
  
  console.log(cli);
  

  // If no microservice is provided, show a list of default microservices
  /*
  if (argv._.length === 0) {
    console.log('No service selected.');
    console.log(Object.keys(services).join('\n'));
  }
  */

  var command = argv._[0];
  
  if (argv._.length === 0 ) {
    console.log('no command has been selected');
    console.log('available commands:');
    console.log(Object.keys(commands).join('\n'));
    //console.log('init');
    //console.log('push');
    //console.log('pull');
    //console.log('run');
    return cb(null);
  }

 if (typeof commands[command] === 'undefined') {
   console.log('invalid command: ' + command);
   console.log('available commands:');
   console.log(Object.keys(commands).join('\n'));
   return cb(null);
 }
  
  
 cli.commands[command]({}, function (err) {
   console.log(err, 'ran')
 });
 
 return;
  
  
  // If a microservice is provided, attempt to run it
  var data = {};
  for(var p in argv) {
    if (p === "_") {
      continue;
    }
    data[p] = argv[p];
  }

  // If a second parameter has been included, assume its the first schema parameter
  if (typeof argv._[1] !== 'undefined') {
    // TODO
  }

  var base = config.endpoint,
      hookName = '';

  // check against top level hooks
  if (typeof services[service] !== 'undefined') {
    // found a top level hook service, use special url
    base = "http://" + service + ".hook.io/";
    hookName = "";
  } else {
    service = "/Marak/echo";
    base = base + service;
  }

  // STDIN / REQUEST OUT stream processing
  stdin.setEncoding('utf8');

  var url = base + hookName;
  // console.log('opening stream to ', url);

  if (stdin.isTTY) {
    // handle shell arguments


    debug('making outgoing request', url);

    var stream = request.post(url, { headers: { "Content-Type": "application/json" }});

    // If the service is not found or an error occurs, show a friendly error
    stream.on('error', function(e){
      throw e;
    });

    stream.on('end', function(){
      // console.log('stream ended');
    });

    stream.on('response', function(res){
      if (res.statusCode === 404) {
        console.log('Hook not found');
        process.exit();
      }
    });

    stream.write(JSON.stringify(data));
    stream.end();
    stream.on('data', function(d){
      console.log(d.toString());
    });

  } else {
    // handle piped content
    debug('making outgoing request', url);
    var stream = request.post(url, { headers: { "Content-Type": "application/octet-stream" }});

    // TODO: If the service is not found or an error occurs, show a friendly error
    stream.on('error', function(e){
      throw e;
    });

    stream.on('end', function(){
      console.log('stream ended');
    });

    stdin.on('readable', function() {
      console.log("READING".red)
      var chunk = stdin.read();
      if (chunk !== null) {
        stream.write(chunk);
      }
    });

    stdin.on('end', function() {
      console.log('ended event stdin')
      // check if any data was recevived via stdin, if not, send json payload
      //stdout.write('end');
      stream.end();
    });

    stream.on('data', function(d){
      console.log(d.toString());
    });

  }
  
  cb(null);
};