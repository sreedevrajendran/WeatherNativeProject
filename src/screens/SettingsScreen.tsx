import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
    Linking,
} from 'react-native';
import { X, Trash2, MapPin, ChevronRight, Zap, CloudRain, Bell, Info } from 'lucide-react-native';
import { WeatherBackground } from '../components/ui/WeatherBackground';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';
import { useWeather } from '../context/WeatherContext';
import { SettingsSection } from '../components/settings/SettingsSection';
import * as Location from 'expo-location';
import { getCurrentLocation, requestLocationPermission } from '../services/locationService';
import { WidgetVisibility, ActivityPreferences, NotificationPreferences } from '../types/weather';

interface SettingsScreenProps {
    navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { weatherData, fetchWeatherByCoords } = useWeather();
    const {
        settings,
        updateTemperatureUnit,
        updateWidgetVisibility,
        updateActivityPreference,
        updateForecastInterval,
        removeSavedLocation,
        updateNotificationPreference,
        toggleNews,
        resetSettings,
    } = useSettings();

    const {
        notificationsEnabled,
        enableNotifications,
        disableNotifications,
    } = useNotifications();

    const [isEnabling, setIsEnabling] = useState(false);
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

    // AI Contents
    const [aboutContent, setAboutContent] = useState('');

    useEffect(() => {
        checkLocationStatus();
        // Set About content for Aqu Weather
        setAboutContent("Aqu Weather delivers precise, hyper-local forecasts wrapped in a beautiful interface. Plan your activities with confidence using our real-time updates, smart suggestions, and detailed atmospheric insights. Designed for Clarity. Built for You. V1.0.0");
    }, []);

