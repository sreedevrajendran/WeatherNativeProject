import { TemperatureUnit } from '../types/weather';

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32;
};

/**
 * Convert Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (fahrenheit: number): number => {
    return ((fahrenheit - 32) * 5) / 9;
};

/**
 * Get temperature value based on user preference
 */
export const getTemperature = (
    tempC: number,
    tempF: number,
    unit: TemperatureUnit
): number => {
    return unit === 'celsius' ? tempC : tempF;
};

/**
 * Format temperature with unit symbol
 */
export const formatTemperature = (
    tempC: number,
    tempF: number,
    unit: TemperatureUnit
): string => {
    const temp = getTemperature(tempC, tempF, unit);
    const symbol = unit === 'celsius' ? '°C' : '°F';
    return `${Math.round(temp)}${symbol}`;
};

/**
 * Convert km/h to mph
 */
export const kmhToMph = (kmh: number): number => {
    return kmh * 0.621371;
};

/**
 * Convert mph to km/h
 */
export const mphToKmh = (mph: number): number => {
    return mph / 0.621371;
};

/**
 * Get wind speed based on user preference
 */
export const getWindSpeed = (
    windKph: number,
    windMph: number,
    unit: TemperatureUnit
): string => {
    if (unit === 'celsius') {
        return `${Math.round(windKph)} km/h`;
    }
    return `${Math.round(windMph)} mph`;
};

/**
 * Convert millibars to inches of mercury
 */
export const mbToInHg = (mb: number): number => {
    return mb * 0.02953;
};

/**
 * Get pressure based on user preference
 */
export const getPressure = (
    pressureMb: number,
    pressureIn: number,
    unit: TemperatureUnit
): string => {
    if (unit === 'celsius') {
        return `${Math.round(pressureMb)} mb`;
    }
    return `${pressureIn.toFixed(2)} inHg`;
};

/**
 * Get visibility based on user preference
 */
export const getVisibility = (
    visKm: number,
    visMiles: number,
    unit: TemperatureUnit
): string => {
    if (unit === 'celsius') {
        return `${visKm.toFixed(1)} km`;
    }
    return `${visMiles.toFixed(1)} mi`;
};

/**
 * Get precipitation based on user preference
 */
export const getPrecipitation = (
    precipMm: number,
    precipIn: number,
    unit: TemperatureUnit
): string => {
    if (unit === 'celsius') {
        return `${precipMm.toFixed(1)} mm`;
    }
    return `${precipIn.toFixed(2)} in`;
};
/**
 * Calculate Dew Point (Approximation)
 * Tdp = T - ((100 - RH)/5)
 */
export const calculateDewPoint = (
    tempC: number,
    humidity: number,
    unit: TemperatureUnit
): string => {
    const dewPointC = tempC - (100 - humidity) / 5;
    const dewPointF = (dewPointC * 9) / 5 + 32;

    if (unit === 'celsius') {
        return `${Math.round(dewPointC)}°`;
    }
    return `${Math.round(dewPointF)}°`;
};
