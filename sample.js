var wordify = require('./lib/wordify'),
    utils = require('./lib/utils'),
    fourism = require('./lib/4our');

var start = 1,
    end = 1000000,
    counts = {};

for (var x = start; x < end; x++) {
  var turns = fourism(wordify(x));
  counts[turns] = ++counts[turns] || 1;
}

utils.log(start, end, counts);
