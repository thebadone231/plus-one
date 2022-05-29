import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/Login/Login';
import NewUser from './screens/Login/NewUser';
import ForgotPassword from './screens/Login/ForgotPassword';
import Profile from './screens/Profile';
import MainInterface from './screens/MainInterface';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="NewUser"
          options={{ headerShown: false }}
          component={NewUser}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ headerShown: false }}
          component={ForgotPassword}
        />
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
          component={Profile}
        />
        <Stack.Screen
          name="MainInterface"
          options={{ headerShown: false }}
          component={MainInterface}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
