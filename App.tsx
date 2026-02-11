import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from './src/context/SettingsContext';
import { WeatherProvider } from './src/context/WeatherContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SettingsProvider>
      <WeatherProvider>
        <NotificationProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </NotificationProvider>
      </WeatherProvider>
    </SettingsProvider>
  );
}
