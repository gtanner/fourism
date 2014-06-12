var wordify = require('./lib/wordify'),
    utils = require('./lib/utils'),
    fourism = require('./lib/fourism');

var counts = {};

for (var x = 1; x < 1000000; x++) {
  var turns = fourism(wordify(x));
  counts[turns] = ++counts[turns] || 1;
}

utils.log(1, 1000000, counts);
