import './input.css';

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionMessage = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");
    const feelsLikeDisplay = document.getElementById("feels-like");
    const humidityDisplay = document.getElementById("humidity");
    const windSpeedDisplay = document.getElementById("wind-speed");
    const weatherIcon = document.getElementById("weather-icon");


    const API_KEY = "77670cb24955edb8599dfe0350ed8f0a";
    // env variables


    getWeatherBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim()
        if(!city) return;


        // it may throw an error
        // serve/database is always in another continent

        try {
        const weatherData = await fetchweatherData(city)
        displayweatherData(weatherData);
        } catch (error) {
            showError()
        }
    })

    async function fetchweatherData(city){
        // gets the data
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City Not found');
        }
        const data = await response.json();
        return data;
    }

    function displayweatherData(weatherData){
        // display
        weatherInfo.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        cityNameDisplay.textContent = weatherData.name;
        temperatureDisplay.textContent = `${Math.round(weatherData.main.temp)}°C`;
        descriptionMessage.textContent = weatherData.weather[0].description;
        feelsLikeDisplay.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        humidityDisplay.textContent = `${weatherData.main.humidity}%`;
        windSpeedDisplay.textContent = `${Math.round(weatherData.wind.speed * 3.6)} km/h`;
        
        // Update weather icon based on condition
        updateWeatherIcon(weatherData.weather[0].main);
    }
    
    function updateWeatherIcon(condition){
        const iconMap = {
            'Clear': 'fa-sun',
            'Clouds': 'fa-cloud',
            'Rain': 'fa-cloud-rain',
            'Drizzle': 'fa-cloud-drizzle',
            'Thunderstorm': 'fa-bolt',
            'Snow': 'fa-snowflake',
            'Mist': 'fa-smog',
            'Fog': 'fa-smog',
            'Haze': 'fa-smog'
        };
        
        const iconClass = iconMap[condition] || 'fa-cloud-sun';
        weatherIcon.innerHTML = `<i class="fas ${iconClass} animate-float"></i>`;
    }

    function showError(){
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden')

    }

});
