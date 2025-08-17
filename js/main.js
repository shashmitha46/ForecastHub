document.addEventListener("DOMContentLoaded", () => {
  fetch("city_coordinates.csv")
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split("\n");
      const headers = lines[0].split(",");
      const cityDropdown = document.getElementById("city");

      cityDropdown.innerHTML = ""; // Clear loading

      lines.slice(1).forEach(line => {
        const values = line.split(",");

        // Get values based on headers (safer approach)
        const city = values[headers.indexOf("city")];
        const country = values[headers.indexOf("country")];
        const lat = values[headers.indexOf("latitude")];
        const lon = values[headers.indexOf("longitude")];

        const option = document.createElement("option");
        option.value = `${lat},${lon}`;
        option.textContent = `${city}, ${country}`;
        cityDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("CSV loading error:", error);
      document.getElementById("city").innerHTML =
        "<option value=''>Failed to load cities</option>";
    });

  window.unit = "celcius"; // default

  select.addEventListener("change", fetchWeather);
});

function fetchWeather() {
  const [lat, lon] = document.getElementById("city-select").value.split(",");
  const output = document.getElementById("weather-output");
  const prod = "civil";
  const units = "metric"; // we’ll convert if needed

  fetch(`http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=${prod}&output=json`)
    .then(res => res.json())
    .then(data => {
      if (!data.dataseries) {
        output.textContent = "No data available.";
        return;
      }
      const day = data.dataseries[0];
      let min = day.temp2m.min, max = day.temp2m.max;
      
      if (unit === "fahrenheit") {
        min = (min * 9/5) + 32;
        max = (max * 9/5) + 32;
      }
      output.innerHTML = `
        <p><strong>Date:</strong> ${formatDate(day.date)}</p>
        <p><strong>Temp:</strong> ${min.toFixed(1)}° ${unit === "celcius" ? "C" : "F"} – ${max.toFixed(1)}°</p>
        <p><strong>Weather:</strong> ${day.weather}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      output.textContent = "Error loading weather.";
    });
}

function formatDate(dateInt) {
  const s = dateInt.toString();
  return `${s.substr(6,2)}/${s.substr(4,2)}/${s.substr(0,4)}`;
}
