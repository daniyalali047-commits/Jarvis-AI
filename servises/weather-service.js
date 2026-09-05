import axios from "axios";

const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search";

// Prefer countries and major cities when a name exists in several places.
function chooseLocation(results, searchText) {
	const normalizedSearch = searchText.toLowerCase();
	const exactMatches = results.filter((result) => result.name.toLowerCase() === normalizedSearch);
	const candidates = exactMatches.length ? exactMatches : results;
	const priority = { PCLI: 4, PPLC: 3, PPLA: 2, PPLA2: 1 };

	return [...candidates].sort((first, second) =>
		(priority[second.feature_code] || 0) - (priority[first.feature_code] || 0)
	)[0];
}

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
		// Resolve the name globally first, because a name can exist in many countries.
		const searchResponse = await axios.get(geocodingUrl, {
			params: {
				name: place,
				count: 10,
				language: "en",
				format: "json"
			}
		});
		const candidates = searchResponse.data.results || [];
		if (!candidates.length) {
			throw new Error(`I could not find a location named ${place}.`);
		}

		const selectedLocation = chooseLocation(candidates, place);
		// Use coordinates for the weather request so the provider cannot choose another place.
		const response = await axios.get("https://api.weatherapi.com/v1/current.json", {
			params: {
				key: apiKey,
				q: `${selectedLocation.latitude},${selectedLocation.longitude}`,
				aqi: "no"
			}
		});

		// Pick only the fields the Jarvis app needs instead of returning everything.
		const { location: foundLocation, current } = response.data;
		return {
			// Use the geocoder's selected label, not a nearby name chosen by WeatherAPI.
			location: selectedLocation.name,
			country: selectedLocation.country,
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
		throw new Error(providerMessage || error.message || "The weather service is unavailable.");
	}
}

export default getWeather;
