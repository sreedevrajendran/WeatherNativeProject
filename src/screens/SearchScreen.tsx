import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Search as SearchIcon, MapPin, Heart, X } from 'lucide-react-native';
import { WeatherBackground } from '../components/ui/WeatherBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { searchCities } from '../services/weatherApi';

interface SearchScreenProps {
    navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const { fetchWeatherByCity, weatherData } = useWeather();
    const { settings } = useSettings();

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (query.length >= 3) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [query]);

    const handleSearch = async () => {
        setSearching(true);
        try {
            const cities = await searchCities(query);
            setResults(cities);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const [isNavigating, setIsNavigating] = useState(false);

    const handleSelectCity = async (city: any) => {
        if (isNavigating) return;
        setIsNavigating(true);
        await fetchWeatherByCity(city.name);
        navigation.goBack();
    };

    const handleSelectSavedLocation = async (location: any) => {
        if (isNavigating) return;
        setIsNavigating(true);
        await fetchWeatherByCity(location.name);
        navigation.goBack();
    };

    return (
        <WeatherBackground
            condition={weatherData?.current.condition.text}
            isDay={weatherData?.current.is_day === 1}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (!isNavigating) {
                            setIsNavigating(true);
                            navigation.goBack();
                        }
                    }}>
                        <X size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Search Location</Text>
                    <View style={{ width: 24 }} />
                </View>

                <GlassCard style={styles.searchCard} intensity={20}>
                    <View style={styles.searchContainer}>
                        <SearchIcon size={20} color="rgba(255, 255, 255, 0.8)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a city..."
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                        />
                        {searching && <ActivityIndicator size="small" color="#fff" />}
                    </View>
                </GlassCard>

                {settings.savedLocations.length > 0 && query.length === 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Saved Locations</Text>
                        {settings.savedLocations.map((location) => (
                            <TouchableOpacity
                                key={location.id}
                                onPress={() => handleSelectSavedLocation(location)}
                            >
                                <GlassCard style={styles.resultCard} intensity={15}>
                                    <Heart size={20} color="#fff" fill="#fff" />
                                    <View style={styles.resultInfo}>
                                        <Text style={styles.resultName}>{location.name}</Text>
                                        <Text style={styles.resultCountry}>{location.country}</Text>
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {results.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Search Results</Text>
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectCity(item)}>
                                    <GlassCard style={styles.resultCard} intensity={15}>
                                        <MapPin size={20} color="rgba(255, 255, 255, 0.8)" />
                                        <View style={styles.resultInfo}>
                                            <Text style={styles.resultName}>{item.name}</Text>
                                            <Text style={styles.resultCountry}>
                                                {item.region}, {item.country}
                                            </Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {query.length >= 3 && results.length === 0 && !searching && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No cities found</Text>
                    </View>
                )}
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
    searchCard: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 8,
    },
    section: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    resultInfo: {
        flex: 1,
    },
    resultName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    resultCountry: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
    },
});
