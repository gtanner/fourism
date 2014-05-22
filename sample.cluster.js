var cluster = require('cluster');

if (cluster.isMaster) {
  cluster.fork({ start: 1, end: 1000000 });
  cluster.fork({ start: 1000000, end: 2000000 });
  cluster.fork({ start: 2000000, end: 3000000 });
  cluster.fork({ start: 3000000, end: 4000000 });
  cluster.fork({ start: 4000000, end: 5000000 });

  function handle(msg) {
    console.log("from", msg.start, "to", msg.end);
    Object.keys(msg.result).forEach(function (turns) {
      console.log(
        "turns:", turns, 
        "\tcount:", msg.result[turns], 
        "\tavg:", Math.floor(msg.result[turns] / (msg.end - msg.start) * 100),
        "%"
      );
    });
  };

  Object.keys(cluster.workers).forEach(function(id) {
    cluster.workers[id].on('message', handle);
  });
}
else {
  var wordify = require('./lib/wordify'),
      fourism = require('./lib/4our');

  var max = process.env.end,
      counts = {};

  for (var x = process.env.start; x < max; x++) {
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
