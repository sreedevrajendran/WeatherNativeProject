
import { useState, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherByCoords, getWeatherByCity } from '../services/weatherApi';

export const useWeatherFetch = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Keep track of last params to enable refresh
    const [lastFetchParams, setLastFetchParams] = useState<
        { type: 'coords'; lat: number; lon: number } | { type: 'city'; city: string } | null
    >(null);

    const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherByCoords(lat, lon);
            setWeatherData(data);
            setLastFetchParams({ type: 'coords', lat, lon });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWeatherByCity = useCallback(async (city: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherByCity(city);
            setWeatherData(data);
            setLastFetchParams({ type: 'city', city });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshWeather = useCallback(async () => {
        if (!lastFetchParams) return;

        if (lastFetchParams.type === 'coords') {
            await fetchWeatherByCoords(lastFetchParams.lat, lastFetchParams.lon);
        } else {
            await fetchWeatherByCity(lastFetchParams.city);
        }
    }, [lastFetchParams, fetchWeatherByCoords, fetchWeatherByCity]);

    return {
        weatherData,
        loading,
        error,
        fetchWeatherByCoords,
        fetchWeatherByCity,
        refreshWeather,
        setWeatherData, // Exposed for manual updates if needed
    };
};
