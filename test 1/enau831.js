function switchHome() {
  document.getElementById("staff").style.display = "none";
  document.getElementById("home").style.display = "flex";
}
function switchStaff() {
  document.getElementById("home").style.display = "none";
  document.getElementById("staff").style.display = "flex";
}
function details(upi, id) {
  if (id == "undefined") {
    image = `<img
    src="https://unidirectory.auckland.ac.nz/static/g5Km3OjLZuWCA8w7PdOyS4j603aTN0QC7X2gk6kRhEs.png"
    alt="Person image"
    width="500"
    height="600"
      />`;
    console.error("no image");
    return;
  }
  //https://unidirectory.auckland.ac.nz/static/g5Km3OjLZuWCA8w7PdOyS4j603aTN0QC7X2gk6kRhEs.png
  var url = `https://unidirectory.auckland.ac.nz/people/imageraw/${upi}/${id}/biggest`;
  image = `<img
  src="${url}"
  alt="Person image"
  width="500"
  height="600"
    />`;
  document.getElementById("modal").style.display = "block";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function formatData(data) {
  str = `
      <tr class="row">
      <th class="T0">First name</th>
      <th class="T1" >Last name</th>
      <th class="T2" >UPI</th>
      <th class="T3" >Email</th>
      <tr>
      <tbody>
      `;
  data.forEach((element) => {
    console.log(`"${element["profileUrl"][0]}","${element["imageId"]}"`);
    str += `<tr onclick="details('${element["profileUrl"][0]}','${element["imageId"]}')">
        <td class="T0">${element["legalFirstName"]}</td>
        <td class="T1">${element["legalLastName"]}</td>
        <td class="T2">${element["profileUrl"][0]}</td>
        <td class="T3">${element["emailAddresses"][0]}</td>
    </tr>`;
  });
  str += "</tbody>";
  document.getElementById("results").innerHTML = str;
}

function searchStaff() {
  TERM = document.getElementById("search").value;
  var URL =
    "https%3A%2F%2Funidirectory.auckland.ac.nz%2Frest%2Fsearch%3ForgFilter%3DMATHS";
  //var URL =
  //"https%3A%2F%2Funidirectory.auckland.ac.nz%2Fpeople%2Fimageraw%2Fsgal018%2F10300384%2Fbiggest ";
  //https://unidirectory.auckland.ac.nz/people/imageraw/sgal018/10300384/biggest

  fetch(`https://dividni.com/cors/CorsProxyService.svc/proxy?url=${URL}`)
    .then((response) => response.json())
    .then((data) => formatData(data["list"]));
}

/*

function get_search() {
  TERM = document.getElementById("search").value;
  var xmlHttp = new XMLHttpRequest();
  theURL = `http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=${TERM}`;
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  var data = xmlHttp.responseXML;
  format_table(data.getElementsByTagName("Item"));
}


*/
switchStaff();
searchStaff();
