var wordify = require('./lib/wordify'),
    utils = require('./lib/utils'),
    fourism = require('./lib/4our');

var range = utils.range(0),
    counts = {};

for (var x = range.start; x < range.end; x++) {
  var turns = fourism(wordify(x));
  counts[turns] = ++counts[turns] || 1;
}

utils.log(range.start, range.end, counts);
