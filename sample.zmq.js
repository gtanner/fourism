var zmq = require('zmq'),
    async = require('async'),
    cluster = require('cluster'),
    utils = require('./lib/utils');
    push = zmq.socket('push'),
    pull = zmq.socket('pull');

if (cluster.isMaster) {
  push.bindSync('tcp://*:1337');
  pull.bindSync('tcp://*:1338');

  var workers = 0,
      callbacks = [];

  pull.on('message', function (msg, data) {
    msg = msg.toString();
    data = JSON.parse(data.toString());
    console.log(msg, data);

    switch (msg) {
      case 'result':
        var cb = callbacks.pop();
        return cb && cb(null, data);
        break;
      default:
        workers++;
        console.log('worker connected,', workers, 'are in the house');
    }
  });

  async.times(4, cluster.fork);

  console.log('starting awesomesauce');
  console.log('> w to send work');
  console.log('> q to quit');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on('data', function (buff) {
    var key = buff.toString()


    switch (key) {
      case 'w':
        function send(range, callback) {
          callbacks.push(callback);
          push.send([range.start, range.end]);
        }

        function handle(msg) {
          utils.log(msg.start, msg.end, msg.result);
        };

        var start = Date.now();
        console.log('sending...');
        async.parallel([
          async.apply(send, utils.range(0)),
          async.apply(send, utils.range(1)),
          async.apply(send, utils.range(2)),
          async.apply(send, utils.range(3)),
          async.apply(send, utils.range(4))
        ], function (err, results) {
          results.forEach(handle);
          console.log("Duration:", (Date.now() - start) / 1000);
          console.log('> w to send work');
          console.log('> q to quit');
        });
        break;
      case 'q':
        process.exit();
        break;
    }
  });
}
else {
  //console.log('worker online');
  pull.connect('tcp://localhost:1337');
  push.connect('tcp://localhost:1338');

  var wordify = require('./lib/wordify'),
      fourism = require('./lib/4our');

  setTimeout(function () {
    push.send(['hello', 3]);
  }, 10);
  pull.on('message', function (start, end) {
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
}
