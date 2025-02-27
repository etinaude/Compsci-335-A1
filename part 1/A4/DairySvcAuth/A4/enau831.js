/*
& "C:\Program Files\IIS Express\IISExpress.exe" /port:8189 /path:C:\Users\etina\Documents\GitHub\Compsci-335-A1\A4\DairySvcAuth  
var Surl = "http://redsox.uoa.auckland.ac.nz/dsa";
//*/
var Surl = "";
var Uurl = "http://localhost:8188";
//var Uurl = "http://redsox.uoa.auckland.ac.nz/ds";
var Uname = "";
var Upass = "";
var l = false;
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
  if (!Uname || !Upass) {
    switch_tab("5");
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${Surl}/Service.svc/buy?id=${id}`, true, Uname, Upass);
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText.includes("Fault")) {
        document.getElementById("message").innerHTML = this.responseText;
      } else if (this.responseText.includes("your custom")) {
        document.getElementById(
          "message"
        ).innerHTML = this.responseXML.getElementsByTagName(
          "string"
        )[0].innerHTML;
      }
    }
  });
  xhr.send();
}

function register_user() {
  fetch(`${Uurl}/DairyService.svc/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Address: document.getElementById("address").value,
      Name: document.getElementById("Uname").value,
      Password: document.getElementById("Upass").value,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      document.getElementById("Emessage").innerHTML = data;
      if (data.includes("registered")) {
        document.getElementById("Emessage").style.color = "#8a7e19";
      } else {
        document.getElementById("Emessage").style.color = "red";
      }
      document.getElementById("Emessage").style.display = "flex";
    });
}
function register_btn() {
  document.getElementById("address").style.display = "flex";
  document.getElementById("part2").style.display = "flex";
  l = false;
}

function login_user() {
  document.getElementById("address").style.display = "none";
  document.getElementById("part2").style.display = "flex";
  l = true;
}

function logout() {
  (Uname = ""),
    (Upass = ""),
    (document.getElementById("login").style.display = "flex");
  document.getElementById("register").style.display = "flex";
  document.getElementById("logout").style.display = "none";
  document.getElementById("status").innerHTML = `Logged Out`;
  document.getElementById("status").style.color = "red";
}

function Login() {
  if (
    !document.getElementById("Uname").value ||
    !document.getElementById("Upass").value
  ) {
    document.getElementById("Emessage").innerHTML = "please enter your details";
    return;
  }
  if (l) {
    console.log("l");
    Uname = document.getElementById("Uname").value;
    Upass = document.getElementById("Upass").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${Surl}/Service.svc/user`, true, Uname, Upass);
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.includes("Fault")) {
          Uname = "";
          Upass = "";
          document.getElementById("Upass").value = "";
          document.getElementById("Uname").value = "";
          console.log("sorry an error occured please try again");
          document.getElementById("Emessage").style.color = "red";
          document.getElementById("Emessage").innerHTML =
            "sorry an error occured please try again";
        } else {
          console.log(this.responseText);
          document.getElementById("login").style.display = "none";
          document.getElementById("register").style.display = "none";
          document.getElementById("part2").style.display = "none";
          document.getElementById("logout").style.display = "flex";
          document.getElementById("Emessage").style.color = "#8a7e19";
          document.getElementById("Emessage").innerHTML = "Logged in";
          document.getElementById("Emessage").style.display = "flex";
          document.getElementById(
            "status"
          ).innerHTML = `logged in as: ${Uname}`;
          document.getElementById("status").style.color = "#8a7e19";
        }
      }
    });
    xhr.send();
  } else {
    console.log("r");
    register_user();
  }
}

switch_tab(0);
get_start();
