import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AlertProvider } from './src/context/AlertContext';
import LoginScreen from './src/screens/LoginScreen';
import WeatherScreen from './src/screens/WeatherScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Weather" component={WeatherScreen} options={{ title: 'Recherche Météo' }} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </AlertProvider>
    </AuthProvider>
  );
}
