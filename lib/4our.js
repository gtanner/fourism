var wordify = require('./wordify');

module.exports = function (str) {
  var curr = str,
      len = curr.replace(' ', '').length,
      turns = 0;

  while (curr !== "four") {
    curr = wordify(len);
    len = curr.replace(' ', '').length;
    turns++;
  }

  return turns;
};
