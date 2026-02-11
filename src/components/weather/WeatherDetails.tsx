import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    Wind, Droplets, Sun, Gauge, Eye, Thermometer,
    Sunrise, Sunset, Moon, Cloud, CloudRain, Activity
} from 'lucide-react-native';
// import { GlassCard } from '../ui/GlassCard'; // Removed
import { CurrentWeather, Astro } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import {
    getWindSpeed,
    getPressure,
    getVisibility,
    getPrecipitation,
    formatTemperature,
    calculateDewPoint
} from '../../utils/unitConverter';

interface WeatherDetailsProps {
    weather: CurrentWeather;
    astro?: Astro;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather, astro }) => {
    const { settings } = useSettings();

    // Helper to render AQI Label
    const getAqiLabel = (index?: number) => {
        if (!index) return 'N/A'; // EPA Index 1-6
        if (index <= 50) return 'Good'; // PM2.5 based usually, but here using EPA if available
        // WeatherAPI US-EPA-Index: 1=Good, 2=Moderate, 3=Unhealthy for sensitive, 4=Unhealthy, 5=Very Unhealthy, 6=Hazardous
        const epaMap = ['Good', 'Moderate', 'Unhealthy (Sens.)', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
        return epaMap[index - 1] || 'Unknown';
    };

    const details = [
        {
            key: 'feelsLike',
            icon: <Thermometer size={20} color="#F87171" />,
            label: 'Feels Like',
            value: formatTemperature(weather.feelslike_c, weather.feelslike_f, settings.temperatureUnit),
            visible: settings.widgetVisibility.feelsLike,
        },
        {
            key: 'wind',
            icon: <Wind size={20} color="#60A5FA" />,
            label: 'Wind',
            value: getWindSpeed(weather.wind_kph, weather.wind_mph, settings.temperatureUnit),
            visible: settings.widgetVisibility.wind,
        },
        {
            key: 'humidity',
            icon: <Droplets size={20} color="#38BDF8" />,
            label: 'Humidity',
            value: `${weather.humidity}%`,
            visible: settings.widgetVisibility.humidity,
        },
        {
            key: 'dewPoint',
            icon: <CloudRain size={20} color="#0EA5E9" />,
            label: 'Dew Point',
            value: calculateDewPoint(weather.temp_c, weather.humidity, settings.temperatureUnit),
            visible: settings.widgetVisibility.dewPoint,
        },
        {
            key: 'uv',
            icon: <Sun size={20} color="#FBBF24" />,
            label: 'UV Index',
            value: weather.uv.toString(),
            visible: settings.widgetVisibility.uv,
        },
        {
            key: 'pressure',
            icon: <Gauge size={20} color="#A78BFA" />,
            label: 'Pressure',
            value: getPressure(weather.pressure_mb, weather.pressure_in, settings.temperatureUnit),
            visible: settings.widgetVisibility.pressure,
        },
        {
            key: 'visibility',
            icon: <Eye size={20} color="#34D399" />,
            label: 'Visibility',
            value: getVisibility(weather.vis_km, weather.vis_miles, settings.temperatureUnit),
            visible: settings.widgetVisibility.visibility,
        },
        {
            key: 'cloudiness',
            icon: <Cloud size={20} color="#94A3B8" />,
            label: 'Cloudiness',
            value: `${weather.cloud}%`,
            visible: settings.widgetVisibility.cloudiness !== undefined ? settings.widgetVisibility.cloudiness : true,
        },
        {
            key: 'precipitation',
            icon: <CloudRain size={20} color="#60A5FA" />,
            label: 'Precipitation',
            value: getPrecipitation(weather.precip_mm, weather.precip_in, settings.temperatureUnit),
            visible: settings.widgetVisibility.precipitation,
        },
        {
            key: 'aqi',
            icon: <Activity size={20} color="#10B981" />,
            label: 'Air Quality',
            value: weather.air_quality ? getAqiLabel(weather.air_quality['us-epa-index']) : 'N/A',
            subValue: weather.air_quality ? `EPA: ${weather.air_quality['us-epa-index']}` : undefined,
            visible: settings.widgetVisibility.aqi,
        },
        {
            key: 'sunrise',
            icon: <Sunrise size={20} color="#F59E0B" />,
            label: 'Sunrise',
            value: astro?.sunrise || 'N/A',
            visible: settings.widgetVisibility.sunrise,
        },
        {
            key: 'sunset',
            icon: <Sunset size={20} color="#F97316" />,
            label: 'Sunset',
            value: astro?.sunset || 'N/A',
            visible: settings.widgetVisibility.sunset,
        },
        {
            key: 'moonPhase',
            icon: <Moon size={20} color="#E2E8F0" />,
            label: 'Moon Phase',
            value: astro?.moon_phase || 'N/A',
            subValue: astro?.moon_illumination ? `${astro.moon_illumination}%` : undefined,
            visible: settings.widgetVisibility.moonPhase,
        },
    ];

    const visibleDetails = details.filter((detail) => detail.visible !== false);

    if (visibleDetails.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {visibleDetails.map((detail) => (
                    <View key={detail.key} style={styles.card}>
                        <View style={styles.header}>
                            {detail.icon}
                            <Text style={styles.label}>{detail.label.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                            {detail.value}
                        </Text>
                        {detail.subValue && <Text style={styles.subValue}>{detail.subValue}</Text>}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12, // Reduced gap to fit 3 columns if needed, or tight 2 columns
    },
    card: {
        width: '47%', // Slightly less than 48% to ensure gap fits on small screens
        padding: 16,
        minHeight: 100,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Unified style
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
        letterSpacing: 0.5,
        flex: 1,
    },
    value: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F1F5F9',
    },
    subValue: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
});
