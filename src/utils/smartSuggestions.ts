import { CurrentWeather, DailyForecast } from '../types/weather';

/**
 * Generates a natural language "Daily Insight" based on current weather and forecast.
 * Avoids "AI" branding, focuses on helpful advice.
 */
export const generateDailyInsight = (current: CurrentWeather, todayForecast: DailyForecast): string => {
    const condition = current.condition.text.toLowerCase();
    const temp = current.temp_c;
    const wind = current.wind_kph;
    const uv = current.uv;

    // Arrays of phrases for variety
    const rainyPhrases = [
        "Don't forget your umbrella today!",
        "Rain is in the forecast. Perfect for indoor activities.",
        "Wet weather ahead. Drive safely and stay dry.",
        "Looks like a rainy day. Good time for a movie or book."
    ];

    const sunnyPhrases = [
        "Soak up the sun! It's a beautiful day.",
        "Clear skies and sunshine. Enjoy the outdoors!",
        "Perfect weather for a walk in the park.",
        "Bright and sunny. Don't forget your sunglasses!"
    ];

    const hotPhrases = [
        "It's heating up! Stay hydrated and cool.",
        "High temperatures today. Avoid strenuous outdoor activities at noon.",
        "Summer vibes! Don't forget sunscreen.",
        "It's a scorcher. Keep cool and drink water."
    ];

    const coldPhrases = [
        "Bundle up! It's crisp and cold outside.",
        "Chilly weather calling for warm layers and hot cocoa.",
        "Brisk conditions today. Stay warm!",
        "Winter feels. Make sure to wear a coat."
    ];

    const windyPhrases = [
        "Hold onto your hat! It's quite windy.",
        "Breezy conditions today. Valid excuse for messy hair!",
        "Strong winds expected. Secure loose outdoor items.",
        "Windy day ahead. Use caution if cycling."
    ];

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Logic to pick the best insight
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
        if (wind > 30) return "It's wet and windy. Best to stay indoors if possible.";
        return getRandom(rainyPhrases);
    }

    if (condition.includes('snow') || condition.includes('blizzard')) {
        return "Snow day! Drive carefully and enjoy the winter wonderland.";
    }

    if (uv > 7) {
        return "High UV levels today. Sunscreen is a must if you're going out.";
    }

    if (temp > 30) return getRandom(hotPhrases);
    if (temp < 5) return getRandom(coldPhrases);

    if (wind > 25) return getRandom(windyPhrases);

    if (condition.includes('sunny') || condition.includes('clear')) {
        return getRandom(sunnyPhrases);
    }

    if (condition.includes('cloud') || condition.includes('overcast')) {
        return "Cloudy skies today, but still a comfortable day to be out.";
    }

    return `Expect ${condition} today with a high of ${todayForecast.day.maxtemp_c}°C. Have a great day!`;
};

/**
 * Generates specific advice for an activity based on weather suitability.
 */
export const getActivityAdvice = (activity: string, weather: CurrentWeather, feasible: boolean): string => {
    if (!feasible) {
        switch (activity) {
            case 'running': return 'Maybe hit the treadmill instead?';
            case 'cycling': return 'Roads might be slippery or visibility low.';
            case 'driving': return 'Drive with extra caution today.';
            case 'fishing': return 'Fish might not be biting in this weather.';
            case 'stargazing': return 'Cloud cover will obscure the view.';
            case 'bbq': return 'Not the best day for grilling outside.';
            default: return 'Conditions aren\'t great for this right now.';
        }
    }

    // If feasible (Good/Ideal)
    const temp = weather.temp_c;
    switch (activity) {
        case 'running':
            return temp > 20 ? 'Great run weather, bring water!' : 'Crisp air, perfect for a jog.';
        case 'cycling':
            return 'Roads are dry and wind is low.';
        case 'driving':
            return 'Good visibility and dry roads.';
        case 'fishing':
            return 'Calm waters, good luck!';
        case 'stargazing':
            return 'Clear skies ahead tonight.';
        case 'bbq':
            return 'Fire up the grill, weather is perfect!';
        case 'hiking':
            return 'Trails should be in good condition.';
        case 'gardening':
            return 'Nice weather to tend to your plants.';
        default:
            return 'Conditions are looking good!';
    }
};
