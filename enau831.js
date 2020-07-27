function run() {
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();
  document.getElementById("here").innerHTML = "HHHH";
}
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
