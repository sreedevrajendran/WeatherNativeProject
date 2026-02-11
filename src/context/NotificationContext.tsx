import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    requestNotificationPermissions,
    startLocationTracking,
    stopLocationTracking,
    isLocationTrackingActive,
    syncNotificationSchedules,
} from '../services/notificationService';

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
        checkTrackingStatus();
    }, []);

    const checkTrackingStatus = async () => {
        const isActive = await isLocationTrackingActive();
        setLocationTrackingEnabled(isActive);
        setNotificationsEnabled(isActive);
    };

    const enableNotifications = async (): Promise<boolean> => {
        try {
            // 1. Request notification permissions
            const notifPermission = await requestNotificationPermissions();
            if (!notifPermission) {
                return false;
            }

            // 2. Enable notifications state immediately (so UI updates)
            setNotificationsEnabled(true);

            // 3. Schedule detailed notifications (Daily/Tomorrow) - Independent of location tracking
            await syncNotificationSchedules();

            // 4. Start background location tracking (Best effort)
            // This is needed for "Severe Weather" and "Rain/Snow" alerts
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
            // If we set enabled=true but hit a critical error, maybe revert?
            setNotificationsEnabled(false);
            return false;
        }
    };

    const disableNotifications = async () => {
        try {
            await stopLocationTracking();
            setNotificationsEnabled(false);
            setLocationTrackingEnabled(false);
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
