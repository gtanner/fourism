var cluster = require('cluster'),
    async = require('async'),
    utils = require('./lib/utils');

if (cluster.isMaster) {
  function send(start, end, callback) {
    cluster.fork({
      start: start,
      end: end
    }).on('message', function (msg) {
      callback(null, msg);
    });
  } 

  function handle(msg) {
    utils.log(msg.start, msg.end, msg.result);
  };

  async.parallel([
    async.apply(send, 1, 1000000),
    async.apply(send, 1000000, 2000000), 
    async.apply(send, 2000000, 3000000),
    async.apply(send, 3000000, 4000000), 
    async.apply(send, 4000000, 5000000)
  ], function (err, results) {
    results.forEach(handle);
  });
}
else {
  var wordify = require('./lib/wordify'),
      fourism = require('./lib/4our');

  var counts = {};

  for (var x = process.env.start; x < process.env.end; x++) {
    var turns = fourism(wordify(x));
    counts[turns] = ++counts[turns] || 1;
  }

  process.send({
    start: process.env.start,
    end: process.env.end,
    result: counts
  });

  process.exit();
}
