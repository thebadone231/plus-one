import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator } from './screens/Tab Navigation/TabNavigator';
import { AuthenticationStackScreen } from './screens/Stack Navigation/AuthenticationStackScreen';
import { isSignedIn } from './services/Firebase';

export default function App() {
  return (
    <NavigationContainer>
      {isSignedIn ? <TabNavigator /> : <AuthenticationStackScreen />}
    </NavigationContainer>
  );
}
