// switch from home to staff and vise versa
function switchTab(tab) {
  document.getElementById("home").style.display = "none";
  document.getElementById("staff").style.display = "none";
  document.getElementById("courses").style.display = "none";
  document.getElementById("infographics").style.display = "none";
  document.getElementById(tab).style.display = "flex";
}

function getVcard(upi) {
  //get more detail contact info from Vcard
  var URL = `https%3A%2F%2Funidirectory.auckland.ac.nz%2Fpeople%2Fvcard%2F${upi}`;
  var xmlHttp = new XMLHttpRequest();
  //call via xmlHTTP to get raw html
  xmlHttp.open(
    "GET",
    `https://dividni.com/cors/CorsProxyService.svc/proxy?url=${URL}`,
    false
  );
  xmlHttp.send(null);
  //split by line
  var vcard = xmlHttp.responseText.split(/\r?\n/);

  //generate backup strings if no phone or address is found
  var num = "No Number";
  var address = "No Address";

  //loop through lines and find relevant info
  vcard.forEach((element) => {
    if (element.indexOf("TEL") !== -1) {
      num = element.split("VOICE:")[1];
    } else if (element.indexOf("ADR") !== -1) {
      address = "";

      //split address into lines
      let temp = element.split("WORK:;;")[1].split(",");
      temp.forEach((item) => {
        address += `${item}<br />`;
      });
    }
  });
  //return phone number and address
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
            <p>Phone: <a href="Tel:${vcard[0]}"> ${vcard[0]}</a></p>
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

//create course information HTML
function formatCourse(data) {
  data.forEach((element) => {
    var describe = "This course unfortunately has no available description.";
    var preR = "Please ask the science student center for the prerequisites";
    if (element.description && element.description != ".") {
      describe = element.description;
    }
    if (element.rqrmntDescr && element.rqrmntDescr != ".") {
      preR = element.rqrmntDescr;
    }
    document.getElementById(
      "courses"
    ).innerHTML += `<div onclick="getTimetable(${element.catalogNbr})" class="course">
                              <h2>${element.subject}${element.catalogNbr}:=  ${element.titleLong}</h2>        
                              <p class="requirements">${preR}</p>
                              <p class="description">${describe}</p>
                              <p class="more">Timetable ></p>
                            </div>
                            `;
  });
}

//create time table info and display it
function formatTimetable(data) {
  //this version uses a modal display for the timetable
  var info = `
  <div id="c">
  <h2>Timetable</h2>
  <div class="modalRow"><div class="collumn">`;
  var count = 0;
  data.forEach((element) => {
    i = element.meetingPatterns;
    if (i.length > 0) {
      let start = `${i[0].startTime}`;
      let end = `${i[0].endTime}`;
      //remove duplicates
      if (
        !info.includes(
          `${i[0].location}\t\t${i[0].daysOfWeek}: ${start.substring(
            0,
            5
          )} - ${end.substring(0, 5)}<br />`
        )
      )
        info += `${i[0].location}\t\t${i[0].daysOfWeek}: ${start.substring(
          0,
          5
        )} - ${end.substring(0, 5)}<br />`;
    }
    //if there is lots of content split the data into 2 collumns
    if (
      count * 2 == data.length ||
      (count * 2 + 1 == data.length && data.length > 50)
    ) {
      info += `</div><div class="collumn">`;
    }
    console.log(data.length);
    count++;
  });
  if (
    info !=
    `
  <div id="c">
  <h2 id="timehead">Timetable</h2>
  <div class="modalRow"><div class="collumn">`
  ) {
    document.getElementById(
      //add spacing and closing tags
      "modalContent"
    ).innerHTML = `${info}</div></div><br /><br /><h1></h1><h1></h1></div>`;
  } else {
    //if timetable was found create a help message
    document.getElementById("modalContent").innerHTML =
      "There is no timetable available for this course, please ask the science student center for more information.";
  }
  document.getElementById("modal").style.display = "flex";
}

//get the data for the time table from the API
function getTimetable(catalogNbr) {
  var URL = `https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2020&subject=MATHS&size=500&catalogNbr=${catalogNbr}`;
  fetch(`${URL}`)
    .then((response) => response.json())
    .then((data) => formatTimetable(data["data"]));
}

//formatting and displaying the infographics graph
function formatInfo(data) {
  document.getElementById("infographics").innerHTML = "";
  //create base SVG
  var logo = `<svg id="graph"xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 600 340">
  <style>
    .text { font: bold 30px sans-serif; }
  </style>


  <symbol id="mathLogo">
  <path
  stroke-linecap="round"
  stroke="black"
  stroke-width="4"
  fill-opacity="0"
  d="M 6.0 29.0 A 16.55 16.8 0 1 1 34.3 28.5"
  />
  <circle
    cx="20.0"
    cy="20.0"
    r="10.0"
    stroke="black"
    stroke-width="4.0"
    fill-opacity="0"
  />
  <circle cx="20.0" cy="20.0" r="2.0" fill="black" fill-opacity="1" />
  <circle cx="20.5" cy="19.5" r=".8" fill="white" fill-opacity="1" />
  <circle cx="34.2" cy="5.8" r="2.0" fill="black" fill-opacity="1" />
  <circle cx="5.8" cy="5.8" r="2.0" fill="black" fill-opacity="1" />
  <line x1="5.8" y1="5.8" x2="8.0" y2="8.0" stroke="black" stroke-width="4.0" />
  <line x1="34.5" y1="5.5" x2="32.3" y2="7.7" stroke="black" stroke-width="4.0" />
  <line x1="20.0" y1="4.0" x2="20.0" y2="9.0" stroke="black" stroke-width="4.0" />
  </symbol >`;

  var i = 0;
  data.forEach((element) => {
    logo += `<text x="0" y="${i * 50 + 25}" class="text">${i + 1}:</text>`;
    for (var j = 0; 10 * j < element; j++) {
      //if its the last element clip it else display the whole element
      if (10 * (j + 1) > element) {
        logo += `<clipPath id="clip${i}">
        <rect width="${4 * (element % 10)}" height="50" x="0" y ="0"/>
      </clipPath>`;
        logo += `<use xlink:href="#mathLogo" id="logo${j}${i}" x="${
          50 * j + 50
        }" y="${50 * i}" style="clip-path: url(#clip${i});"/>`;
      } else {
        logo += `<use xlink:href="#mathLogo" id="logo${j}${i}" x="${
          50 * j + 50
        }" y="${50 * i}" />`;
      }
    }
    i++;
  });
  //render graph and info
  document.getElementById("infographics").innerHTML = `<br />${logo}
  </svg><br />data:<br /><b>[${data}]</b>`;
}

//get graph data from the API
function getInfographics() {
  var URL = `https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g`;
  fetch(`${URL}`)
    .then((response) => response.json())
    .then((data) => formatInfo(data));
}

//get courses data through API
function searchCourses() {
  // percent formatted url
  var URL =
    "https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=MATHS&year=2020&size=500";
  fetch(`${URL}`)
    .then((response) => response.json())
    .then((data) => formatCourse(data["data"]));
}

searchStaff();
searchCourses();
getInfographics();
switchTab("courses");
