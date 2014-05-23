module.exports = {
  log: function (start, end, counts) {
    console.log("from", start, "to", end);
    Object.keys(counts).forEach(function (turns) {
      console.log(
        "turns:", turns, 
        "\tcount:", counts[turns], 
        "\tavg:", Math.floor(counts[turns] / (end - start) * 100),
        "%"
      );
    });
  }
};
