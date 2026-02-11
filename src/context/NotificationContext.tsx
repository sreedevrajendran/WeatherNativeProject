import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    requestNotificationPermissions,
    startLocationTracking,
    stopLocationTracking,
    isLocationTrackingActive,
    sendTestNotification,
} from '../services/notificationService';

interface NotificationContextType {
    notificationsEnabled: boolean;
    locationTrackingEnabled: boolean;
    enableNotifications: () => Promise<boolean>;
    disableNotifications: () => Promise<void>;
    sendTest: () => Promise<void>;
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
            // Check if running in Expo Go on Android
            // (You might import Constants from expo-constants to check appOwnership if needed,
            // but a try-catch is often robust enough for the "removed" error)

            // Request notification permissions
            const notifPermission = await requestNotificationPermissions();
            if (!notifPermission) {
                return false;
            }

            // Start background location tracking
            const trackingStarted = await startLocationTracking();
            if (!trackingStarted) {
                return false;
            }

            setNotificationsEnabled(true);
            setLocationTrackingEnabled(true);

            // Send test notification
            await sendTestNotification();

            return true;
        } catch (error: any) {
            console.error('Error enabling notifications:', error);
            if (error?.message?.includes('expo-notifications') || error?.toString().includes('expo-notifications')) {
                Alert.alert('Not Supported', 'Push notifications are not fully supported in Expo Go on Android. Please use a development build.');
            }
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

    const sendTest = async () => {
        await sendTestNotification();
    };

    return (
        <NotificationContext.Provider
            value={{
                notificationsEnabled,
                locationTrackingEnabled,
                enableNotifications,
                disableNotifications,
                sendTest,
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
