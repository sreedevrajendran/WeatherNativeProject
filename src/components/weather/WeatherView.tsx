
import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Search, MapPin, Settings } from 'lucide-react-native';
import { WeatherBackground } from '../ui/WeatherBackground';
import { CurrentWeather } from './CurrentWeather';
import { TomorrowsForecast } from './TomorrowsForecast';
import { HourlyForecast } from './HourlyForecast';
import { DailyForecast } from './DailyForecast';
import { WeatherDetails } from './WeatherDetails';
import { ActivityRecommendations } from './ActivityRecommendations';
import { DailyInsight } from './DailyInsight';
import { generateDailyInsight } from '../../utils/smartSuggestions';
import { analyzeWeather } from '../../utils/weatherAnalyzer';
import { getHourlyForecast } from '../../services/weatherApi';
import { WeatherData, SavedLocation } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';

interface WeatherViewProps {
    weatherData: WeatherData | null;
    loading: boolean;
    error: string | null;
    onRefresh: () => Promise<void>;
    navigation: any;
    onCurrentLocationPress?: () => void;
    isCurrentLocationPage?: boolean;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
    weatherData,
    loading,
    error,
    onRefresh,
    navigation,
    onCurrentLocationPress,
    isCurrentLocationPage = false,
}) => {
    const { settings, addSavedLocation, removeSavedLocation } = useSettings();

    const isSaved = React.useMemo(() => {
        if (!weatherData) return false;
        // Don't show "Saved" heart filled if we are strictly on the "Current Location" page (GPS) 
        // unless it's explicitly saved? 
        // Actually, logic is fine.
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

    if (loading && !weatherData) {
        return (
            <WeatherBackground>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading weather...</Text>
                </View>
            </WeatherBackground>
        );
    }

    if (error && !weatherData) {
        return (
            <WeatherBackground>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
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
                    <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
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
                {isCurrentLocationPage ? (
                    <TouchableOpacity onPress={onCurrentLocationPress}>
                        <MapPin size={24} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} /> /* Spacer to keep layout balanced */
                )}

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
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#fff" />
                }
                showsVerticalScrollIndicator={false}
            >
                <CurrentWeather
                    weather={weatherData.current}
                    location={weatherData.location}
                    onSaveLocation={handleSaveLocation}
                    isSaved={isSaved}
                />

                {alert && (
                    <TouchableOpacity style={styles.alertContainer} onPress={() => Alert.alert(alert.level.toUpperCase(), alert.message)}>
                        <Text style={styles.alertText}>⚠️ {alert.message}</Text>
                    </TouchableOpacity>
                )}

                <TomorrowsForecast
                    forecast={weatherData.forecast.forecastday[1]}
                    visible={!!weatherData.forecast.forecastday[1]}
                />

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
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    alertText: {
        color: '#FECACA',
        fontSize: 14,
        fontWeight: '600',
    },
});
