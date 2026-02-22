import { Coordinates } from "./location";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rain: number;
  condition: string;
}

export const getWeatherData = async (coords: Coordinates): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current: "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code",
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const data = await response.json();

    if (!data.current) {
      throw new Error("No weather data available");
    }

    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      rain: data.current.rain,
      condition: getWeatherCondition(data.current.weather_code),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 71 && code <= 75) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}
