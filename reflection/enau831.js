function graph(pts) {
  console.log(pts);
  var width = 500;
  var height = 500;
  var graph = `<svg class="graph"xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width + 100} ${height + 100} ">
  />`;
  var max = 0;
  var Nmax = 0;
  pts.forEach((e) => {
    if (max < e[1]) {
      max = e[1];
    }
    if (Nmax < e[2]) {
      Nmax = e[2];
    }
  });
  var count = 0;
  for (let i = 0; i < height; i += height / 11) {
    graph += `<line 
    x1="${50}" 
              y1="${10 + i}" 
              x2="${width + 50}" 
              y2="${10 + i}" 
              style="stroke:rgb(220,220,255);stroke-width:1" />
              
              <text 
              x="${30}" 
              y="${i + 15}"
              font-size="10px"
              style="fill:rgb(10,10,60);"
              >
              ${Math.round(Nmax - (Nmax * count) / 11)}
              </text>
              <text 
              x="${width + 60}" 
              y="${i + 15}"
              font-size="10px"
              style="fill:rgb(50,50,200);"
              >
              ${Math.round(max - (max * count) / 11)}
              </text>`;
    count++;
  }
  for (let i = 0; i < pts.length; i++) {
    if (i < pts.length - 1) {
      //new
      graph += `<line 
                x1="${50 + (i * width) / pts.length}" 
                y1="${10 + height - height * (pts[i][2] / Nmax)}" 
                x2="${50 + ((i + 1) * width) / pts.length}" 
                y2="${10 + height - height * (pts[i + 1][2] / Nmax)}" 
                style="stroke:rgb(10,10,60);stroke-width:2" />`;
      //totals
      graph += `<line 
                x1="${50 + (i * width) / pts.length}" 
                y1="${10 + height - height * (pts[i][1] / max)}" 
                x2="${50 + ((i + 1) * width) / pts.length}" 
                y2="${10 + height - height * (pts[i + 1][1] / max)}" 
                style="stroke:rgb(50,50,200);stroke-width:2" />`;
    }
    if (!(i % 10)) {
      graph += `
              <text 
                x="${50 + (i * width) / pts.length}" 
                y="${height + 30}"
                transform="rotate(90 ${50 + (i * width) / pts.length} ${
        height + 30
      })"
                font-size="10px"
              >
                  ${pts[i][0]}
              </text>`;
    }
  }
  graph += `<text 
              x="${width / 2 + 50}" 
              y="${height + 80}"
              font-size="20px"
              style="fill:rgb(50,50,200);"
              >
                Total Cases
            </text>
            <text 
              x="${width / 2 - 60}" 
              y="${height + 80}"
              font-size="20px"
              style="fill:rgb(10,10,60);"
              >
                New Cases
            </text>`;
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
