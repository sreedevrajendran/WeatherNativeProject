import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncNotificationSchedules } from '../services/notificationService';
import {
    UserSettings,
    TemperatureUnit,
    WidgetVisibility,
    ActivityPreferences,
    SavedLocation,
} from '../types/weather';

const SETTINGS_KEY = '@user_settings';

const defaultSettings: UserSettings = {
    temperatureUnit: 'celsius',
    widgetVisibility: {
        feelsLike: true,
        wind: true,
        humidity: true,
        uv: true, // Top 4 most wanted
        pressure: false,
        visibility: false,
        precipitation: false,
        aqi: false,
        dewPoint: false,
        sunset: false,
        sunrise: false,
        moonPhase: false,
        cloudiness: false,
    },
    activityPreferences: {
        driving: true, // Daily essential
        running: true, // Common fitness
        hiking: false,
        cycling: false,
        fishing: false,
        gardening: false,
        stargazing: false,
        bbq: false,
    },
    notificationPreferences: {
        dailyForecast: true,
        tomorrowForecast: true,
        weeklyForecast: true,
        severeWeather: true,
        rainSnowAlerts: true,
    },
    newsEnabled: true,
    forecastInterval: 1,
    savedLocations: [],
};

interface SettingsContextType {
    settings: UserSettings;
    updateTemperatureUnit: (unit: TemperatureUnit) => void;
    updateWidgetVisibility: (widget: keyof WidgetVisibility, visible: boolean) => void;
    updateActivityPreference: (activity: keyof ActivityPreferences, enabled: boolean) => void;
    updateForecastInterval: (interval: 1 | 2 | 3) => void;
    addSavedLocation: (location: SavedLocation) => void;
    removeSavedLocation: (id: string) => void;
    updateNotificationPreference: (type: keyof import('../types/weather').NotificationPreferences, enabled: boolean) => void;
    toggleNews: (enabled: boolean) => void;
    updateAboutContent: (content: string) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);

    // Load settings from AsyncStorage on mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Save settings to AsyncStorage whenever they change
    useEffect(() => {
        saveSettings();
    }, [settings]);

    const loadSettings = async () => {
        try {
            const data = await AsyncStorage.getItem(SETTINGS_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                // Merge with default settings to ensure new fields are present
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            // Sync background notification schedules whenever settings change
            await syncNotificationSchedules();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const updateTemperatureUnit = (unit: TemperatureUnit) => {
        setSettings((prev) => ({ ...prev, temperatureUnit: unit }));
    };

    const updateWidgetVisibility = (
        widget: keyof WidgetVisibility,
        visible: boolean
    ) => {
        setSettings((prev) => ({
            ...prev,
            widgetVisibility: {
                ...prev.widgetVisibility,
                [widget]: visible,
            },
        }));
    };

    const updateActivityPreference = (
        activity: keyof ActivityPreferences,
        enabled: boolean
    ) => {
        setSettings((prev) => ({
            ...prev,
            activityPreferences: {
                ...prev.activityPreferences,
                [activity]: enabled,
            },
        }));
    };

    const updateForecastInterval = (interval: 1 | 2 | 3) => {
        setSettings((prev) => ({ ...prev, forecastInterval: interval }));
    };

    const addSavedLocation = (location: SavedLocation) => {
        setSettings((prev) => ({
            ...prev,
            savedLocations: [...prev.savedLocations, location],
        }));
    };

    const removeSavedLocation = (id: string) => {
        setSettings((prev) => ({
            ...prev,
            savedLocations: prev.savedLocations.filter((loc) => loc.id !== id),
        }));
    };

    const updateNotificationPreference = (
        type: keyof import('../types/weather').NotificationPreferences,
        enabled: boolean
    ) => {
        setSettings((prev) => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [type]: enabled,
            },
        }));
    };

    const toggleNews = (enabled: boolean) => {
        setSettings((prev) => ({ ...prev, newsEnabled: enabled }));
    };

    const updateAboutContent = (content: string) => {
        setSettings((prev) => ({ ...prev, aboutContent: content }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateTemperatureUnit,
                updateWidgetVisibility,
                updateActivityPreference,
                updateForecastInterval,
                addSavedLocation,
                removeSavedLocation,
                updateNotificationPreference,
                toggleNews,
                updateAboutContent,
                resetSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
