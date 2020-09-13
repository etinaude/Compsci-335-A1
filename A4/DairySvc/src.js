var Uurl = "";
var Uname = "name";
var comment = "DROP TABLE Comments;";
var list = 



/*
fetch(`${Uurl}/DairyService.svc/news`, {
  headers: new Headers({
    Accept: "application/json",
  }),
});
*/
console.log("here")
list.forEach(element => {
    fetch(`${Uurl}/DairyService.svc/register`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({Address:"comment",
                            Name: element,
                            Password: element}  ),
    }).then(() => {
      console.log("posted", element);
    });
});
//*/
