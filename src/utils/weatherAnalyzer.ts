import {
    WeatherAlert,
    AlertLevel,
    CurrentWeather,
    WeatherDescription,
} from '../types/weather';

/**
 * Analyze weather conditions and generate smart alerts
 */
export const analyzeWeather = (weather: CurrentWeather): WeatherAlert | null => {
    const temp = weather.temp_c;
    const windSpeed = weather.wind_kph;
    const visibility = weather.vis_km;
    const condition = weather.condition.text.toLowerCase();

    // Severe conditions (Red Alert)
    if (temp > 40) {
        return {
            level: 'severe',
            message: 'Extreme Heat Warning! Stay hydrated and avoid outdoor activities.',
            icon: 'alert-triangle',
            color: '#EF4444',
        };
    }

    if (temp < -10) {
        return {
            level: 'severe',
            message: 'Extreme Cold Warning! Bundle up and limit time outdoors.',
            icon: 'alert-triangle',
            color: '#EF4444',
        };
    }

    if (windSpeed > 50) {
        return {
            level: 'severe',
            message: 'High Wind Warning! Secure loose objects and avoid travel.',
            icon: 'wind',
            color: '#EF4444',
        };
    }

    if (
        condition.includes('storm') ||
        condition.includes('thunder') ||
        condition.includes('hurricane')
    ) {
        return {
            level: 'severe',
            message: 'Severe Weather Alert! Seek shelter immediately.',
            icon: 'cloud-lightning',
            color: '#EF4444',
        };
    }

    if (visibility < 1) {
        return {
            level: 'severe',
            message: 'Low Visibility Warning! Drive with extreme caution.',
            icon: 'eye-off',
            color: '#EF4444',
        };
    }

    // Cautionary conditions (Yellow Alert)
    if (temp > 32 && temp <= 40) {
        return {
            level: 'caution',
            message: 'Heat Advisory. Stay cool and drink plenty of water.',
            icon: 'thermometer-sun',
            color: '#F59E0B',
        };
    }

    if (temp < 0 && temp >= -10) {
        return {
            level: 'caution',
            message: 'Cold Advisory. Dress warmly for outdoor activities.',
            icon: 'thermometer-snowflake',
            color: '#F59E0B',
        };
    }

    if (windSpeed > 30 && windSpeed <= 50) {
        return {
            level: 'caution',
            message: 'Windy Conditions. Secure loose items outdoors.',
            icon: 'wind',
            color: '#F59E0B',
        };
    }

    if (condition.includes('rain') && !condition.includes('light')) {
        return {
            level: 'caution',
            message: 'Heavy Rain Expected. Carry an umbrella and drive carefully.',
            icon: 'cloud-rain',
            color: '#F59E0B',
        };
    }

    if (condition.includes('snow') && !condition.includes('light')) {
        return {
            level: 'caution',
            message: 'Snow Advisory. Roads may be slippery.',
            icon: 'cloud-snow',
            color: '#F59E0B',
        };
    }

    if (visibility >= 1 && visibility < 3) {
        return {
            level: 'caution',
            message: 'Reduced Visibility. Drive with caution.',
            icon: 'eye',
            color: '#F59E0B',
        };
    }

    if (weather.uv >= 8) {
        return {
            level: 'caution',
            message: 'High UV Index. Wear sunscreen and protective clothing.',
            icon: 'sun',
            color: '#F59E0B',
        };
    }

    // No alert for perfect conditions
    return null;
};

/**
 * Generate dynamic weather descriptions
 */
export const generateWeatherDescription = (
    current: CurrentWeather
): WeatherDescription => {
    const temp = current.temp_c;
    const feelsLike = current.feelslike_c;
    const condition = current.condition.text.toLowerCase();
    const tempDiff = feelsLike - temp;

    let primary = '';
    let secondary = '';

    // Temperature-based descriptions
    if (temp >= 30) {
        primary = 'Hot';
    } else if (temp >= 20) {
        primary = 'Warm';
    } else if (temp >= 10) {
        primary = 'Mild';
    } else if (temp >= 0) {
        primary = 'Cool';
    } else {
        primary = 'Cold';
    }

    // Feels-like context
    if (tempDiff > 3) {
        secondary = 'Feels warmer than actual temperature';
    } else if (tempDiff < -3) {
        secondary = 'Feels colder than actual temperature';
    } else if (temp >= 18 && temp <= 25 && !condition.includes('rain')) {
        secondary = 'Perfect weather for outdoor activities';
    } else if (condition.includes('clear') || condition.includes('sunny')) {
        secondary = 'Clear skies and pleasant conditions';
    } else if (condition.includes('rain')) {
        secondary = "Don't forget your umbrella";
    } else if (condition.includes('snow')) {
        secondary = 'Bundle up and stay warm';
    } else if (condition.includes('cloud')) {
        secondary = 'Overcast but comfortable';
    } else {
        secondary = 'Check conditions before heading out';
    }

    return { primary, secondary };
};

/**
 * Determine activity feasibility based on weather
 */
