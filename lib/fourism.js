var wordify = require('./wordify');

global.huh = true;

module.exports = function (str, verbose) {
  var curr = str,
      len = curr.replace(' ', '').length,
      turns = 1;

  if (verbose) console.log(curr, 'has', len, 'letters');

  while (curr !== "four") {
    curr = wordify(len);
    len = curr.replace(' ', '').length;
    turns++;
    if (verbose) console.log(curr, 'has', len, 'letters');
  }

  return turns;
};
