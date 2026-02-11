import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DailyInsightProps {
    insight: string;
}

export const DailyInsight: React.FC<DailyInsightProps> = ({ insight }) => {
    if (!insight) return null;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(99, 102, 241, 0.2)', 'rgba(168, 85, 247, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Sparkles size={18} color="#C084FC" style={{ marginTop: 2 }} />
                    <Text style={styles.text}>{insight}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)', // Purple tint border
    },
    gradient: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#C084FC', // Purple 400
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    text: {
        color: '#F3E8FF', // Purple 100
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
});
