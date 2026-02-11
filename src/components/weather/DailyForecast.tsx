import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cloud, CloudRain, Sun, CloudSnow, Droplets, CloudDrizzle, CloudLightning, Moon } from 'lucide-react-native';
import { DailyForecast as DailyForecastType } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature } from '../../utils/unitConverter';
import { LinearGradient } from 'expo-linear-gradient';

interface DailyForecastProps {
    forecast: DailyForecastType[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecast }) => {
    const { settings } = useSettings();

    if (!forecast || !Array.isArray(forecast)) {
        return null;
    }

    const getWeatherIcon = (condition: string) => {
        const conditionLower = condition.toLowerCase();
        const iconSize = 24;

        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return <CloudLightning size={iconSize} color="#A78BFA" />; // Purple
        } else if (conditionLower.includes('rain')) {
            return <CloudRain size={iconSize} color="#60A5FA" />; // Blue
        } else if (conditionLower.includes('drizzle')) {
            return <CloudDrizzle size={iconSize} color="#93C5FD" />; // Light Blue
        } else if (conditionLower.includes('snow')) {
            return <CloudSnow size={iconSize} color="#E2E8F0" />; // White
        } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            return <Cloud size={iconSize} color="#94A3B8" />; // Grey
        } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return <Sun size={iconSize} color="#FBBF24" />; // Yellow
        } else {
            return <Sun size={iconSize} color="#FBBF24" />;
        }
    };

    const formatDay = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else {
            // For tomorrow and others, use short day name to fit alignment
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
        // Shorten strict 3 chars? The image shows "Thu", "Fri".
        // .toLocaleDateString('en-US', { weekday: 'short' }) might be better.
    };

    // Helper for short day
    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Slice to 6 days
    const next6Days = forecast.slice(0, 6);

    // Calculate dynamic range for the week to maximize bar usage
    const minTemps = next6Days.map(d => d.day.mintemp_c);
    const maxTemps = next6Days.map(d => d.day.maxtemp_c);
    const overallMin = Math.min(...minTemps);
    const overallMax = Math.max(...maxTemps);
    // Add minimal padding so the extreme bars don't look cut off, or strict range if preferred.
    // Let's use exact range for "full filled" look, maybe 1 degree padding.
    const rangeMin = overallMin - 2;
    const rangeMax = overallMax + 2;
    const totalRange = rangeMax - rangeMin || 10; // Avoid divide by zero

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>6-DAY FORECAST</Text>
                </View>
                <View style={styles.listContent}>
                    {next6Days.map((day, index) => {
                        const minTemp = Math.round(day.day.mintemp_c);
                        const maxTemp = Math.round(day.day.maxtemp_c);

                        // Dynamic bar sizing
                        const left = Math.max(0, ((day.day.mintemp_c - rangeMin) / totalRange) * 100);
                        const width = Math.max(5, ((day.day.maxtemp_c - day.day.mintemp_c) / totalRange) * 100);

                        return (
                            <View key={day.date} style={styles.dayRow}>
                                <Text style={styles.dayName}>{getDayName(day.date)}</Text>

                                <View style={styles.iconContainer}>
                                    {getWeatherIcon(day.day.condition.text)}
                                </View>

                                <View style={styles.tempContainer}>
                                    <Text style={styles.minTempText}>{Math.round(day.day.mintemp_c)}°</Text>

                                    <View style={styles.barTrack}>
                                        <LinearGradient
                                            colors={['#93C5FD', '#FCD34D']} // Blue to Yellow
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            style={[
                                                styles.barFill,
                                                {
                                                    left: `${left}%`,
                                                    width: `${width}%`
                                                }
                                            ]}
                                        />
                                    </View>

                                    <Text style={styles.maxTempText}>{Math.round(day.day.maxtemp_c)}°</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Dark semi-transparent
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerContainer: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8', // Slate 400
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    listContent: {
        gap: 16,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 36,
    },
    dayName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#F1F5F9', // Slate 100
        width: 60, // Fixed width for alignment
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
        gap: 12,
    },
    minTempText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#94A3B8', // Slate 400 (Faded)
        width: 30,
        textAlign: 'right',
    },
    maxTempText: {
        fontSize: 15,
        fontWeight: '700', // Bold
        color: '#FFFFFF',
        width: 30,
        textAlign: 'left',
    },
    barTrack: {
        flex: 1,
        height: 6, // Slightly thicker for visibility
        backgroundColor: 'rgba(51, 65, 85, 0.5)', // Slate 700 / 50%
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    barFill: {
        position: 'absolute',
        height: '100%',
        borderRadius: 3,
    },
});
