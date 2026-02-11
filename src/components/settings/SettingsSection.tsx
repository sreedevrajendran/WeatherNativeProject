import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
    style?: ViewStyle;
    icon?: React.ReactNode;
    initialExpanded?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
    title,
    children,
    style,
    icon,
    initialExpanded = false
}) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleExpand}
                style={[styles.header, expanded && styles.headerExpanded]}
            >
                <View style={styles.titleRow}>
                    {icon || <Folder size={18} color="#60A5FA" style={{ marginRight: 10 }} />}
                    <Text style={styles.title}>{title}</Text>
                </View>
                {expanded ? <ChevronDown size={20} color="#94A3B8" /> : <ChevronRight size={20} color="#94A3B8" />}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
    },
    headerExpanded: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#F1F5F9', // Slate 100
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
});
