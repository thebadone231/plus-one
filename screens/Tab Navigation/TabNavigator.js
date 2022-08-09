import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackScreen from '../Stack Navigation/HomeStackScreen';
import ActivityStackScreen from '../Stack Navigation/ActivityStackScreen';
import RequestStackScreen from '../Stack Navigation/RequestStackScreen';
import ProfileStackScreen from '../Stack Navigation/ProfileStackScreen';
import FAQStackScreen from '../Stack Navigation/FAQStackScreen';

const Tab = createBottomTabNavigator();

// icons for bottom tab navigator from expo vector-icons
const TAB_ICON = {
  Home: 'md-home',
  Activity: 'md-time',
  Request: 'md-add',
  Profile: 'md-person',
  FAQ: 'md-help',
};

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: [
      {
        display: 'flex',
      },
      null,
    ],
  };
};

export const TabNavigator = () => (
  <Tab.Navigator screenOptions={createScreenOptions}>
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
      name="Profile"
      component={ProfileStackScreen}
    />
    <Tab.Screen
      options={{ headerShown: false }}
      name="FAQ"
      component={FAQStackScreen}
    />
  </Tab.Navigator>
);
