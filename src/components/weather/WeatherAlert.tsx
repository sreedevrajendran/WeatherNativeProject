import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react-native';
import { WeatherAlert as WeatherAlertType } from '../../types/weather';

interface WeatherAlertProps {
    alert: WeatherAlertType;
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({ alert }) => {
    const getAlertStyle = () => {
        switch (alert.level) {
            case 'severe':
                return {
                    container: styles.severeContainer,
                    icon: <AlertTriangle size={24} color="#DC2626" />,
                    iconBg: '#FEE2E2',
                };
            case 'caution':
                return {
                    container: styles.cautionContainer,
                    icon: <AlertCircle size={24} color="#F59E0B" />,
                    iconBg: '#FEF3C7',
                };
            case 'perfect':
                return {
                    container: styles.perfectContainer,
                    icon: <CheckCircle size={24} color="#10B981" />,
                    iconBg: '#D1FAE5',
                };
            default:
                return {
                    container: styles.perfectContainer,
                    icon: <CheckCircle size={24} color="#10B981" />,
                    iconBg: '#D1FAE5',
                };
        }
    };

    const alertStyle = getAlertStyle();

    return (
        <View style={[styles.container, alertStyle.container]}>
            <View style={[styles.iconContainer, { backgroundColor: alertStyle.iconBg }]}>
                {alertStyle.icon}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.message}>{alert.message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 12,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    severeContainer: {
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
    },
    cautionContainer: {
        backgroundColor: '#FFFBEB',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    perfectContainer: {
        backgroundColor: '#F0FDF4',
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 20,
    },
});
