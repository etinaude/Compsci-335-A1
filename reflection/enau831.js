function graph(pts) {
  console.log(pts);
  var width = 500;
  var height = 500;
  var graph = `<svg class="graph"xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width + 100} ${height + 100} ">
  />`;
  var max = [0, 0];
  pts.forEach((e) => {
    if (max[0] < e[1]) {
      max[0] = e[1];
    }
    if (max[1] < e[2]) {
      max[1] = e[2];
    }
  });
  var text_pos = 510;
  for (let i = 0; i < pts.length; i++) {
    if (i < pts.length - 1) {
      graph += `<line 
                x1="${50 + (i * width) / pts.length}" 
                y1="${height - 10 - height * (pts[i][2] / max[1])}" 
                x2="${50 + ((i + 1) * width) / pts.length}" 
                y2="${height - 10 - height * (pts[i + 1][2] / max[1])}" 
                style="stroke:rgb(255,0,0);stroke-width:2" />`;
      graph += `<line 
                x1="${50 + (i * width) / pts.length}" 
                y1="${height - 10 - height * (pts[i][1] / max[0])}" 
                x2="${50 + ((i + 1) * width) / pts.length}" 
                y2="${height - 10 - height * (pts[i + 1][1] / max[0])}" 
                style="stroke:rgb(0,255,0);stroke-width:2" />`;
    }
    if (!(i % 10)) {
      graph += `
              <text 
                x="${50 + (i * width) / pts.length}" 
                y="${height}"
                transform="rotate(90 ${
                  50 + (i * width) / pts.length
                } ${height})"
                font-size="10px"
              >
                  ${pts[i][0]}
              </text>`;
      graph += `
              <text 
                x="${50 + (i * width) / pts.length}" 
                y="${height}"
                transform="rotate(90 ${
                  50 + (i * width) / pts.length
                } ${height})"
                font-size="10px"
              >
                  ${pts[i][0]}
              </text>`;
    }
  }

  document.getElementById("graph").innerHTML = `${graph}</svg>`;
}

function format(info) {
  data = info.timelineitems[0];
  //console.log(data.countrytimelinedata[0]);
  //console.log(data["2/28/20"]);
  var count = 0;
  var pts = [];
  var str = `<table>
  <tr>
    <th>Date</th>
    <th>Total</th>
    <th>New</th>
  </tr>
  <tbody>`;
  for (property in data) {
    date = property;
    new_cases = data[property]["new_daily_cases"];
    new_daily_deaths = data[property]["new_daily_deaths"];
    total_cases = data[property]["total_cases"];
    total_recoveries = data[property]["total_recoveries"];
    total_deaths = data[property]["total_deaths"];
    /*console.log(
      new_cases,
      new_daily_deaths,
      total_cases,
      total_deaths,
      total_recoveries
    );*/
    if (date != "stat") {
      pts.push([date, total_cases, new_cases]);
      str += `<tr>
                <td>${date}</td>
                <td>${total_cases}</td>
                <td>${new_cases}</td>
              </tr>`;
    }
  }
  graph(pts);
  document.getElementById("data").innerHTML += `${str}</tbody></table>`;
}

let response = fetch(
  "https://api.thevirustracker.com/free-api?countryTimeline=NZ",
  {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
    }),
  }
)
  .then((response) => response.json())
  .then((data) => {
    format(data);
  });
