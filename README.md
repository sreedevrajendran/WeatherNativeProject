# Aqu Weather 🌦️

A modern, cross-platform weather application for iOS and Android built with React Native and Expo. Features real-time weather data, AI-powered alerts, and a beautiful glassmorphism UI inspired by the [meteoraforecast.netlify.app](https://meteoraforecast.netlify.app) web application.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### Core Functionality
- **Real-time Weather**: Current conditions, temperature, humidity, wind, pressure, and more
- **Hourly & Daily Forecasts**: Detailed 24-hour and 7-day weather predictions
- **Location Services**: Automatic geolocation and city search with "Save Location" feature
- **Dynamic Descriptions**: User-friendly context like "Feels warmer", "Perfect weather", or "Bundle up"

### Smart Alerts System 🚨
- **AI-Powered Analysis**: Intelligently analyzes weather conditions to provide color-coded alerts
  - 🔴 **Red**: Severe conditions (Extreme heat >40°C, Storms, High winds)
  - 🟡 **Yellow**: Cautionary (Heat/Cold advisory, Heavy rain)
  - 🟢 **Green**: Perfect conditions (Comfortable temp, clear skies)
- **Visibility Tracking**: Real-time visibility data with "Low viz" warnings
- **Location-Based Notifications**: Automatic weather alerts based on your current location

### User Customization ⚙️
- **Persistent Settings**: User preferences stored locally with AsyncStorage
- **Configurable Dashboard**: Toggle widgets (Wind, Humidity, UV, etc.) on/off
- **Unit Conversion**: Celsius/Metric vs Fahrenheit/Imperial switching
- **Activity Recommendations**: Hiking, Running, Cycling feasibility based on weather
- **Push Notifications**: Enable/disable weather alerts for location changes

### Technical & UI
- **Glassmorphism Design**: Modern, translucent UI components with smooth animations
- **Responsive**: Fully optimized for all screen sizes
- **Privacy Focused**: Dedicated Privacy Statement page
- **Pull-to-Refresh**: Easy data updates

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **Notifications**: Expo Notifications with Background Tasks
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Weather API**: [WeatherAPI.com](https://www.weatherapi.com/)

## 📂 Project Structure

```
WeatherNativeApp/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx          # Glassmorphism card component
│   │   │   └── GradientBackground.tsx  # Dynamic gradient backgrounds
│   │   └── weather/
│   │       ├── CurrentWeather.tsx      # Main weather display
│   │       ├── WeatherAlert.tsx        # Alert system component
│   │       ├── HourlyForecast.tsx      # 24-hour forecast
│   │       ├── DailyForecast.tsx       # 7-day forecast
│   │       ├── WeatherDetails.tsx      # Weather metrics grid
│   │       └── ActivityRecommendations.tsx
│   ├── context/
│   │   ├── SettingsContext.tsx         # Settings state management
│   │   ├── WeatherContext.tsx          # Weather data state
│   │   └── NotificationContext.tsx     # Notification state
│   ├── navigation/
│   │   └── AppNavigator.tsx            # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx              # Main dashboard
│   │   ├── SearchScreen.tsx            # City search
│   │   ├── SettingsScreen.tsx          # User settings
│   │   └── PrivacyScreen.tsx           # Privacy policy
│   ├── services/
│   │   ├── weatherApi.ts               # Weather API integration
│   │   ├── locationService.ts          # Location services
│   │   └── notificationService.ts      # Push notifications
│   ├── types/
│   │   └── weather.ts                  # TypeScript definitions
│   └── utils/
│       ├── weatherAnalyzer.ts          # AI-powered analysis
│       └── unitConverter.ts            # Unit conversions
├── App.tsx                             # Root component
├── app.json                            # Expo configuration
└── package.json                        # Dependencies

```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)
- WeatherAPI.com API key ([Get one free here](https://www.weatherapi.com/signup.aspx))

### Installation

1. **Clone the repository**
   ```bash
   cd WeatherNativeApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```
   
   Replace `your_api_key_here` with your actual WeatherAPI.com API key.

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - **iOS**: Press `i` to open iOS Simulator (macOS only) or scan QR code with Camera app
   - **Android**: Press `a` to open Android Emulator or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 📱 Running on Physical Devices

### iOS (Requires macOS)
```bash
npx expo run:ios
```

### Android
```bash
npx expo run:android
```

## 🚀 Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

*Note: You'll need to set up an [Expo Application Services (EAS)](https://expo.dev/eas) account for production builds.*

## 🎨 Features Walkthrough

### Home Screen
- Dynamic gradient background based on weather conditions
- Current weather with temperature, condition, and location
- Color-coded smart alerts
- Horizontal scrolling hourly forecast
- Weather details grid (toggleable widgets)
- Activity recommendations
- 7-day forecast

### Search Screen
- City search with autocomplete
- Saved locations list
- Quick access to favorite cities

### Settings Screen
- **Notifications**: Enable/disable location-based weather alerts
- Temperature unit toggle (Celsius/Fahrenheit)
- Widget visibility controls
- Activity preference toggles
- Saved locations management
- Reset to default settings
- Privacy statement link

## 🔐 Privacy & Permissions

The app requires the following permissions:

### Location Permissions
- **Foreground Location**: To fetch weather for your current location
- **Background Location**: To send weather alerts when you travel to new locations (optional)

### Notification Permissions
- **Push Notifications**: To receive weather alerts (optional)

All user data is stored locally on the device using AsyncStorage. No personal information is sent to external servers except for weather data requests to WeatherAPI.com.

See the [Privacy Statement](src/screens/PrivacyScreen.tsx) for more details.

## 🐛 Troubleshooting

### "Location permission not granted"
- **iOS**: Go to Settings > Privacy > Location Services > Meteora Forecast > While Using the App
- **Android**: Go to Settings > Apps > Meteora Forecast > Permissions > Location > Allow

### "Failed to fetch weather data"
- Verify your API key is correctly set in the `.env` file
- Check your internet connection
- Ensure you haven't exceeded the free tier API limits (1M calls/month)

### "Notifications not working"
- **iOS**: Go to Settings > Notifications > Meteora Forecast > Allow Notifications
- **Android**: Go to Settings > Apps > Meteora Forecast > Notifications > Allow
- Ensure background location permission is granted for location-based alerts

### App crashes on startup
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Developer

**Sreedev Rajendran**
- Email: sreerajar40@gmail.com
- Web: [meteoraforecast.netlify.app](https://meteoraforecast.netlify.app)

## 🙏 Credits

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern weather app designs

---

Made with ❤️ by Sreedev Rajendran
