import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
    children: React.ReactNode;
    condition?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    condition = 'clear',
}) => {
    const getGradientColors = (): [string, string, string] => {
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return ['#4A90E2', '#87CEEB', '#FFD700'];
        } else if (conditionLower.includes('cloud')) {
            return ['#6B7280', '#9CA3AF', '#D1D5DB'];
        } else if (conditionLower.includes('rain')) {
            return ['#374151', '#4B5563', '#6B7280'];
        } else if (conditionLower.includes('snow')) {
            return ['#E0F2FE', '#BAE6FD', '#7DD3FC'];
        } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return ['#1F2937', '#374151', '#4B5563'];
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            return ['#9CA3AF', '#D1D5DB', '#E5E7EB'];
        } else {
            return ['#4A90E2', '#87CEEB', '#B0E0E6'];
        }
    };

    return (
        <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});
