var Uurl = "";
var Uname = "name";
var comment = "DROP TABLE Comments;";
/*
fetch(`${Uurl}/DairyService.svc/news`, {
  headers: new Headers({
    Accept: "application/json",
  }),
});
*/

fetch(`${Uurl}/DairyService.svc/comment?name=${Uname}`, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(`${comment}`),
}).then(() => {
  console.log("posted");
});
//*/
