import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { Cloud, CloudRain, Sun, CloudSnow, Moon } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { HourlyForecast as HourlyForecastType } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature } from '../../utils/unitConverter';

interface HourlyForecastProps {
    forecast: HourlyForecastType[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
    const { settings } = useSettings();
    const interval = settings.forecastInterval || 1;

    const getWeatherIcon = (condition: string, isDay: number) => {
        const conditionLower = condition.toLowerCase();
        const iconSize = 24;
        const color = '#fff';

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return <CloudRain size={iconSize} color={color} />;
        } else if (conditionLower.includes('snow')) {
            return <CloudSnow size={iconSize} color={color} />;
        } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            return <Cloud size={iconSize} color={color} />;
        } else {
            return isDay ? <Sun size={iconSize} color={color} /> : <Moon size={iconSize} color={color} />;
        }
    };

    const formatTime = (time: string, index: number) => {
        if (index === 0) return 'Now';
        const date = new Date(time);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours} ${ampm}`;
    };

    // Filter forecast based on interval but ensure we don't crash if array is small
    if (!forecast) {
        console.warn('HourlyForecast: forecast prop is missing');
        return null;
    }
    const filteredForecast = forecast.filter((_, index) => index % interval === 0).slice(0, 24);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Hourly forecast</Text>
                    <Text style={styles.subtitle}>Updated now</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    indicatorStyle="white"
                    contentContainerStyle={styles.scrollContent}
                >
                    {filteredForecast.map((hour, index) => (
                        <View key={`${hour.time}-${interval}`} style={styles.hourItem}>
                            <Text style={styles.time}>{formatTime(hour.time, index)}</Text>
                            <View style={styles.iconContainer}>{getWeatherIcon(hour.condition.text, 1)}</View>
                            <Text style={styles.temp}>
                                {formatTemperature(hour.temp_c, hour.temp_f, settings.temperatureUnit)}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Dark semi-transparent
        borderRadius: 24,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F1F5F9', // Slate 100
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#94A3B8', // Slate 400
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 24, // Increased spacing
    },
    hourItem: {
        alignItems: 'center',
        width: 50,
    },
    time: {
        fontSize: 13,
        fontWeight: '500',
        color: '#CBD5E1', // Slate 300
        marginBottom: 12,
    },
    iconContainer: {
        marginVertical: 4,
        height: 30,
        justifyContent: 'center',
    },
    temp: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 8,
    },
    hourCard: {}, // Unused
    precipitation: {}, // Unused styling but logic removed from render above
});
