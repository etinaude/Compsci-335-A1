function get_start() {
  var data = [];
  var xmlHttp = new XMLHttpRequest();
  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[0] = xmlHttp.responseText;

  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[1] = xmlHttp.responseText;

  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[2] = xmlHttp.responseText;

  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/user";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[3] = xmlHttp.responseText;

  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[4] = xmlHttp.responseText;

  theURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/version";
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  data[5] = xmlHttp.responseText;

  for (i in data) {
    console.log(data[i]);
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
