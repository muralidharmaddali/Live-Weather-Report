document.addEventListener('DOMContentLoaded', (event) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);// current wheather location coordinates
        },() => {
            getWeatherByCity('Delhi');
        });
    } else {
        getWeatherByCity('Delhi');
    }
});
async function getWeather() {
    const city = document.getElementById('cityInput').value;//it get input city name from the user
    getWeatherByCity(city);
}

async function getWeatherByCity(city) {         //wheather get by city name
    const apiKey = '40d1b50f80e113409513565d5633e706'; //openweathermap api key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {               //it handles the errors in weather data
        console.error('Error fetching weather data:', error);
    }
}

 async function getWeatherByCoords(lat, lon) {   // weather get by latitude & longitude
     const apiKey = '40d1b50f80e113409513565d5633e706'; 
     const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
     const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

     try {
         const currentWeatherResponse = await fetch(currentWeatherUrl);
         const currentWeatherData = await currentWeatherResponse.json();
         displayCurrentWeather(currentWeatherData);
         const forecastResponse = await fetch(forecastUrl);
         const forecastData = await forecastResponse.json();
         displayForecast(forecastData);
     } catch (error) {
         console.error('Error fetching weather data:', error);
     }
 }
// the function shows the current weather conditions in the city
function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('currentWeather');
    weatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Condition: ${data.weather[0].description}</p>  
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Date and Time: ${new Date(data.dt * 1000).toLocaleString()}</p>
    `;
}

function displayForecast(data) {
    const labels = [];
    const temps = [];
    const humidities = [];
    const conditions = [];
    const windspeed=[];

    data.list.forEach(item => {
        labels.push(new Date(item.dt * 1000).toLocaleDateString());//it shows the date 
        temps.push(item.main.temp);
        humidities.push(item.main.humidity);
        conditions.push(item.weather[0].description);
        windspeed.push(item.wind.speed);
    });

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',// it can helps to change our visualization view
        data: {
            labels: labels,
            datasets: [//visualizing the datasets of temperature, humidity, windspeed
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(10,125,122,1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(13, 12, 255, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Windspeed (m/s)',
                    data: windspeed,
                    borderColor: 'rgba(196,108,248,1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
