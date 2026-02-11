import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MapPin, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { CurrentWeather as CurrentWeatherType, Location } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature } from '../../utils/unitConverter';
import { generateWeatherDescription } from '../../utils/weatherAnalyzer';
import { WeatherAnimation } from './WeatherAnimation';
// import { GlassCard } from '../ui/GlassCard'; // Removed

const { width } = Dimensions.get('window');

interface CurrentWeatherProps {
    weather: CurrentWeatherType;
    location: Location;
    onSaveLocation: () => void;
    isSaved: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
    weather,
    location,
    onSaveLocation,
    isSaved,
}) => {
    const { settings } = useSettings();
    const description = generateWeatherDescription(weather);
    const isDay = weather.is_day === 1;

    return (
        <View style={styles.container}>
            {/* AI Banner */}
            <View style={styles.bannerContainer}>
                <View style={styles.bannerIcon}>
                    {/*
                        Comfort Level Color Logic:
                        Good/Ideal -> #2ECC71 (Emerald Green)
                        Moderate -> #F1C40F (Sunflower Yellow)
                        Unhealthy -> #E67E22 (Carrot Orange)
                        Bad -> #E74C3C (Alert Red)
                        Extreme -> #9B59B6 (Royal Purple)
                    */}
                    {(() => {
                        const text = description.primary;
                        let iconColor = '#F1C40F'; // Default Moderate

                        if (text.includes('Perfect') || text.includes('Great') || text.includes('Nice') || text.includes('Clear') || text.includes('Mild')) {
                            iconColor = '#2ECC71'; // Good
                        } else if (text.includes('Hot') || text.includes('Cold') || text.includes('Windy')) {
                            iconColor = '#E67E22'; // Unhealthy/Caution
                        } else if (text.includes('Storm') || text.includes('Rain') || text.includes('Snow')) {
                            iconColor = '#E74C3C'; // Bad
                        } else if (text.includes('Extreme') || text.includes('Severe')) {
                            iconColor = '#9B59B6'; // Extreme
                        }

                        return description.primary.includes('Perfect') || description.primary.includes('Good') ? (
                            <CheckCircle2 size={16} color={iconColor} />
                        ) : (
                            <AlertCircle size={16} color={iconColor} />
                        );
                    })()}
                </View>
                <Text style={[
                    styles.bannerText,
                    {
                        color: (() => {
                            const text = description.primary;
                            if (text.includes('Perfect') || text.includes('Great') || text.includes('Nice') || text.includes('Clear') || text.includes('Mild')) return '#2ECC71';
                            if (text.includes('Hot') || text.includes('Cold') || text.includes('Windy')) return '#E67E22';
                            if (text.includes('Storm') || text.includes('Rain') || text.includes('Snow')) return '#E74C3C'; // Alert Red
                            if (text.includes('Extreme') || text.includes('Severe')) return '#9B59B6';
                            return '#F1C40F'; // Default Moderate
                        })()
                    }
                ]}>
                    {description.primary} - {description.secondary}
                </Text>
            </View>

            {/* Main Weather Card */}
            <View style={styles.mainCard}>
                <View style={styles.header}>
                    <View style={styles.locationBadges}>
                        <View style={styles.locationChip}>
                            <MapPin size={14} color="#94A3B8" />
                            <Text style={styles.locationText}>{location.name}</Text>
                        </View>
                    </View>

                    {/* Date and Save Button */}
                    <View style={styles.headerRight}>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </Text>
                        <TouchableOpacity
                            onPress={onSaveLocation}
                            style={[
                                styles.saveButton,
                                isSaved && styles.saveButtonActive
                            ]}
                        >
                            <Heart
                                size={20}
                                color={isSaved ? "#EF4444" : "#CBD5E1"} // Red if saved, lighter grey if not
                                fill={isSaved ? "#EF4444" : "transparent"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tempSection}>
                    <Text style={styles.temperature}>
                        {formatTemperature(weather.temp_c, weather.temp_f, settings.temperatureUnit)}
                    </Text>
                    <View style={styles.conditionSection}>
                        <Text style={styles.condition}>{weather.condition.text}</Text>
                        <View style={styles.feelsLikeChip}>
                            <Text style={styles.feelsLikeText}>
                                Feels like {formatTemperature(weather.feelslike_c, weather.feelslike_f, settings.temperatureUnit)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Animation Overlay (Sun/Moon/Cloud) positioned absolute/behind or side */}
                <View style={styles.visualsContainer}>
                    <WeatherAnimation condition={weather.condition.text} isDay={isDay} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    bannerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        width: '100%',
    },
    bannerIcon: {
        marginRight: 8,
    },
    bannerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    mainCard: {
        width: '100%',
        padding: 24,
        position: 'relative',
        minHeight: 320,
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Unified style
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 10,
    },
    locationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    locationText: {
        color: '#E2E8F0',
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        color: '#FFFFFF', // White text
        fontSize: 14,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Shadow for visibility
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    saveButton: {
        padding: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle background
    },
    saveButtonActive: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red background when saved
    },
    tempSection: {
        marginTop: 10,
        zIndex: 10,
    },
    temperature: {
        color: '#FFFFFF',
        fontSize: 96,
        fontWeight: '600',
        letterSpacing: -4,
        lineHeight: 110,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    conditionSection: {
        marginTop: 4,
    },
    condition: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    feelsLikeChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    feelsLikeText: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: '500',
    },
    visualsContainer: {
        position: 'absolute',
        right: -60,
        top: 20,
        width: 300,
        height: 300,
        zIndex: 1,
        opacity: 0.9,
        transform: [{ scale: 1.1 }]
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    // Keep these for future use if needed, but unused in this version
    locationBadges: {},
    locationContainer: {},
    animationContainer: {},
    mainInfo: {},
    highLow: {},
    descriptionContainer: {},
    primaryDesc: {},
    secondaryDesc: {},
});
