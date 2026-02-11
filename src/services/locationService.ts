import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedLocation } from '../types/weather';

const SAVED_LOCATIONS_KEY = '@saved_locations';

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

/**
 * Get current device location
 */
export const getCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
} | null> => {
    try {
        // 1. Request Permissions FIRST (Triggers OS Dialog)
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.log('Location permission denied');
            return null;
        }

        // 2. Check if Enabled
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
            console.log('Location services are disabled');
            return null;
        }

        // 3. Get accurate location
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error('Error getting current location:', error);
        return null;
    }
};

/**
 * Save a location to favorites
 */
export const saveLocation = async (location: SavedLocation): Promise<void> => {
    try {
        const existing = await getSavedLocations();
        const updated = [...existing, location];
        await AsyncStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving location:', error);
        throw new Error('Failed to save location');
    }
};

/**
 * Get all saved locations
 */
export const getSavedLocations = async (): Promise<SavedLocation[]> => {
    try {
        const data = await AsyncStorage.getItem(SAVED_LOCATIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting saved locations:', error);
        return [];
    }
};

/**
 * Remove a saved location
 */
export const removeSavedLocation = async (id: string): Promise<void> => {
    try {
        const existing = await getSavedLocations();
        const updated = existing.filter((loc) => loc.id !== id);
        await AsyncStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error removing saved location:', error);
        throw new Error('Failed to remove location');
    }
};

/**
 * Check if a location is saved
 */
export const isLocationSaved = async (
    lat: number,
    lon: number
): Promise<boolean> => {
    try {
        const saved = await getSavedLocations();
        return saved.some(
            (loc) =>
                Math.abs(loc.lat - lat) < 0.01 && Math.abs(loc.lon - lon) < 0.01
        );
    } catch (error) {
        console.error('Error checking if location is saved:', error);
        return false;
    }
};
