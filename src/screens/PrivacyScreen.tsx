import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { WeatherBackground } from '../components/ui/WeatherBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { useWeather } from '../context/WeatherContext';

interface PrivacyScreenProps {
    navigation: any;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ navigation }) => {
    const { weatherData } = useWeather();

    return (
        <WeatherBackground
            condition={weatherData?.current.condition.text}
            isDay={weatherData?.current.is_day === 1}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <X size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Privacy Statement</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <GlassCard style={styles.card} intensity={20}>
                        <Text style={styles.title}>Privacy Policy</Text>
                        <Text style={styles.lastUpdated}>Last Updated: February 10, 2026</Text>

                        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                        <Text style={styles.text}>
                            We collect location data to provide accurate weather forecasts for your area. This
                            data is used solely for weather service functionality and is not shared with third
                            parties.
                        </Text>

                        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                        <Text style={styles.text}>
                            Your location data is used to:
                            {'\n'}• Fetch real-time weather information
                            {'\n'}• Provide personalized forecasts
                            {'\n'}• Save your favorite locations
                            {'\n'}• Deliver activity recommendations
                        </Text>

                        <Text style={styles.sectionTitle}>3. Data Storage</Text>
                        <Text style={styles.text}>
                            All user preferences and saved locations are stored locally on your device using
                            AsyncStorage. We do not store your personal information on external servers.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
                        <Text style={styles.text}>
                            We use WeatherAPI.com to fetch weather data. Please refer to their privacy policy
                            for information on how they handle data.
                        </Text>

                        <Text style={styles.sectionTitle}>5. Location Permissions</Text>
                        <Text style={styles.text}>
                            The app requests location permissions to provide weather data for your current
                            location. You can deny these permissions, but some features may not work properly.
                        </Text>

                        <Text style={styles.sectionTitle}>6. Data Security</Text>
                        <Text style={styles.text}>
                            We implement industry-standard security measures to protect your data. However, no
                            method of transmission over the internet is 100% secure.
                        </Text>

                        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
                        <Text style={styles.text}>
                            Our app does not knowingly collect personal information from children under 13. If
                            you believe we have collected such information, please contact us.
                        </Text>

                        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
                        <Text style={styles.text}>
                            We may update this privacy policy from time to time. We will notify you of any
                            changes by posting the new policy in the app.
                        </Text>

                        <Text style={styles.sectionTitle}>9. Contact Us</Text>
                        <Text style={styles.text}>
                            If you have any questions about this privacy policy, please contact us at:
                            {'\n'}Email: sreerajar40@gmail.com
                        </Text>

                        <Text style={styles.footer}>
                            Made with ❤️ by Sreedev Rajendran
                        </Text>
                    </GlassCard>
                </ScrollView>
            </View>
        </WeatherBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    lastUpdated: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 12,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        lineHeight: 24,
    },
    footer: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 32,
        fontStyle: 'italic',
    },
});
