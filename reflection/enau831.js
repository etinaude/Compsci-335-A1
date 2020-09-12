function graph(pts) {
  console.log(pts);
  graph = `<svg id="graph"xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 400 400">
  />`;
  var max = 0;
  pts.forEach((e) => {
    if (max < e[1]) {
      max = e[1];
    }
  });
  var text_pos = 370;
  for (let i = 0; i < pts.length; i++) {
    //pts[i];
    graph += `<circle
                cx="${50 + i * 10}"
                cy="${350 - 340 * (pts[i][1] / max)}"
                r="2.0"
                fill="black"
              />
              <text 
                x="${50 + i * 10}" 
                y="${text_pos}"
                transform="rotate(90 ${50 + i * 10} ${text_pos})"
                font-size="10px"
              >
                  ${pts[i][0]}
              </text>`;
    console.log(350 - i * 10, 350 * (pts[i][1] / max));
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
      pts.push([date, total_cases]);
      str += `<tr>
                <td>${date}</td>
                <td>${total_cases}</td>
                <td>${new_cases}</td>
              </tr>`;
    }
  }
  graph(pts[pts.length-31,pts.length-1])
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
