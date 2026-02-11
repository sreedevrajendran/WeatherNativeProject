import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert,
    Linking,
    StatusBar,
} from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { getCurrentLocation } from '../services/locationService';
import { WeatherView } from '../components/weather/WeatherView';
import { SavedLocationPage } from '../components/weather/SavedLocationPage';

interface HomeScreenProps {
    navigation: any;
}

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { weatherData, loading, error, fetchWeatherByCoords, refreshWeather } = useWeather();
    const { settings } = useSettings();
    const [initialLoading, setInitialLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadInitialWeather();
    }, []);

    const loadInitialWeather = async () => {
        setInitialLoading(true);
        try {
            const location = await getCurrentLocation();
            if (location) {
                await fetchWeatherByCoords(location.latitude, location.longitude);
            } else {
                Alert.alert(
                    'Location Access Required',
                    'We need your location to show accurate weather for your area. Please enable GPS and allow permissions in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } catch (err) {
            console.error('Error loading initial weather:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    const handleCurrentLocationPress = () => {
        loadInitialWeather();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Page 0: Current / Main Context Location */}
                <View style={styles.page}>
                    <WeatherView
                        weatherData={weatherData}
                        loading={loading || initialLoading}
                        error={error}
                        onRefresh={refreshWeather}
                        navigation={navigation}
                        isCurrentLocationPage={true}
                        onCurrentLocationPress={handleCurrentLocationPress}
                    />
                </View>

                {/* Pages 1..N: Saved Locations */}
                {settings.savedLocations.map((loc, index) => (
                    <SavedLocationPage
                        key={loc.id}
                        location={loc}
                        navigation={navigation}
                        isActive={activeIndex === index + 1}
                    />
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                <View style={[styles.dot, activeIndex === 0 && styles.activeDot]} />
                {settings.savedLocations.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.dot, activeIndex === index + 1 && styles.activeDot]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    page: {
        width: width,
        flex: 1,
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 20,
    },
});
