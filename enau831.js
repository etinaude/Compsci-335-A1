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
  document.getElementById("product_image").innerHTML = `
  <img class="product_image" onclick="close_img()" src="http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=${image}">
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
  var name = "";
  document.getElementById("comment_cont").innerHTML = `
  <p class="comment"><em>${
    document.getElementById("comment_input").value
  }</em> — <b>${name}</b></p>
  ${document.getElementById("comment_cont").innerHTML}`;
  fetch(
    `http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=${name}`,
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
    .then(() => {
      var s = "";
      for (var i = 0; i < info.length; i++) {
        s += `<div href="https://www.francebleu.fr/vie-quotidienne/balades-randonnees/velo-et-fromages-des-itineraires-gourmands-desormais-disponibles-dans-un-guide-1594893284" class="box">
        <h4>${info[i].titleField}</h4>
        <div class="data">${info[i].pubDateField}</div>
        <br>
        ${info[i].descriptionField}
        <img class="news-img" src=${info[i].enclosureField.urlField}></img>
        <a class="linked" href="https://www.francebleu.fr/vie-quotidienne/balades-randonnees/velo-et-fromages-des-itineraires-gourmands-desormais-disponibles-dans-un-guide-1594893284">
        more info>></a>
        </div>`;
      }
      document.getElementById("news").innerHTML = s;
    });

  //#region user
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/user";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[3] = xmlHttp.responseText;
  //#endregion

  //#region vcard
  xmlHttp.open(
    "GET",
    "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard",
    false
  );
  xmlHttp.send(null);
  data[4] = xmlHttp.responseText;
  data[4] = data[4].split("PHOTO")[0];
  var vcard = [];
  document.getElementById("contact").innerHTML = `
  <br>
  <a href="tel:${data[4].split("VOICE:")[1].split("ADR")[0]}"> P: ${
    data[4].split("VOICE:")[1].split("ADR")[0]
  }</a>
  <br>
  <a href="mailto:${data[4].split("EMAIL:")[1]}">E: ${
    data[4].split("EMAIL:")[1]
  }</a>
  <br>
  ${data[4].split("ADR;WORK;PREF:;;")[1].split("EMAIL")[0]}

  `;

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
function get_search() {
  TERM = document.getElementById("search").value;
  var xmlHttp = new XMLHttpRequest();
  theURL = `http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=${TERM}`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  var data = xmlHttp.responseXML;
  format_table(data.getElementsByTagName("Item"));
}
