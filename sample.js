var wordify = require('./lib/wordify'),
    fourism = require('./lib/4our');

var max = 1000000,
    counts = {};

for (var x = 1; x < max; x++) {
  var turns = fourism(wordify(x));
  counts[turns] = ++counts[turns] || 1;
}

console.log("for", max, "numbers");
Object.keys(counts).forEach(function (turns) {
  console.log(
    "turns:", turns, 
    "\tcount:", counts[turns], 
    "\tavg:", Math.floor(counts[turns] / max * 100)
  );
});
