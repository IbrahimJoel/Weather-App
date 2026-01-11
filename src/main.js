import './input.css';

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionMessage = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");
    const errorTitle = errorMessage?.querySelector('h3');
    const errorText = errorMessage?.querySelector('p');
    const feelsLikeDisplay = document.getElementById("feels-like");
    const humidityDisplay = document.getElementById("humidity");
    const windSpeedDisplay = document.getElementById("wind-speed");
    const weatherIcon = document.getElementById("weather-icon");

    const API_KEY = import.meta.env.VITE_API_KEY;

    // Input validation: limit length and sanitize
    function validateInput(city) {
        const trimmed = city.trim();
        if (!trimmed) {
            return { valid: false, error: 'Please enter a city name' };
        }
        if (trimmed.length > 100) {
            return { valid: false, error: 'City name is too long (max 100 characters)' };
        }
        // Allow letters, spaces, hyphens, and apostrophes (for city names like "Saint-Denis", "O'Fallon")
        if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
            return { valid: false, error: 'City name contains invalid characters' };
        }
        return { valid: true, value: trimmed };
    }

    // Set loading state
    function setLoading(loading) {
        if (loading) {
            getWeatherBtn.disabled = true;
            getWeatherBtn.classList.add('opacity-50', 'cursor-not-allowed');
            getWeatherBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            getWeatherBtn.disabled = false;
            getWeatherBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            getWeatherBtn.innerHTML = '<i class="fas fa-search"></i>';
        }
    }

    // Show error with custom message
    function showError(title, message) {
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        if (errorTitle) errorTitle.textContent = title || 'Error';
        if (errorText) errorText.textContent = message || 'An error occurred. Please try again.';
    }

    getWeatherBtn.addEventListener('click', async () => {
        // Validate input
        const validation = validateInput(cityInput.value);
        if (!validation.valid) {
            showError('Invalid Input', validation.error);
            return;
        }

        const city = validation.value;
        
        try {
            setLoading(true);
            const weatherData = await fetchweatherData(city);
            displayweatherData(weatherData);
        } catch (error) {
            console.error('Error fetching weather:', error);
            
            // Handle different error types
            if (error.message.includes('API Key')) {
                showError('Configuration Error', 'API key is not configured. Please set VITE_API_KEY in your .env file.');
            } else if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
                showError('Authentication Error', 'Invalid API key. Please check your .env file.');
            } else if (error.message.includes('City not found') || error.message.includes('404')) {
                showError('City Not Found', 'Please check the spelling and try again.');
            } else if (error.message.includes('Rate limit') || error.message.includes('429')) {
                showError('Rate Limit Exceeded', 'Too many requests. Please try again later.');
            } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
                showError('Network Error', 'Unable to connect. Please check your internet connection.');
            } else {
                showError('Error', error.message || 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    });

    // Allow Enter key to submit
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getWeatherBtn.click();
        }
    });

    async function fetchweatherData(city) {
        // Check if API key is configured
        if (!API_KEY || API_KEY === 'your_api_key_here') {
            throw new Error('API Key not configured. Please set VITE_API_KEY in your .env file.');
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            const response = await fetch(url);

            // Handle different HTTP status codes
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key or unauthorized');
                } else if (response.status === 404) {
                    throw new Error('City not found');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded');
                } else if (response.status >= 500) {
                    throw new Error(`Server error: ${response.status}`);
                } else {
                    throw new Error(`Request failed: ${response.status}`);
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            // Re-throw with additional context for network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Network error: Failed to fetch');
            }
            throw error;
        }
    }

    function displayweatherData(weatherData) {
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

    function updateWeatherIcon(condition) {
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
});
