function get_start() {
  var data = [];
  var xmlHttp = new XMLHttpRequest();
  //Comments
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[0] = xmlHttp.responseText;

  //items
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[1] = xmlHttp.responseXML;

  //news
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[2] = xmlHttp.responseText;

  //user
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/user";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[3] = xmlHttp.responseText;

  //vcard
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[4] = xmlHttp.responseText;
  str = `
  <tr>
  <th class="T0">ID</th>
  <th class="T1" >Origin</th>
  <th class="T2" >Price</th>
  <th class="T3" >Item</th>
  <th class="T4" >Type</th>
  <tr>
  `;
  //version
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/version";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[5] = xmlHttp.responseText;
  var temp = data[1].getElementsByTagName("Item");
  console.log(temp);
  var items = [];
  for (var i = 0; i < temp.length; i++) {
    items[i] = [
      temp[i].getElementsByTagName("ItemId")[0].childNodes[0].nodeValue,
      temp[i].getElementsByTagName("Origin")[0].childNodes[0].nodeValue,
      temp[i].getElementsByTagName("Price")[0].childNodes[0].nodeValue,
      temp[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue,
      temp[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue,
    ];
    str += `<tr>`;
    for (var j = 0; j < 5; j++) {
      str += `<td class="T${j}">
        ${items[i][j]}
        </td>`;
    }
    str += `</tr>`;
  }
  document.getElementById("results").innerHTML = str;
  for (var i = 0; i < 20; i++) {
    console.log(items[i]);
  }
}
function switch_tab(tab) {
  for (var i = 0; i < 5; i++) {
    document.getElementById(`B${i}`).style = "";
    document.getElementById(`T${i}`).style = "display: None;";
  }
  document.getElementById(`B${tab}`).style = "background-color: darkgrey;";
  document.getElementById(`T${tab}`).style = "display: True;";
}
function get_search() {}
