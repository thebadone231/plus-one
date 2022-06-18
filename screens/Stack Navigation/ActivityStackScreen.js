import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import ActivityScreen from '../Main Interface/Activity';

const ActivityStack = createStackNavigator();

const ActivityStackScreen = () => {
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivityStack.Screen name="Activity" component={ActivityScreen} />
    </ActivityStack.Navigator>
  );
};

export default ActivityStackScreen;
