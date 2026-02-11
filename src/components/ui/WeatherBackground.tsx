import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherBackgroundProps {
    children: React.ReactNode;
    condition?: string;
    isDay?: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
    children,
    condition = 'clear',
    isDay = true
}) => {
    const getGradientColors = (): [string, string, string] => {
        const conditionLower = condition.toLowerCase();

        if (!isDay) {
            return ['#0f172a', '#1e293b', '#0f172a'];
        }

        // Clear / Sunny: Blue to Gold (Darkened for contrast)
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return ['#2563EB', '#3B82F6', '#D97706']; // Darker Blue to Darker Gold
        }

        // Clouds: Slate Grays (Darkened)
        if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            return ['#334155', '#475569', '#64748B'];
        }

        // Rain: Deep Blue
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return ['#172554', '#1E3A8A', '#2563EB'];
        }

        // Thunderstorm: Deep Purple
        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return ['#3B0764', '#581C87', '#6B21A8'];
        }

        // Snow: Blue/White (Darkened significantly for white text)
        if (conditionLower.includes('snow') || conditionLower.includes('ice') || conditionLower.includes('blizzard')) {
            return ['#60A5FA', '#93C5FD', '#BFD7ED']; // Still light but blue-heavy. 
            // Ideally, we'd use dark text for snow, but changing global text color is complex.
            // Let's rely on text shadows in CurrentWeather + GlassCard overlay.
        }

        // Mist / Fog: Lavender/Gray (Darkened)
        if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            return ['#6D28D9', '#7C3AED', '#8B5CF6']; // Purple-ish Mist (Darker)
            // Or stick to Gray: ['#374151', '#4B5563', '#6B7280']
            return ['#4B5563', '#6B7280', '#9CA3AF'];
        }

        // Default
        return ['#0F172A', '#1E293B', '#334155'];
    };

    return (
        <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