    const checkLocationStatus = async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            const serviceEnabled = await Location.hasServicesEnabledAsync();
            setIsLocationEnabled(status === 'granted' && serviceEnabled);
        } catch (e) {
            console.log('Error checking location status:', e);
        }
    };

    const toggleLocation = async (value: boolean) => {
        if (value) {
            const loc = await getCurrentLocation();
            if (loc) {
                setIsLocationEnabled(true);
                fetchWeatherByCoords(loc.latitude, loc.longitude);
                Alert.alert("Location Enabled", "Updating weather for your current location.");
            } else {
                setIsLocationEnabled(false);
                Alert.alert(
                    "Location Access Failed",
                    "Could not access location. Please enable GPS and allow permissions in settings.",
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } else {
            setIsLocationEnabled(false);
        }
    };

    const handleNotificationToggle = async (value: boolean) => {
        if (value) {
            setIsEnabling(true);
            const success = await enableNotifications();
            setIsEnabling(false);

            if (!success) {
                Alert.alert(
                    'Permission Required',
                    'Please enable location and notification permissions in your device settings.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            await disableNotifications();
        }
    };

    const formatSettingName = (key: string) => {
        // Handle special cases
        const special: Record<string, string> = {
            uv: 'UV Index',
            aqi: 'Air Quality',
            feelsLike: 'Feels Like',
            dewPoint: 'Dew Point',
            moonPhase: 'Moon Phase',
            bbq: 'BBQ',
        };
        if (special[key]) return special[key];
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <WeatherBackground
            condition={weatherData?.current.condition.text}
            isDay={weatherData?.current.is_day === 1}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (!isNavigating) {
                                setIsNavigating(true);
                                navigation.goBack();
                            }
                        }}
                        style={styles.closeButton}
                    >
                        <X size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Location Section */}
                    <SettingsSection title="Location">
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Use Current Location</Text>
                                    <Text style={styles.sublabel}>Enable GPS for local weather</Text>
                                </View>
                                <Switch
                                    value={isLocationEnabled}
                                    onValueChange={toggleLocation}
                                    trackColor={{ false: '#334155', true: '#3B82F6' }}
                                    thumbColor="#F8FAFC"
                                />
                            </View>
                        </View>

                        {settings.savedLocations.length > 0 && (
                            <View style={styles.savedList}>
                                {settings.savedLocations.map((location, index) => (
                                    <View key={location.id} style={[styles.locationRow, index !== settings.savedLocations.length - 1 && styles.borderBottom]}>
                                        <Text style={styles.locationName}>{location.name}</Text>
                                        <TouchableOpacity onPress={() => removeSavedLocation(location.id)}>
                                            <Trash2 size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </SettingsSection>

                    {/* Weather Units */}
                    <SettingsSection title="Weather Units">
                        <View style={styles.card}>
                            <View style={styles.segmentContainer}>
                                <TouchableOpacity
                                    style={[styles.segmentButton, settings.temperatureUnit === 'celsius' && styles.segmentActive]}
                                    onPress={() => updateTemperatureUnit('celsius')}
                                >
                                    <Text style={[styles.segmentText, settings.temperatureUnit === 'celsius' && styles.segmentTextActive]}>Celsius (°C)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segmentButton, settings.temperatureUnit === 'fahrenheit' && styles.segmentActive]}
                                    onPress={() => updateTemperatureUnit('fahrenheit')}
                                >
                                    <Text style={[styles.segmentText, settings.temperatureUnit === 'fahrenheit' && styles.segmentTextActive]}>Fahrenheit (°F)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segmentButton, settings.temperatureUnit === 'system' && styles.segmentActive]}
                                    onPress={() => updateTemperatureUnit('system')}
                                >
                                    <Text style={[styles.segmentText, settings.temperatureUnit === 'system' && styles.segmentTextActive]}>Regional</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SettingsSection>

                    {/* Forecast Update Period */}
                    <SettingsSection title="Forecast Update Period">
                        <View style={styles.card}>
                            <View style={styles.segmentContainer}>
                                {[1, 2, 3].map((val) => (
                                    <TouchableOpacity
                                        key={val}
                                        style={[
                                            styles.segmentButton,
                                            settings.forecastInterval === val && styles.segmentActive
                                        ]}
                                        onPress={() => updateForecastInterval(val as 1 | 2 | 3)}
                                    >
                                        <Text style={[
                                            styles.segmentText,
                                            settings.forecastInterval === val && styles.segmentTextActive
                                        ]}>
                                            {val} Hr {val === 1 ? '(Default)' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </SettingsSection>

                    {/* Weather Notifications */}
                    <SettingsSection title="Weather Notifications">
                        <View style={styles.card}>
                            {/* Master Toggle */}
                            <View style={[styles.row, styles.borderBottom]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Enable Notifications</Text>
                                    <Text style={styles.sublabel}>Allow app to send alerts</Text>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={handleNotificationToggle}
                                    disabled={isEnabling}
                                    trackColor={{ false: '#334155', true: '#3B82F6' }}
                                    thumbColor="#F8FAFC"
                                />
                            </View>

                            {/* Sub Toggles */}
                            {notificationsEnabled && (
                                <>
                                    <View style={[styles.row, styles.borderBottom]}>
                                        <Text style={styles.optionLabel}>Daily Forecast (8 AM)</Text>
                                        <Switch
                                            value={settings.notificationPreferences.dailyForecast}
                                            onValueChange={(v) => updateNotificationPreference('dailyForecast', v)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor="#F8FAFC"
                                        />
                                    </View>
                                    <View style={[styles.row, styles.borderBottom]}>
                                        <Text style={styles.optionLabel}>Tomorrow's Forecast (7 PM)</Text>
                                        <Switch
                                            value={settings.notificationPreferences.tomorrowForecast}
                                            onValueChange={(v) => updateNotificationPreference('tomorrowForecast', v)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor="#F8FAFC"
                                        />
                                    </View>
                                    <View style={[styles.row, styles.borderBottom]}>
                                        <Text style={styles.optionLabel}>Weekly Forecast (Sun 4 PM)</Text>
                                        <Switch
                                            value={settings.notificationPreferences.weeklyForecast}
                                            onValueChange={(v) => updateNotificationPreference('weeklyForecast', v)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor="#F8FAFC"
                                        />
                                    </View>
                                    <View style={[styles.row, styles.borderBottom]}>
                                        <Text style={styles.optionLabel}>Severe Weather Alerts</Text>
                                        <Zap size={16} color="#FBBF24" style={{ marginRight: 8 }} />
                                        <Switch
                                            value={settings.notificationPreferences.severeWeather}
                                            onValueChange={(v) => updateNotificationPreference('severeWeather', v)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor="#F8FAFC"
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.optionLabel}>Rain & Snow Alerts</Text>
                                        <CloudRain size={16} color="#60A5FA" style={{ marginRight: 8 }} />
                                        <Switch
                                            value={settings.notificationPreferences.rainSnowAlerts}
                                            onValueChange={(v) => updateNotificationPreference('rainSnowAlerts', v)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor="#F8FAFC"
                                        />
                                    </View>
                                </>
                            )}
                        </View>

                    </SettingsSection>

                    {/* Weathe News */}
                    <SettingsSection title="Weather News">
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Weather News Feed</Text>
                                    <Text style={styles.sublabel}>Get latest updates on global weather</Text>
                                </View>
                                <Switch
                                    value={settings.newsEnabled}
                                    onValueChange={toggleNews}
                                    trackColor={{ false: '#334155', true: '#3B82F6' }}
                                    thumbColor="#F8FAFC"
                                />
                            </View>
                        </View>
                    </SettingsSection>

                    {/* Current Conditions (Checklist) */}
                    <SettingsSection title="Current Conditions (Visible)">
                        <View style={styles.grid}>
                            {(Object.keys(settings.widgetVisibility) as Array<keyof WidgetVisibility>).map((widget) => (
                                <TouchableOpacity
                                    key={widget}
                                    style={[
                                        styles.gridItem,
                                        settings.widgetVisibility[widget] && styles.gridItemActive
                                    ]}
                                    onPress={() => updateWidgetVisibility(widget, !settings.widgetVisibility[widget])}
                                >
                                    <Text style={[styles.gridText, settings.widgetVisibility[widget] && styles.gridTextActive]}>
                                        {formatSettingName(widget)}
                                    </Text>
                                    <View style={[styles.dot, settings.widgetVisibility[widget] && styles.dotActive]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SettingsSection>

                    {/* Activities (Checklist) */}
                    <SettingsSection title="Activities">
                        <View style={styles.grid}>
                            {(Object.keys(settings.activityPreferences) as Array<keyof ActivityPreferences>).map((activity) => (
                                <TouchableOpacity
                                    key={activity}
                                    style={[
                                        styles.gridItem,
                                        settings.activityPreferences[activity] && styles.gridItemActive
                                    ]}
                                    onPress={() => updateActivityPreference(activity, !settings.activityPreferences[activity])}
                                >
                                    <Text style={[styles.gridText, settings.activityPreferences[activity] && styles.gridTextActive]}>
                                        {formatSettingName(activity)}
                                    </Text>
                                    <View style={[styles.dot, settings.activityPreferences[activity] && styles.dotActive]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SettingsSection>

                    {/* About AI */}
                    <SettingsSection title="About">
                        <View style={styles.card}>
                            <View style={{ padding: 16 }}>
                                <View style={styles.iconRow}>
                                    <Info size={20} color="#60A5FA" style={{ marginBottom: 8 }} />
                                    <Text style={[styles.label, { marginLeft: 8, marginBottom: 8 }]}>Aqu Weather</Text>
                                </View>
                                <Text style={styles.aboutText}>{aboutContent}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
                            <Text style={styles.resetText}>Reset All Settings</Text>
                        </TouchableOpacity>
                    </SettingsSection>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </WeatherBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    closeButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
    },
    iconBox: {
        width: 28,
        height: 28,
        backgroundColor: '#60A5FA',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    actionButton: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 16,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    savedList: {
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        borderRadius: 16,
        overflow: 'hidden',
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    locationName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    labelContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        color: '#F1F5F9',
        fontSize: 16,
        fontWeight: '600',
    },
    sublabel: {
        color: '#94A3B8',
        fontSize: 13,
        marginTop: 2,
    },
    optionLabel: {
        color: '#CBD5E1',
        fontSize: 15,
        flex: 1,
    },
    segmentContainer: {
        flexDirection: 'row',
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    segmentActive: {
        backgroundColor: '#38BDF8',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94A3B8',
    },
    segmentTextActive: {
        color: '#0F172A',
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '48%',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gridItemActive: {
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    gridText: {
        color: '#94A3B8',
        fontWeight: '500',
        fontSize: 14,
    },
    gridTextActive: {
        color: '#10B981',
        fontWeight: '600',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#334155',
    },
    dotActive: {
        backgroundColor: '#10B981',
    },
    aboutText: {
        color: '#94A3B8',
        fontSize: 14,
        lineHeight: 20,
    },

    resetButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 16,
    },
    resetText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '600',
    },
});
