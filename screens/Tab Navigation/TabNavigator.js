import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackScreen } from '../Stack Navigation/HomeStackScreen';
import ActivityStackScreen from '../Stack Navigation/ActivityStackScreen';
import RequestStackScreen from '../Stack Navigation/RequestStackScreen';
import MeStackScreen from '../Stack Navigation/MeStackScreen';
import FAQStackScreen from '../Stack Navigation/FAQStackScreen';

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Home: 'md-home',
  Activity: 'md-time',
  Request: 'md-add',
  Me: 'md-person',
  FAQ: 'md-help',
};

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
  };
};

export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={createScreenOptions}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      options={{ headerShown: false }}
      name="Home"
      component={HomeStackScreen}
    />
    <Tab.Screen
      options={{ headerShown: false }}
      name="Activity"
      component={ActivityStackScreen}
    />
    <Tab.Screen
      options={{ headerShown: false }}
      name="Request"
      component={RequestStackScreen}
    />
    <Tab.Screen
      options={{ headerShown: false }}
      name="Me"
      component={MeStackScreen}
    />
    <Tab.Screen
      options={{ headerShown: false }}
      name="FAQ"
      component={FAQStackScreen}
    />
  </Tab.Navigator>
);
