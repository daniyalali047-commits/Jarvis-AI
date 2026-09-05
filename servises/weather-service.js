import axios from "axios";

// Get current weather for a city or country from WeatherAPI.
async function getWeather(location) {
	// The API key stays on the server and is loaded from .env.
	const apiKey = process.env.WEATHER_API_KEY;
	if (!apiKey) {
		throw new Error("WEATHER_API_KEY is not configured in .env");
	}

	const place = typeof location === "string" ? location.trim() : "";
	if (!place) {
		throw new Error("A city or country is required.");
	}

	try {
		// WeatherAPI uses the location name to find the correct coordinates.
		const response = await axios.get("https://api.weatherapi.com/v1/current.json", {
			params: {
				key: apiKey,
				q: place,
				aqi: "no"
			}
		});

		// Pick only the fields the Jarvis app needs instead of returning everything.
		const { location: foundLocation, current } = response.data;
		return {
			location: foundLocation.name,
			country: foundLocation.country,
			localTime: foundLocation.localtime,
			temperatureC: current.temp_c,
			feelsLikeC: current.feelslike_c,
			condition: current.condition.text,
			humidity: current.humidity,
			windKph: current.wind_kph
		};
	} catch (error) {
		// Show the provider's useful message when it gives one.
		const providerMessage = error.response?.data?.error?.message;
		throw new Error(providerMessage || "The weather service is unavailable.");
	}
}

export default getWeather;
