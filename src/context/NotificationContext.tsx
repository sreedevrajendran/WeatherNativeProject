import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    requestNotificationPermissions,
    startLocationTracking,
    stopLocationTracking,
    isLocationTrackingActive,
    syncNotificationSchedules,
} from '../services/notificationService';

const NOTIF_KEY = '@notifications_enabled';

interface NotificationContextType {
    notificationsEnabled: boolean;
    locationTrackingEnabled: boolean;
    enableNotifications: () => Promise<boolean>;
    disableNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);

    useEffect(() => {
        loadState();
    }, []);

    const loadState = async () => {
        try {
            // Load persistent preference
            const stored = await AsyncStorage.getItem(NOTIF_KEY);

            // Check actual tracking status
            const trackingActive = await isLocationTrackingActive();
            setLocationTrackingEnabled(trackingActive);

            if (stored !== null) {
                // Restore user preference
                setNotificationsEnabled(JSON.parse(stored));
            } else {
                // First run or no preference: default to tracking status
                setNotificationsEnabled(trackingActive);
            }
        } catch (e) {
            console.error('Failed to load notification state', e);
        }
    };

    const enableNotifications = async (): Promise<boolean> => {
        try {
            // 1. Request notification permissions
            const notifPermission = await requestNotificationPermissions();
            if (!notifPermission) return false;

            // 2. Enable notifications state immediately (so UI updates)
            setNotificationsEnabled(true);
            await AsyncStorage.setItem(NOTIF_KEY, 'true');

            // 3. Schedule detailed notifications
            await syncNotificationSchedules();

            // 4. Start background location tracking (Best effort)
            const trackingStarted = await startLocationTracking();
            setLocationTrackingEnabled(trackingStarted);

            if (!trackingStarted) {
                console.log('Background location tracking failed or denied. Only scheduled content will work.');
            }

            return true;
        } catch (error: any) {
            console.error('Error enabling notifications:', error);
            if (error?.message?.includes('expo-notifications') || error?.toString().includes('expo-notifications')) {
                Alert.alert('Not Supported', 'Push notifications are not fully supported in Expo Go on Android. Please use a development build.');
            }
            setNotificationsEnabled(false);
            await AsyncStorage.setItem(NOTIF_KEY, 'false');
            return false;
        }
    };

    const disableNotifications = async () => {
        try {
            await stopLocationTracking();
            setNotificationsEnabled(false);
            setLocationTrackingEnabled(false);
            await AsyncStorage.setItem(NOTIF_KEY, 'false');
        } catch (error) {
            console.error('Error disabling notifications:', error);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notificationsEnabled,
                locationTrackingEnabled,
                enableNotifications,
                disableNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            'useNotifications must be used within NotificationProvider'
        );
    }
    return context;
};
