fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/g", {
  headers: new Headers({
    Accept: "application/json",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var width = 1;
    var size = 7;
    if (data.length <= 9) {
      width = 1.5;
      size = 10;
    } else if (data.length > 64) {
      size = 3;
    } else if (data.length > 36) {
      width = 0.5;
      size = 5;
    }
    var inc = 400 / Math.sqrt(data.length);
    var rot = 0;
    var x = 20;
    var y = 20;
    text = "HELLO";
    var graphhtml = ``;
    if (data.length < 10) {
      graphhtml = `<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 400"
                >`;
    } else {
      graphhtml = `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 450"
      >`;
    }
    coords = [];

    for (i = 0; i < Math.sqrt(data.length); i++) {
      for (j = 0; j < Math.sqrt(data.length); j++) {
        coords.push([x + Math.random() * 40, y + Math.random() * 40]);
        x += inc;
      }
      x = 20;
      y += inc;
    }
    console.log(coords);
    for (i = 0; i < data.length; i++) {
      rot += 360 / data.length;
      color = `hsl(${rot}, 100%, 50%)`;
      for (j = 0; j < data.length; j++) {
        if (data[i][j]) {
          if (i < j)
            graphhtml += `<line x1="${coords[j][0]}" y1="${coords[j][1]}" x2="${coords[i][0]}" y2="${coords[i][1]}" stroke-width="${width}px" stroke="${color}" />`;
        }
      }
    }
    rot = 0;
    for (i = 0; i < data.length; i++) {
      rot += 360 / data.length;
      color = `hsl(${rot}, 100%, 50%)`;
      text = i;
      graphhtml += `<circle fill="${color}" cx="${(x = coords[i][0])}" cy="${
        coords[i][1]
      }" r="${inc / 20}" /><text x="${coords[i][0] - 2}" y="${
        coords[i][1] + 2
      }" fill="black" font-size="${size}" font-weight="bolder">${text}</text>`;
    }
    graphhtml += "</svg>";
    graph.innerHTML = graphhtml;
    var mathtml = "<pre>&#x09[<br>";
    for (i = 0; i < data.length; i++) {
      mathtml += `(${i}).&#x09[${data[i]}]<br>`;
    }
    mat.innerHTML = `${mathtml}&#x09]</pre>`;
  });
