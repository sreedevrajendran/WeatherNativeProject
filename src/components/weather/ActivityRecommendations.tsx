import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';
import { CurrentWeather } from '../../types/weather';
import { useSettings } from '../../context/SettingsContext';
import { getActivityAdvice } from '../../utils/smartSuggestions';
import { getActivityFeasibility } from '../../utils/weatherAnalyzer';

interface ActivityRecommendationsProps {
    weather: CurrentWeather;
}

const ACTIVITIES = [
    { key: 'hiking', label: 'Hiking' },
    { key: 'running', label: 'Running' },
    { key: 'cycling', label: 'Cycling' },
    { key: 'driving', label: 'Driving' },
    { key: 'fishing', label: 'Fishing' },
    { key: 'gardening', label: 'Gardening' },
    { key: 'stargazing', label: 'Stargazing' },
    { key: 'bbq', label: 'BBQ' },
] as const;

export const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({ weather }) => {
    const { settings } = useSettings();

    const getStatusLevel = (color: string): string => {
        if (color === '#10B981') return 'Good'; // Green
        if (color === '#F59E0B') return 'Moderate'; // Yellow/Orange
        return 'Poor'; // Red or others
    };

    if (!settings?.activityPreferences) return null;

    const visibleActivities = ACTIVITIES.filter(
        (activity) => settings.activityPreferences[activity.key]
    );

    if (visibleActivities.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ACTIVITIES</Text>
            <View style={styles.grid}>
                {visibleActivities.map((activity) => {
                    const feasibility = getActivityFeasibility(weather, activity.key);
                    const isFeasible = feasibility.feasible;
                    // Use smart advice, or fall back to feasibility reason
                    const advice = getActivityAdvice(activity.key, weather, isFeasible);
                    const statusLevel = getStatusLevel(feasibility.color);

                    return (
                        <View key={activity.key} style={styles.card}>
                            <View style={styles.content}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>{activity.label}</Text>
                                    <Text style={[styles.statusText, { color: feasibility.color }]}>
                                        {statusLevel}
                                    </Text>
                                    <Text style={styles.adviceText} numberOfLines={2}>
                                        {advice}
                                    </Text>
                                </View>
                                <View style={[styles.dotContainer, {
                                    shadowColor: feasibility.color,
                                    shadowOpacity: 0.5,
                                    shadowRadius: 4,
                                }]}>
                                    <Circle size={8} fill={feasibility.color} color={feasibility.color} />
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#CBD5E1',
        marginBottom: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        width: '48%', // Slightly wider to fit advice
        paddingVertical: 14,
        paddingHorizontal: 14,
        minHeight: 110, // Increased height for advice
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align to top
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    adviceText: {
        fontSize: 11,
        color: '#94A3B8',
        lineHeight: 14,
    },
    dotContainer: {
        paddingTop: 6, // Align dot with label
        paddingLeft: 4,
    },
});
