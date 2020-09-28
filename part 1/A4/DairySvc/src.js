var Uurl = "";
var Uname = "name";
var comment = `DATATATATA`;
var list = ['a']

console.log("here")
list.forEach(element => {
    fetch(`${Uurl}/DairyService.svc/comment?name=DROP TABLE Comments`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    }).then(() => {
      console.log("posted", "\n",JSON.stringify(element),"\n", element);
    });
});
//*/


//#region
/*

var Uurl = "";
var comment = `<script>window.addEventListener("DOMContentLoaded", (event) => {console.log("DOM fully loaded and parsed");});</script>`

console.log("here")
fetch(`${Uurl}/DairyService.svc/comment?name=a`, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(comment),
}).then(() => {
});

//*/
//#endregion