import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Alert,
    Linking,
} from 'react-native';
import { Search, MapPin, Settings } from 'lucide-react-native';
import { WeatherBackground } from '../components/ui/WeatherBackground';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { TomorrowsForecast } from '../components/weather/TomorrowsForecast';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';
import { WeatherDetails } from '../components/weather/WeatherDetails';
import { ActivityRecommendations } from '../components/weather/ActivityRecommendations';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { getCurrentLocation } from '../services/locationService';
import { getHourlyForecast } from '../services/weatherApi';
import { analyzeWeather } from '../utils/weatherAnalyzer';
import { SavedLocation } from '../types/weather';
import { DailyInsight } from '../components/weather/DailyInsight';
import { generateDailyInsight } from '../utils/smartSuggestions';

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { weatherData, loading, error, fetchWeatherByCoords, refreshWeather } = useWeather();
    const { settings, addSavedLocation, removeSavedLocation } = useSettings();
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        loadInitialWeather();
    }, []);

    const loadInitialWeather = async () => {
        try {
            const location = await getCurrentLocation();
            if (location) {
                await fetchWeatherByCoords(location.latitude, location.longitude);
            } else {
                Alert.alert(
                    'Location Access Required',
                    'We need your location to show accurate weather for your area. Please enable GPS and allow permissions in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } catch (err) {
            console.error('Error loading initial weather:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const isSaved = React.useMemo(() => {
        if (!weatherData) return false;
        return settings.savedLocations.some(
            (loc) =>
                loc.name === weatherData.location.name ||
                (Math.abs(loc.lat - weatherData.location.lat) < 0.01 &&
                    Math.abs(loc.lon - weatherData.location.lon) < 0.01)
        );
    }, [weatherData, settings.savedLocations]);

    const handleSaveLocation = () => {
        if (!weatherData) return;

        if (isSaved) {
            const locationToRemove = settings.savedLocations.find(
                (loc) =>
                    loc.name === weatherData.location.name ||
                    (Math.abs(loc.lat - weatherData.location.lat) < 0.01 &&
                        Math.abs(loc.lon - weatherData.location.lon) < 0.01)
            );
            if (locationToRemove) {
                removeSavedLocation(locationToRemove.id);
            }
        } else {
            const newLocation: SavedLocation = {
                id: Date.now().toString(),
                name: weatherData.location.name,
                lat: weatherData.location.lat,
                lon: weatherData.location.lon,
                country: weatherData.location.country,
            };
            addSavedLocation(newLocation);
        }
    };

    const handleCurrentLocation = async () => {
        const location = await getCurrentLocation();
        if (location) {
            await fetchWeatherByCoords(location.latitude, location.longitude);
        }
    };

    if (initialLoading) {
        return (
            <WeatherBackground>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading weather...</Text>
                </View>
            </WeatherBackground>
        );
    }

    if (error) {
        return (
            <WeatherBackground>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadInitialWeather}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </WeatherBackground>
        );
    }

    if (!weatherData) {
        return (
            <WeatherBackground>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>No weather data available</Text>
                </View>
            </WeatherBackground>
        );
    }

    const alert = analyzeWeather(weatherData.current);
    const hourlyForecast = getHourlyForecast(weatherData);

    // Generate insight
    const insight = weatherData.forecast?.forecastday?.[0]
        ? generateDailyInsight(weatherData.current, weatherData.forecast.forecastday[0])
        : '';

    return (
        <WeatherBackground condition={weatherData.current.condition.text} isDay={weatherData.current.is_day === 1}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCurrentLocation}>
                    <MapPin size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.headerButton}>
                        <Search size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerButton}>
                        <Settings size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refreshWeather} tintColor="#fff" />
                }
                showsVerticalScrollIndicator={false}
            >
                <CurrentWeather weather={weatherData.current} location={weatherData.location} onSaveLocation={handleSaveLocation} isSaved={isSaved} />

                {alert && (
                    <TouchableOpacity style={styles.alertContainer} onPress={() => Alert.alert(alert.level.toUpperCase(), alert.message)}>
                        <Text style={styles.alertText}>⚠️ {alert.message}</Text>
                    </TouchableOpacity>
                )}

                <TomorrowsForecast
                    forecast={weatherData.forecast.forecastday[1]}
                    visible={!!weatherData.forecast.forecastday[1]}
                />

                {/* Smart Suggestion Insight */}
                <DailyInsight insight={insight} />

                <HourlyForecast forecast={hourlyForecast} />
                <DailyForecast forecast={weatherData.forecast.forecastday} />
                <WeatherDetails
                    weather={weatherData.current}
                    astro={weatherData.forecast?.forecastday[0]?.astro}
                />
                <ActivityRecommendations weather={weatherData.current} />

                <View style={{ height: 40 }} />
            </ScrollView>
        </WeatherBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // contentContainer removed if unused
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerButton: {
        padding: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '600',
    },
    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    alertContainer: {
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red tint
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    alertText: {
        color: '#FECACA', // Light Red
        fontSize: 14,
        fontWeight: '600',
    },
});
