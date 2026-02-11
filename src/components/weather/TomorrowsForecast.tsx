import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Droplets } from 'lucide-react-native';
import { DailyForecast } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature } from '../../utils/unitConverter';

interface TomorrowsForecastProps {
    forecast: DailyForecast;
    visible: boolean;
}

export const TomorrowsForecast: React.FC<TomorrowsForecastProps> = ({ forecast, visible }) => {
    const { settings } = useSettings();

    if (!visible || !forecast) return null;

    const { day } = forecast;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>TOMORROW</Text>
                    <Text style={styles.condition}>{day.condition.text}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <ArrowUpRight size={18} color="#F87171" />
                        <Text style={styles.statValue}>
                            {formatTemperature(day.maxtemp_c, day.maxtemp_f, settings.temperatureUnit)}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.stat}>
                        <ArrowDownRight size={18} color="#60A5FA" />
                        <Text style={styles.statValue}>
                            {formatTemperature(day.mintemp_c, day.mintemp_f, settings.temperatureUnit)}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    {/* Rain Status - Color Coded */}
                    <View style={styles.stat}>
                        <Droplets
                            size={18}
                            color={day.daily_chance_of_rain > 50 ? "#EF4444" : day.daily_chance_of_rain > 20 ? "#F59E0B" : "#10B981"}
                        />
                        <Text style={[
                            styles.statValue,
                            { color: day.daily_chance_of_rain > 50 ? "#EF4444" : day.daily_chance_of_rain > 20 ? "#F59E0B" : "#10B981" }
                        ]}>
                            {day.daily_chance_of_rain}% Rain
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginTop: 20, // Added spacing from CurrentWeather card
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Unified Dark semi-transparent
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flex: 1,
    },
    title: {
        fontSize: 13, // Matched DailyForecast
        fontWeight: '600', // Matched DailyForecast
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase', // Matched DailyForecast
    },
    condition: {
        fontSize: 18,
        fontWeight: '600',
        color: '#F1F5F9',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#F1F5F9',
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});
