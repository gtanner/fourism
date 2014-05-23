var zmq = require('zmq'),
    async = require('async'),
    cluster = require('cluster'),
    utils = require('./lib/utils');

if (cluster.isMaster) {
  var push = zmq.socket('push'),
      pull = zmq.socket('pull');

  push.bindSync('tcp://*:1337');
  pull.bindSync('tcp://*:1338');

  pull.on('message', function (start, end, result) {
    utils.log(start.toString(), end.toString(), JSON.parse(result.toString()));
  });

  async.times(10, cluster.fork);

  setTimeout(function () {
    push.send([1,1000000]);
    push.send([1000000,2000000]);
    push.send([2000000,3000000]);
    push.send([3000000,4000000]);
    push.send([4000000,5000000]);
    push.send([5000000,6000000]);
  }, 100);
}
else {
  var push = zmq.socket('push'),
      pull = zmq.socket('pull');

  pull.connect('tcp://localhost:1337');
  push.connect('tcp://localhost:1338');

  var wordify = require('./lib/wordify'),
      fourism = require('./lib/4our');

  pull.on('message', function (start, end) {
    start = parseInt(start.toString(), 10);
    end = parseInt(end.toString(), 10);

    var counts = {};

    for (var x = start; x < end; x++) {
      var turns = fourism(wordify(x));
      counts[turns] = ++counts[turns] || 1;
    }
    push.send([start, end, JSON.stringify(counts)]);
  });
}
