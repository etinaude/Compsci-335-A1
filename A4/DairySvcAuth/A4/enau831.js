/*
& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:C:\Users\etina\Documents\GitHub\Compsci-335-A1\A4\DairySvcAuth  
var Surl = "http://redsox.uoa.auckland.ac.nz/dsa";
//*/
var Surl = "";
//var Uurl = "localhost:8188";
var Uurl = "http://redsox.uoa.auckland.ac.nz/ds";
var Uname=""
var Upass=""
//*/

//#region [rgba(255,255,0,0.03)] OLD
function format_table(data) {
  str = `
    <tr>
    <th class="T0">ID</th>
    <th class="T1" >Origin</th>
    <th class="T2" >Price</th>
    <th class="T3" >Item</th>
    <th class="T4" >Type</th>
    <th class="T5" >Buy</th>
    <tr>
    `;
  var items = [];
  for (var i = 0; i < data.length; i++) {
    items[i] = [
      data[i].getElementsByTagName("ItemId")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Origin")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Price")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue,
    ];
    str += `<tr class="line" id="${items[i][0]}">`;
    for (var j = 0; j < 5; j++) {
      str += `<td class="T${j} class="line" onclick="product_image(${items[i][0]})"">
          ${items[i][j]}
          </td>
          `;
    }
    str += `<td class="buy" onclick="buy_product(${items[i][0]})">BUY NOW</td></tr>`;
    document.getElementById("results").innerHTML = str;
  }
  document.getElementById("here").innerHTML = `
          <img class="main_image" src="${Uurl}/DairyService.svc/itemimg?id=${items[0][0]}">
          <img class="main_image" src="${Uurl}/DairyService.svc/itemimg?id=${items[1][0]}">
        `;
}
function show_image(data) {}
function product_image(image) {
  document.getElementById("product_image").innerHTML = `
  <img class="product_image" onclick="close_img()" src="${Uurl}/DairyService.svc/itemimg?id=${image}">
  </img>
  `;
  document.getElementById("product_image").style.display = "block";
}
function close_img() {
  document.getElementById("product_image").style.display = "none";
}
function format_comments(data) {
  //data.replace("</p>", "");
  data = data.split("<p>");
  data[0] = null;
  for (var i = 1; i < data.length; i++) {
    data[i] = `<p class="comment">` + data[i];
  }
  str = "";
  for (var i = 1; i < data.length; i++) {
    str += data[i];
  }
  document.getElementById("comment_cont").innerHTML = str;
}
function submit_comment() {
  var name = "inconspicuous name";
  document.getElementById("comment_cont").innerHTML = `
  <p class="comment"><em>${
    document.getElementById("comment_input").value
  }</em> — <b>${name}</b></p>
  ${document.getElementById("comment_cont").innerHTML}`;
  fetch(`${Uurl}/DairyService.svc/comment?name=${name}`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(`${document.getElementById("comment_input").value}`),
  }).then(() => {
    console.log("posted");
  });
}

function format_news(data) {
  var info = [[], []];
  for (var i = 0; i < data.length; i++) {
    data[i].innerHTML.replace("<descriptionField>", "");
    data[i].innerHTML.replace("<enclosurefield>", "");
    data[i].innerHTML.replace("<guidfield>", "");
    data[i].innerHTML.replace("<linkfield>", "");
    data[i].innerHTML.replace("<titlefield>", "");
  }
  for (var i = 0; i < data.length; i++) {
    info[i][0] = data[i].innerHTML.split("</descriptionField>");
    info[i][1] = data[i].innerHTML.split("</enclosurefield>");
    info[i][2] = data[i].innerHTML.split("</guidfield>");
    info[i][3] = data[i].innerHTML.split("</linkfield>");
    info[i][4] = data[i].innerHTML.split("</titlefield>");
  }
}

