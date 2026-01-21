const API_KEY = "ZSBK6GQEJJR2R257EZ2CXJ825";

const input = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const weatherInfo = document.getElementById("weatherInfo");
const forecastDiv = document.getElementById("forecast");
async function getWeather(location) {
  weatherInfo.innerHTML = "Loading weather...";
  forecastDiv.innerHTML = "";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = "❌ City not found. Try again.";
  }
}

function displayWeather(data) {
  const current = data.currentConditions;
  weatherInfo.innerHTML = `
    <h2 class="city">${data.resolvedAddress}</h2>
    <div class="weather-bar">
      <span>🌡 Temperature</span>
      <strong>${Math.round(current.temp)} °C</strong>
    </div>
    <div class="weather-bar">
      <span>💨 Wind Speed</span>
      <strong>${current.windspeed} km/h</strong>
    </div>
    <div class="weather-bar">
      <span>🌧 Rain Chance</span>
      <strong>${current.precipprob ?? 0}%</strong>
    </div>
    <div class="weather-bar">
      <span>☁ Condition</span>
      <strong>${current.conditions}</strong>
    </div>
  `;
  displayHourlyForecast(data.days[0].hours);
}

function displayHourlyForecast(hours) {
  forecastDiv.innerHTML = "<h3>Next 24 Hours</h3>";
  const currentHour = new Date().getHours();
  hours.slice(currentHour, currentHour + 6).forEach(hour => {
    const div = document.createElement("div");
    div.classList.add("hour-bar");
    div.innerHTML = `
      <span>${hour.datetime.slice(0,5)}</span>
      <span>${Math.round(hour.temp)}°C</span>
      <span>${hour.conditions}</span>
    `;
    forecastDiv.appendChild(div);
  });
}
searchBtn.addEventListener("click", () => {
  const location = input.value.trim();
  if (location) getWeather(location);
});
refreshBtn.addEventListener("click", () => {
  const location = input.value.trim();
  if (location) getWeather(location);
});
navigator.geolocation.getCurrentPosition(
  position => {
    input.value = ""; 
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(`${lat},${lon}`);
  },
  () => {
     weatherInfo.innerHTML = "📍 Please enter a city to see the weather";
  }
);
