// switch from home to staff and vise versa
function switchHome() {
  document.getElementById("staff").style.display = "none";
  document.getElementById("home").style.display = "flex";
}
function switchStaff() {
  document.getElementById("home").style.display = "none";
  document.getElementById("staff").style.display = "flex";
}

function getVcard(upi) {
  var URL = `https%3A%2F%2Funidirectory.auckland.ac.nz%2Fpeople%2Fvcard%2F${upi}`;
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open(
    "GET",
    `https://dividni.com/cors/CorsProxyService.svc/proxy?url=${URL}`,
    false
  );
  xmlHttp.send(null);
  var vcard = xmlHttp.responseText;
  var num = "No Number";
  var address = "No Address";
  vcard = vcard.split(/\r?\n/);
  vcard.forEach((element) => {
    if (element.indexOf("TEL") !== -1) {
      num = element.split("VOICE:")[1];
    } else if (element.indexOf("ADR") !== -1) {
      address = "";
      let temp = element.split("WORK:;;")[1].split(",");
      temp.forEach((item) => {
        address += `${item}<br />`;
      });
    }
  });
  return [num, address];
}

//take information and display it in a pop up modal
function details(upi, id, first, last, email) {
  //check if image exists
  if (id == "undefined") {
    image = `<img
                src="https://unidirectory.auckland.ac.nz/static/g5Km3OjLZuWCA8w7PdOyS4j603aTN0QC7X2gk6kRhEs.png"
                alt="Person image"
                id = "profile"
            />`;
    console.error("no image");
  } else {
    var url = `https://unidirectory.auckland.ac.nz/people/imageraw/${upi}/${id}/biggest`;
    image = `<img
                src="${url}"
                alt="Person image"
                id = "profile"
            />`;
  }
  //make info string
  var vcard = getVcard(upi);
  var info = `<div id="info">
            <h3>${first} ${last}</h3>
            <p>Email:   <a href="mailto:${email}"><div id="space"></div>${email}</a></p>
            <p>UPI:   ${upi}</p>
            <p>Phone: ${vcard[0]}</p>
            <p>Address:<br/> ${vcard[1]}</p>
            <br />
            <a href="https://unidirectory.auckland.ac.nz/people/vcard/${upi}" download>🠗 Add Contact</a>
            </div>`;
  //add info to modal
  document.getElementById("modalContent").innerHTML = `${info} ${image}`;
  //show modal
  document.getElementById("modal").style.display = "block";
}

//close modal once clicked
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function formatData(data) {
  //create table headings
  str = `
      <tr class="row">
        <th  id="startHead" class="T0">First name</th>
        <th class="T1" >Last name</th>
        <th class="T2" >UPI</th>
        <th id="endHead" class="T3" >Email</th>
      <tr>
      <tbody>
      `;
  count = 0;
  //loop through data
  data.forEach((element) => {
    console.log(element);
    //alternate colors
    var num = 0;
    if (count % 2) {
      num = "even";
    } else {
      num = "odd";
    }
    count++;
    //create row HTML
    str += `<tr class="${num}" onclick="details('${element["profileUrl"][0]}','${element["imageId"]}', '${element["legalFirstName"]}' ,'${element["legalLastName"]}','${element["emailAddresses"][0]}')">
        <td class="T0">${element["legalFirstName"]}</td>
        <td class="T1">${element["legalLastName"]}</td>
        <td class="T2">${element["profileUrl"][0]}</td>
        <td class="T3">${element["emailAddresses"][0]}</td>
    </tr>`;
  });
  //end table and add to the document
  str += "</tbody>";
  document.getElementById("results").innerHTML = str;
}

//get api through proxy
function searchStaff() {
  // percent formatted url
  var URL =
    "https%3A%2F%2Funidirectory.auckland.ac.nz%2Frest%2Fsearch%3ForgFilter%3DMATHS";
  fetch(`https://dividni.com/cors/CorsProxyService.svc/proxy?url=${URL}`)
    .then((response) => response.json())
    .then((data) => formatData(data["list"]));
}

searchStaff();
switchHome();
