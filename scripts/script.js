// replace with your OpenWeatherMap API key or any other api key
const apiKey = 'your_api_key';

// it is a function to fetch weather data
async function getWeather() {
    const location = document.getElementById('locationInput').value;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    try {
        // it fetches current weather data
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        if (!currentWeatherResponse.ok) {
            throw new Error('Network response is not ok ' + currentWeatherResponse.statusText);
        }
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        //it fetches forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Network response is not ok ' + forecastResponse.statusText);
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('There is a problem with your fetch operation:', error);
    }
}

// it is function to get weather icon URL
function getWeatherIcon(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// it is function to display current weather data
function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    const weatherDescription = data.weather[0].description;
    const weatherIcon = getWeatherIcon(data.weather[0].icon);
    const weatherHTML = `
        <h2 style="font-weight:800; font-size:30px;">Current Weather in ${data.name}</h2>
        <img src="${weatherIcon}" alt="${weatherDescription}">
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${weatherDescription}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeatherDiv.innerHTML = weatherHTML;
    currentWeatherDiv.style.display = 'block';
	currentWeatherDiv.style.textAlign = 'center';
	currentWeather.style.backgroundColor='grey';
}

// it is a function to display forecast data
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<h2 style="font-weight:800; font-size:30px;">5-Days Forecast for ${data.city.name}</h2>`;

    // Group the forecast data by day
    const forecastByDay = {};
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toDateString();
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(forecast);
    });

    // it displays forecast data
    for (const [date, forecasts] of Object.entries(forecastByDay)) {
        const dayHigh = Math.max(...forecasts.map(f => f.main.temp_max));
        const dayLow = Math.min(...forecasts.map(f => f.main.temp_min));
        const weatherDescription = forecasts[0].weather[0].description;
        const weatherIcon = getWeatherIcon(forecasts[0].weather[0].icon);

        const weatherHTML = `
            <div class="weather-day">
                <h3>${date}</h3>
                <img src="${weatherIcon}" alt="${weatherDescription}">
                <p>High: ${dayHigh} °C</p>
                <p>Low: ${dayLow} °C</p>
                <p>Weather: ${weatherDescription}</p>
            </div>
        <br><br>`;
        forecastDiv.innerHTML += weatherHTML;
    }
    forecastDiv.style.display = 'inline-block';
	forecastDiv.style.textAlign = 'center';
	forecast.style.backgroundColor='grey';
}
