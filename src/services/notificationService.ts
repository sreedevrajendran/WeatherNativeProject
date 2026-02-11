import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCoords } from './weatherApi';
import { analyzeWeather } from '../utils/weatherAnalyzer';
import { UserSettings } from '../types/weather';

const LOCATION_TASK_NAME = 'background-location-task';
const SETTINGS_KEY = '@user_settings';
const WEATHER_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Notification permission not granted');
            return false;
        }

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('weather-alerts', {
                name: 'Weather Alerts',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4A90E2',
            });
        }

        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
};

/**
 * Send a local notification
 */
export const sendWeatherNotification = async (
    title: string,
    body: string,
    data?: any
) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // Send immediately
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

/**
 * Generate AI-style weather message
 */
export const generateAIWeatherMessage = (
    weather: any,
    type: 'daily' | 'tomorrow' | 'weekly' | 'alert'
): string => {
    const temp = Math.round(weather.temp_c);
    const condition = weather.condition.text.toLowerCase();

    const greetings = ['Good morning!', 'Heads up!', 'Weather update:', 'Forecast ready:'];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    if (type === 'daily') {
        if (condition.includes('rain')) return `${greeting} It's going to be rainy today with a high of ${temp}°C. Don't forget your umbrella! ☔`;
        if (condition.includes('clear') || condition.includes('sunny')) return `${greeting} It's a beautiful sunny day! Expect a high of ${temp}°C. Perfect for outdoor activities. ☀️`;
        if (condition.includes('cloud')) return `${greeting} Expect cloudy skies today with a high of ${temp}°C. A comfortable day overall. ☁️`;
        return `${greeting} Today's forecast: ${weather.condition.text} with a high of ${temp}°C. Have a great day!`;
    }

    if (type === 'tomorrow') {
        return `Planning for tomorrow? Expect ${weather.condition.text} with a temperature around ${temp}°C.`;
    }

    if (type === 'weekly') {
        return `Your weekly outlook is here! Check the app for the full 7-day forecast.`;
    }

    return `${weather.condition.text}: ${temp}°C`;
};

// Helper to get settings
const getStoredSettings = async (): Promise<UserSettings | null> => {
    try {
        const data = await AsyncStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading settings in background:', error);
        return null;
    }
};

/**
 * Sync recurring notifications based on settings
 */
export const syncNotificationSchedules = async () => {
    // Cancel existing schedules first
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
        console.log('Error cancelling notifications:', error);
    }

    const settings = await getStoredSettings();
    if (!settings) return;
    const { notificationPreferences: prefs } = settings;

    // Daily Forecast at 8:00 AM
    if (prefs.dailyForecast) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '☀️ Daily Forecast',
                    body: 'Check out your weather forecast for the day!',
                },
                trigger: {
                    hour: 8,
                    minute: 0,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log('Error scheduling daily forecast:', error);
        }
    }

    // Tomorrow's Forecast at 7:00 PM
    if (prefs.tomorrowForecast) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🌙 Tomorrow\'s Outlook',
                    body: 'See what tomorrow brings. Plan your day ahead!',
                },
                trigger: {
                    hour: 19,
                    minute: 0,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log('Error scheduling tomorrow forecast:', error);
        }
    }

    // Weekly Forecast on Sundays at 4:00 PM
    if (prefs.weeklyForecast) {
        try {
            // Android doesn't support 'weekday' in repeating calendar triggers in the same way.
            // We skip scheduling this specific weekly alert on Android to prevent crashes.
            if (Platform.OS === 'ios') {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: '📅 Weekly Weather Ahead',
                        body: 'Your 7-day weather outlook is ready. Check it out!',
                    },
                    trigger: {
                        weekday: 1, // Sunday
                        hour: 16,
                        minute: 0,
                        repeats: true,
                    },
                });
            }
        } catch (error) {
            console.log('Error scheduling weekly forecast:', error);
        }
    }
};

/**
 * Check weather and send notification if needed
 */