function get_start() {
  var data = [];
  var xmlHttp = new XMLHttpRequest();
  theURL = `${Uurl}/DairyService.svc/htmlcomments`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[0] = xmlHttp.responseText;
  theURL = `${Uurl}/DairyService.svc/items`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[1] = xmlHttp.responseXML;

  var info = [];
  fetch(`${Uurl}/DairyService.svc/news`, {
    headers: new Headers({
      Accept: "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => (info = data))
    .then(() => {
      var s = "";
      for (var i = 0; i < info.length; i++) {
        s += `<div href="https://www.francebleu.fr/vie-quotidienne/balades-randonnees/velo-et-fromages-des-itineraires-gourmands-desormais-disponibles-dans-un-guide-1594893284" class="box row">
        <img class="news-img" src=${info[i].enclosureField.urlField}></img>
        <div class="col">
        <h4>${info[i].titleField}</h4>
        <div class="data">${info[i].pubDateField}</div>
        <br>
        ${info[i].descriptionField}
        <br>
        <br>
        <br>
        <br>
        <br>
        <a class="linked" href="https://www.francebleu.fr/vie-quotidienne/balades-randonnees/velo-et-fromages-des-itineraires-gourmands-desormais-disponibles-dans-un-guide-1594893284">
        more info >></a>
        </div>
        </div>`;
      }
      document.getElementById("news").innerHTML = s;
    });

  theURL = `${Uurl}/DairyService.svc/user`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[3] = xmlHttp.responseText;
  xmlHttp.open("GET", `${Uurl}/DairyService.svc/vcard`, false);
  xmlHttp.send(null);
  data[4] = xmlHttp.responseText;
  //console.log(data[4]);
  data[4] = data[4].split(/\r?\n/);
  var vcard = [];
  for (var i = 0; i < data[4].length; i++) {
    if (data[4][i].includes("TEL")) {
      vcard[0] = data[4][i].split("VOICE:")[1];
    } else if (data[4][i].includes("ADR;WORK;PREF:;;")) {
      vcard[2] = data[4][i].split("ADR;WORK;PREF:;;")[1];
      vcard[2] = vcard[2].replace(";", "<br>");
      vcard[2] = vcard[2].replace(";", "<br>");
      vcard[2] = vcard[2].replace(";", "<br>");
    } else if (data[4][i].includes("EMAIL:")) {
      vcard[1] = data[4][i].split("EMAIL:")[1];
    }
  }
  //console.log(vcard);

  document.getElementById("contact").innerHTML = `
  <br>
  <a href="tel:${vcard[0]}"> P: ${vcard[0]}</a>
  <br>
  <a href="mailto:${vcard[1]}">E: ${vcard[1]}</a>
  <br>
  ${vcard[2]}
  <br>
  <br>
  `;

  theURL = `${Uurl}/DairyService.svc/version`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[5] = xmlHttp.responseText;

  format_table(data[1].getElementsByTagName("Item"));
  format_comments(data[0]);
}
function switch_tab(tab) {
  for (var i = 0; i < 6; i++) {
    document.getElementById(`B${i}`).style = "";
    document.getElementById(`T${i}`).style = "display: None;";
  }
  document.getElementById(`B${tab}`).style = "background-color: darkgrey;";
  document.getElementById(`T${tab}`).style = "display: True;";
}
function get_search() {
  TERM = document.getElementById("search").value;
  var xmlHttp = new XMLHttpRequest();
  theURL = `${Uurl}/DairyService.svc/search?term=${TERM}`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  var data = xmlHttp.responseXML;
  format_table(data.getElementsByTagName("Item"));
}
//#endregion
function buy_product(id) {
  if(!Uname||!Upass){
    Uname = prompt("username:")
    Upass = prompt("password:")
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${Surl}/Service.svc/buy?id=${id}`,
    true,
    Uname,
    Upass
  );
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      if(this.responseText.includes("Fault")){
        Uname = "";
        Upass = "";
        document.getElementById("message").innerHTML = "An Error Occured, please try reenter your username and password"
      }else if(this.responseText.includes("your custom")){
        document.getElementById("message").innerHTML = this.responseXML.getElementsByTagName("string")[0].innerHTML;
      }
    }
  });
  xhr.send();
  /*


  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  */
}

function register_user() {
  fetch(`${Uurl}/DairyService.svc/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Address: "123 lane",
      Name: "ehyi",
      Password: "ehyi",
    }),
  }).then((data) => console.log(data));
  //document.getElementById("Register").display = "none";
}

/*

fetch(
    `${Uurl}/DairyService.svc/comment?name=${name}`,
    {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(`${document.getElementById("comment_input").value}`),
    }
  ).then(() => {
    console.log("posted");
  });

*/

function login_user() {
  document.getElementById("part2").style.display = "flex"
}
function Login(){
  Uname = document.getElementById("Uname").value;
  Upass = document.getElementById("Upass").value;
  console.log(Uname,Upass);
}

switch_tab(0);
get_start();
