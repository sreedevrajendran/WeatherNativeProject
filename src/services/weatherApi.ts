import axios from 'axios';
import { WeatherData } from '../types/weather';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Get current weather and forecast for coordinates
 */
export const getWeatherByCoords = async (
    lat: number,
    lon: number
): Promise<WeatherData> => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: `${lat},${lon}`,
                days: 7,
                aqi: 'yes',
                alerts: 'yes',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather by coords:', error);
        throw new Error('Failed to fetch weather data');
    }
};

/**
 * Get weather by city name
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: city,
                days: 7,
                aqi: 'yes',
                alerts: 'yes',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather by city:', error);
        throw new Error('Failed to fetch weather data');
    }
};

/**
 * Search for cities (autocomplete)
 */
export const searchCities = async (
    query: string
): Promise<Array<{ id: number; name: string; region: string; country: string; lat: number; lon: number }>> => {
    try {
        if (query.length < 3) return [];

        const response = await axios.get(`${BASE_URL}/search.json`, {
            params: {
                key: API_KEY,
                q: query,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching cities:', error);
        return [];
    }
};

/**
 * Get hourly forecast (24 hours)
 */
export const getHourlyForecast = (weatherData: WeatherData) => {
    const today = weatherData.forecast.forecastday[0];
    const tomorrow = weatherData.forecast.forecastday[1];

    if (!today || !tomorrow) return [];

    const currentHour = new Date().getHours();
    const todayHours = today.hour.slice(currentHour);
    const tomorrowHours = tomorrow.hour.slice(0, 24 - todayHours.length);

    return [...todayHours, ...tomorrowHours];
};