const checkWeatherAndNotify = async (latitude: number, longitude: number) => {
    try {
        const weatherData = await getWeatherByCoords(latitude, longitude);
        const alert = analyzeWeather(weatherData.current);

        const settings = await getStoredSettings();
        const prefs = settings?.notificationPreferences;

        // Default to true if settings aren't loaded yet (safety fallback), or false?
        // Better to default to false or true? If background runs before any settings saved?
        // Default settings has them true. So if settings is null, we might want to assume defaults?
        // But getStoredSettings returns null if error or empty. 
        // Let's assume strict checking: if no settings, no alerts (safe).

        // Send notification for severe or caution alerts
        if (alert?.level === 'severe' && prefs?.severeWeather) {
            await sendWeatherNotification(
                '⚠️ Severe Weather Alert',
                `${weatherData.location.name}: ${alert.message}`,
                { location: weatherData.location.name, alert: alert.level }
            );
        } else if (alert?.level === 'caution' && prefs?.rainSnowAlerts) {
            // Logic for rain/snow specific alerts could go here
            const condition = weatherData.current.condition.text.toLowerCase();
            if (condition.includes('rain') || condition.includes('snow')) {
                await sendWeatherNotification(
                    `🌨️ ${weatherData.current.condition.text} Alert`,
                    `It's ${condition} in ${weatherData.location.name}. Stay dry!`,
                    { type: 'precipitation' }
                );
            }
        }

        // Store last check time
        const lastCheck = new Date().getTime();
        return lastCheck;
    } catch (error) {
        console.error('Error checking weather:', error);
        return null;
    }
};

/**
 * Define background location task
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }

    if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
            // Check if enough time has passed since last check
            const lastCheck = await getLastWeatherCheck();
            const now = new Date().getTime();

            if (!lastCheck || now - lastCheck > WEATHER_CHECK_INTERVAL) {
                await checkWeatherAndNotify(
                    location.coords.latitude,
                    location.coords.longitude
                );
                await saveLastWeatherCheck(now);
            }
        }
    }
});

/**
 * Start background location tracking
 */
export const startLocationTracking = async (): Promise<boolean> => {
    try {
        // Request location permissions
        const { status: foregroundStatus } =
            await Location.requestForegroundPermissionsAsync();

        if (foregroundStatus !== 'granted') {
            console.log('Foreground location permission not granted');
            return false;
        }

        const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync();

        if (backgroundStatus !== 'granted') {
            console.log('Background location permission not granted');
            return false;
        }

        // Start location tracking
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: WEATHER_CHECK_INTERVAL,
            distanceInterval: 5000, // 5km
            foregroundService: {
                notificationTitle: 'Weather Tracking',
                notificationBody: 'Monitoring weather at your location',
                notificationColor: '#4A90E2',
            },
        });

        // Also schedule the recurrent notifications
        await syncNotificationSchedules();

        console.log('Background location tracking started');
        return true;
    } catch (error) {
        console.error('Error starting location tracking:', error);
        return false;
    }
};

/**
 * Stop background location tracking
 */
export const stopLocationTracking = async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(
            LOCATION_TASK_NAME
        );
        if (isRegistered) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log('Background location tracking stopped');
        }

        // Cancel all scheduled notifications when tracking is stopped/notifications disabled
        await Notifications.cancelAllScheduledNotificationsAsync();

    } catch (error) {
        console.error('Error stopping location tracking:', error);
    }
};

/**
 * Check if location tracking is active
 */
export const isLocationTrackingActive = async (): Promise<boolean> => {
    try {
        return await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    } catch (error) {
        console.error('Error checking location tracking status:', error);
        return false;
    }
};

/**
 * Helper functions for storing last check time
 */
let lastWeatherCheckTime: number | null = null;

const getLastWeatherCheck = async (): Promise<number | null> => {
    return lastWeatherCheckTime;
};

const saveLastWeatherCheck = async (time: number) => {
    lastWeatherCheckTime = time;
};


