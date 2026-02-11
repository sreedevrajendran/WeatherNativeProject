import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ModernCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary' | 'accent';
}

export const ModernCard: React.FC<ModernCardProps> = ({
    children,
    style,
    variant = 'primary'
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return 'rgba(255, 255, 255, 0.95)';
            case 'secondary':
                return 'rgba(255, 255, 255, 0.9)';
            case 'accent':
                return 'rgba(255, 255, 255, 0.85)';
            default:
                return 'rgba(255, 255, 255, 0.95)';
        }
    };

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: getBackgroundColor() },
                style
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});