export const getActivityFeasibility = (
    weather: CurrentWeather,
    activity: 'hiking' | 'running' | 'cycling' | 'driving' | 'fishing' | 'gardening' | 'stargazing' | 'bbq'
): { feasible: boolean; reason: string; color: string } => {
    const temp = weather.temp_c;
    const windSpeed = weather.wind_kph;
    const condition = weather.condition.text.toLowerCase();
    const uv = weather.uv;
    const visibility = weather.vis_km;

    // Common severe conditions
    if (
        condition.includes('storm') ||
        condition.includes('thunder') ||
        windSpeed > 40
    ) {
        return {
            feasible: false,
            reason: 'Severe weather conditions',
            color: '#EF4444',
        };
    }

    if (temp > 38 || temp < -5) {
        return {
            feasible: false,
            reason: 'Extreme temperature',
            color: '#EF4444',
        };
    }

    // Activity-specific checks
    switch (activity) {
        case 'hiking':
            if (condition.includes('rain') && !condition.includes('light')) {
                return {
                    feasible: false,
                    reason: 'Heavy rain - trails may be slippery',
                    color: '#F59E0B',
                };
            }
            if (temp >= 15 && temp <= 28 && windSpeed < 25) {
                return {
                    feasible: true,
                    reason: 'Ideal hiking conditions',
                    color: '#10B981',
                };
            }
            return {
                feasible: true,
                reason: 'Acceptable conditions',
                color: '#F59E0B',
            };

        case 'running':
            if (temp > 32) {
                return {
                    feasible: false,
                    reason: 'Too hot for safe running',
                    color: '#EF4444',
                };
            }
            if (uv >= 8 && temp > 25) {
                return {
                    feasible: false,
                    reason: 'High UV and heat - run early/late',
                    color: '#F59E0B',
                };
            }
            if (temp >= 10 && temp <= 25 && !condition.includes('rain')) {
                return {
                    feasible: true,
                    reason: 'Perfect running weather',
                    color: '#10B981',
                };
            }
            return {
                feasible: true,
                reason: 'Acceptable for running',
                color: '#F59E0B',
            };

        case 'cycling':
            if (windSpeed > 30) {
                return {
                    feasible: false,
                    reason: 'Too windy for safe cycling',
                    color: '#EF4444',
                };
            }
            if (condition.includes('rain')) {
                return {
                    feasible: false,
                    reason: 'Wet roads - reduced traction',
                    color: '#F59E0B',
                };
            }
            if (temp >= 12 && temp <= 28 && windSpeed < 20) {
                return {
                    feasible: true,
                    reason: 'Great cycling conditions',
                    color: '#10B981',
                };
            }
            return {
                feasible: true,
                reason: 'Acceptable for cycling',
                color: '#F59E0B',
            };

        case 'driving':
            if (visibility < 1 || condition.includes('fog') || condition.includes('blizzard')) {
                return {
                    feasible: false,
                    reason: 'Poor visibility',
                    color: '#EF4444',
                };
            }
            if (condition.includes('ice') || condition.includes('freezing')) {
                return {
                    feasible: false,
                    reason: 'Icy roads likely',
                    color: '#EF4444',
                };
            }
            if (condition.includes('rain')) {
                return {
                    feasible: true,
                    reason: 'Drive with caution',
                    color: '#F59E0B',
                };
            }
            return {
                feasible: true,
                reason: 'Good driving conditions',
                color: '#10B981',
            };

        case 'fishing':
            if (windSpeed > 30 || condition.includes('storm')) {
                return {
                    feasible: false,
                    reason: 'Unsafe conditions',
                    color: '#EF4444',
                };
            }
            if (condition.includes('rain') || condition.includes('overcast')) {
                return {
                    feasible: true,
                    reason: 'Excellent fishing weather',
                    color: '#10B981',
                };
            }
            return {
                feasible: true,
                reason: 'Good conditions',
                color: '#10B981',
            };

        case 'gardening':
            if (condition.includes('rain') || windSpeed > 40) {
                return {
                    feasible: false,
                    reason: 'Not suitable today',
                    color: '#EF4444',
                };
            }
            if (temp > 32) {
                return {
                    feasible: false,
                    reason: 'Too hot for gardening',
                    color: '#F59E0B',
                };
            }
            return {
                feasible: true,
                reason: 'Great day for gardening',
                color: '#10B981',
            };

        case 'stargazing':
            if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('rain')) {
                return {
                    feasible: false,
                    reason: 'Cloudy/Obstructed view',
                    color: '#EF4444',
                };
            }
            return {
                feasible: true,
                reason: 'Clear skies!',
                color: '#10B981',
            };

        case 'bbq':
            if (condition.includes('rain') || windSpeed > 25) {
                return {
                    feasible: false,
                    reason: 'Rain or wind expected',
                    color: '#EF4444',
                };
            }
            if (temp < 10) {
                return {
                    feasible: false,
                    reason: 'Too cold for BBQ',
                    color: '#F59E0B',
                };
            }
            return {
                feasible: true,
                reason: 'Perfect BBQ weather',
                color: '#10B981',
            };

        default:
            return {
                feasible: true,
                reason: 'Check conditions',
                color: '#6B7280',
            };
    }
};
