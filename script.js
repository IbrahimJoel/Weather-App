document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionMessage = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");


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
    }

    function showError(){
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden')

    }

});