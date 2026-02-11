import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 30, // Default intensity for glass effect
    tint = 'light', // Default tint
}) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView
                intensity={intensity}
                tint={tint}
                style={StyleSheet.absoluteFill}
            />
            {/* Overlay for additional tint/frost effect if needed */}
            <View style={[styles.overlay, { backgroundColor: tint === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)' }]} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)', // Thinner, more subtle border
        backgroundColor: 'transparent',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        padding: 20,
        zIndex: 1,
    },
});
