// Weather data types
export interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

export interface AirQuality {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    'us-epa-index': number;
    'gb-defra-index': number;
}

export interface Astro {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
    is_moon_up: number;
    is_sun_up: number;
}

export interface CurrentWeather {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    condition: WeatherCondition;
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    uv: number;
    vis_km: number;
    vis_miles: number;
    gust_kph: number;
    gust_mph: number;
    is_day: number;
    last_updated: string;
    air_quality?: AirQuality;
    cloud: number;
}

export interface Location {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
}

export interface HourlyForecast {
    time: string;
    temp_c: number;
    temp_f: number;
    condition: WeatherCondition;
    chance_of_rain: number;
    chance_of_snow: number;
    wind_kph: number;
    wind_mph: number;
}

export interface DayForecast {
    date: string;
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: WeatherCondition;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    maxwind_kph: number;
    maxwind_mph: number;
    uv: number;
}

export interface DailyForecast {
    date: string;
    day: DayForecast;
    astro: Astro;
    hour: HourlyForecast[];
}

export interface WeatherData {
    location: Location;
    current: CurrentWeather;
    forecast: {
        forecastday: DailyForecast[];
    };
}

// Alert types
export type AlertLevel = 'severe' | 'caution' | 'perfect';

export interface WeatherAlert {
    level: AlertLevel;
    message: string;
    icon: string;
    color: string;
}

// Settings types
export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'system';

export interface WidgetVisibility {
    wind: boolean;
    humidity: boolean;
    uv: boolean;
    pressure: boolean;
    visibility: boolean;
    precipitation: boolean;
    feelsLike: boolean;
    aqi: boolean;
    dewPoint: boolean;
    sunset: boolean;
    sunrise: boolean;
    moonPhase: boolean;
    cloudiness: boolean;
}

export interface ActivityPreferences {
    hiking: boolean;
    running: boolean;
    cycling: boolean;
    driving: boolean;
    fishing: boolean;
    gardening: boolean;
    stargazing: boolean;
    bbq: boolean;
}

export interface SavedLocation {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
}

export interface NotificationPreferences {
    dailyForecast: boolean;    // 8:00 AM daily
    tomorrowForecast: boolean; // 7:00 PM daily
    weeklyForecast: boolean;   // 4:00 PM Sundays
    severeWeather: boolean;    // Severe alerts
    rainSnowAlerts: boolean;   // Precipitation alerts
}

export interface UserSettings {
    temperatureUnit: TemperatureUnit;
    widgetVisibility: WidgetVisibility;
    activityPreferences: ActivityPreferences;
    forecastInterval: 1 | 2 | 3;
    savedLocations: SavedLocation[];
    notificationPreferences: NotificationPreferences;
    newsEnabled: boolean;
    aboutContent?: string; // Cache for AI-generated app description
}

// Dynamic description type
export interface WeatherDescription {
    primary: string;
    secondary: string;
}
