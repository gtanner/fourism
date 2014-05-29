var cluster = require('cluster'),
    async = require('async'),
    utils = require('./lib/utils');

if (cluster.isMaster) {
  function send(range, callback) {
    cluster.fork({
      start: range.start,
      end: range.end
    }).on('message', function (msg) {
      callback(null, msg);
    });
  } 

  function handle(msg) {
    utils.log(msg.start, msg.end, msg.result);
  };

  async.parallel([
    async.apply(send, utils.range(0)),
    async.apply(send, utils.range(1)), 
    async.apply(send, utils.range(2)),
    async.apply(send, utils.range(3)), 
    async.apply(send, utils.range(4))
  ], function (err, results) {
    results.forEach(handle);
  });
}
else {
  var wordify = require('./lib/wordify'),
      fourism = require('./lib/fourism');

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
