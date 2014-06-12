#!/usr/bin/env node
var zmq = require('zmq'),
    async = require('async'),
    uuid = require('uuid'),
    cluster = require('cluster'),
    utils = require('./../lib/utils'),
    push = zmq.socket('push'),
    pull = zmq.socket('pull');

var program = require('commander');
var prompt = require('prompt');

program
  .version(require('./../package.json').version);

program
  .command('master')
  .description('Zuul, the Gatekeeper')
  .action(function () {
    push.bindSync('tcp://*:1337');
    pull.bindSync('tcp://*:1338');

    var workers = {}, callbacks = [];

    pull.on('message', function (msg, data) {
      msg = msg.toString();
      data = JSON.parse(data.toString());

      switch (msg) {
        case 'result':
          var cb = callbacks.pop();
          return cb && cb(null, data);
        default:
          var count = Object.keys(workers).length;
          workers[data] = 1;
          var updated = Object.keys(workers).length;

          if (count !== updated) {
            console.log('worker connected,', updated, 'are in the house');
          }
      }
    });

    function send(range, callback) {
      callbacks.push(callback);
      push.send([range.start, range.end]);
    }

    function handle(msg) {
      utils.log(msg.start, msg.end, msg.result);
    }
    
    prompt.start();

    prompt.get({
      name: 'millions',
      type: 'number',
      message: 'how many millions?!?!?'
    }, function (err, args) {
      var start = Date.now(), batches = [];

      for (var x = 0; x < args.millions; x++) {
        batches.push(async.apply(send, utils.range(x)));
      }

      async.parallel(batches, function (err, results) {
        results.forEach(handle);
        console.log('time:', (Date.now() - start) / 1000);
        process.exit();
      });
    });
  });


program
  .command('slave [ip]')
  .description('Vinz Clortho, Keymaster of Gozer')
  .action(function (ip) {
    if (cluster.isMaster) {
      async.times(4, cluster.fork);

      prompt.start();
      prompt.message = '';
      prompt.delimiter = '';

      prompt.get({name: 'exit', message: '\n'}, process.exit);
      console.log('\npress enter to exit');
    }
    else {
      ip = ip || 'localhost';
      console.log('worker process', process.pid, 'connected to', ip);
      pull.connect('tcp://' + ip + ':1337');
      push.connect('tcp://' + ip + ':1338');

      var wordify = require('./../lib/wordify'),
          fourism = require('./../lib/fourism');


      pull.on('message', function (start, end) {
        console.log('the fours is with you:', start.toString(), end.toString());
        start = parseInt(start.toString(), 10);
        end = parseInt(end.toString(), 10);

        var counts = {};

        for (var x = start; x < end; x++) {
          var turns = fourism(wordify(x));
          counts[turns] = ++counts[turns] || 1;
        }

        push.send(['result', JSON.stringify({
          start: start, 
          end: end, 
          result: counts
        })]);
      });

      var id = JSON.stringify(uuid.v4());
      setInterval(function () { push.send(['hello', id]); }, 1000);
    }
  });

program.parse(process.argv);
if (program.args.length === 0) {
  program.help();
}
