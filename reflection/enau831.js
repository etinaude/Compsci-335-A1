function format(info) {
  data = info.timelineitems[0];
  //console.log(data.countrytimelinedata[0]);
  console.log(data["2/28/20"]);

  for (const property in data) {
    date = property;
    new_cases = data[property]["new_daily_cases"];
    new_daily_deaths = data[property]["new_daily_deaths"];
    total_cases = data[property]["total_cases"];
    total_recoveries = data[property]["total_recoveries"];
    total_deaths = data[property]["total_deaths"];
    console.log(
      new_cases,
      new_daily_deaths,
      total_cases,
      total_deaths,
      total_recoveries
    );
  }
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
