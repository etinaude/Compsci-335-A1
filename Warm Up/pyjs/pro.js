const fs = require(`fs`);
const { exit } = require("process");
var stdin = process.openStdin();

stdin.addListener("data", function (d) {
  var arr = d.toString().split(/[\r|\n|\t| ]+/);
  arr = arr.map((x) => {
    if (isNaN(x) || x != Math.round(x)) {
      console.log("*** NaN");
      exit(0);
    }
    if (x < -2147483648 || x > 2147483647) {
      console.log("*** NanInt32");
      exit(0);
    }
    if (!(x % 2)) {
      return x / 2;
    }
    return parseInt(x);
  });
  //console.log(arr);
  arr = arr.filter((x, i) => {
    return arr.indexOf(x) == i;
  });
  console.log(arr.reduce((a, b) => a + b, 0));
});
