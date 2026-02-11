import React, { createContext, useState, useContext, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherByCoords, getWeatherByCity } from '../services/weatherApi';

interface WeatherContextType {
    weatherData: WeatherData | null;
    loading: boolean;
    error: string | null;
    fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
    fetchWeatherByCity: (city: string) => Promise<void>;
    refreshWeather: () => Promise<void>;
    clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return (
        <WeatherContext.Provider
            value={{
                weatherData,
                loading,
                error,
                fetchWeatherByCoords,
                fetchWeatherByCity,
                refreshWeather,
                clearError,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within WeatherProvider');
    }
    return context;
};
