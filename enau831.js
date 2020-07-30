function format_table(data) {
  str = `
    <tr>
    <th class="T0">ID</th>
    <th class="T1" >Origin</th>
    <th class="T2" >Price</th>
    <th class="T3" >Item</th>
    <th class="T4" >Type</th>
    <tr>
    `;
  console.log(data);
  var items = [];
  for (var i = 0; i < data.length; i++) {
    items[i] = [
      data[i].getElementsByTagName("ItemId")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Origin")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Price")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue,
      data[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue,
    ];
    str += `<tr class="line" id="${items[i][0]}" onclick="product_image(${items[i][0]})">`;
    for (var j = 0; j < 5; j++) {
      str += `<td class="T${j}">
          ${items[i][j]}
          </td>`;
    }
    str += `</tr>`;
    document.getElementById("results").innerHTML = str;
  }
}
function show_image(data) {}
function product_image(image) {
  console.log(image);
  document.getElementById("product_image").innerHTML = `
  <img class="product_image" onclick="close_img()" src="http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=${image}">
  </img>
  `;
  document.getElementById("product_image").style.display = "block";
}
function close_img() {
  console.log("HI");
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
  fetch(
    "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=anonymous",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "PLEASE WORK",
    }
  ).then(() => {
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
/*
0: descriptionfield
1: enclosurefield
2: guidfield
3: linkfield
4: pubdatefield
5: titlefield





*/

function get_start() {
  var data = [];
  var xmlHttp = new XMLHttpRequest();
  //#region Comments
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[0] = xmlHttp.responseText;

  //#endregion
  //#region items
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[1] = xmlHttp.responseXML;
  //#endregion

  //#region news
  var info = [];
  fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news", {
    headers: new Headers({
      Accept: "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => (info = data))
    .then(() => console.log(info))
    .then(() => {
      var s = "";
      for (var i = 0; i < info.length; i++) {
        s += `<div class="box">
        <h4>${info[i].titleField}</h4>
        <div class="data">${info[i].pubDateField}</div>
        <br>
        ${info[i].descriptionField}
        <img class="news-img" src=${info[i].enclosureField.urlField}></img>
        </div>`;
      }
      document.getElementById("news").innerHTML = s;
    });
  console.log(info);

  //#region user
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/user";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[3] = xmlHttp.responseText;
  //#endregion

  //#region vcard
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[4] = xmlHttp.responseText;
  //#endregion

  //#region version
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/version";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[5] = xmlHttp.responseText;
  //#endregion

  format_table(data[1].getElementsByTagName("Item"));
  format_comments(data[0]);
}
function switch_tab(tab) {
  for (var i = 0; i < 5; i++) {
    document.getElementById(`B${i}`).style = "";
    document.getElementById(`T${i}`).style = "display: None;";
  }
  document.getElementById(`B${tab}`).style = "background-color: darkgrey;";
  document.getElementById(`T${tab}`).style = "display: True;";
}
function get_search(TERM) {
  var xmlHttp = new XMLHttpRequest();
  theURL = `http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=${TERM}`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  var data = xmlHttp.responseXML;
  format_table(data.getElementsByTagName("Item"));
}
