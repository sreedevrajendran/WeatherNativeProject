
import React, { useEffect, useCallback } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useWeatherFetch } from '../../hooks/useWeatherFetch';
import { SavedLocation } from '../../types/weather';
import { WeatherView } from './WeatherView';

const { width } = Dimensions.get('window');

interface SavedLocationPageProps {
    location: SavedLocation;
    navigation: any;
    isActive: boolean;
}

export const SavedLocationPage: React.FC<SavedLocationPageProps> = ({
    location,
    navigation,
    isActive
}) => {
    const {
        weatherData,
        loading,
        error,
        fetchWeatherByCoords,
        refreshWeather
    } = useWeatherFetch();

    // Fetch data on mount
    useEffect(() => {
        fetchWeatherByCoords(location.lat, location.lon);
    }, [location.lat, location.lon, fetchWeatherByCoords]);

    // Optional: Refresh when screen becomes active if stale?
    // For now simple fetch on mount.

    return (
        <View style={styles.page}>
            <WeatherView
                weatherData={weatherData}
                loading={loading}
                error={error}
                onRefresh={refreshWeather}
                navigation={navigation}
                isCurrentLocationPage={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        width: width,
        flex: 1,
    }
});
