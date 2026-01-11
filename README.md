# Weather App

A modern weather application built with Vite and Tailwind CSS.

## Features

- Search weather by city name
- Display current temperature, feels like, humidity, and wind speed
- Dynamic weather icons based on conditions
- Beautiful gradient UI with smooth animations
- Responsive design

## Getting Started

### Prerequisites

You'll need an API key from [OpenWeatherMap](https://openweathermap.org/api). Sign up for a free account to get your API key.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenWeatherMap API key:
```
VITE_API_KEY=your_actual_api_key_here
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Environment Variables

- `VITE_API_KEY` - Your OpenWeatherMap API key (required)

### Security Notes

⚠️ **IMPORTANT:** 
- Never commit your `.env` file or share your API key publicly. The `.env` file is already included in `.gitignore`.
- If you accidentally committed an API key to the repository, **rotate it immediately**:
  1. Go to [OpenWeatherMap API Keys](https://home.openweathermap.org/api_keys)
  2. Generate a new API key
  3. Update your `.env` file with the new key
  4. Delete the old key from your OpenWeatherMap account

## Technologies

- Vite - Build tool and dev server
- Tailwind CSS - Utility-first CSS framework
- OpenWeatherMap API - Weather data
