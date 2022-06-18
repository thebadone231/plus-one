import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import RequestScreen from '../Main Interface/Request';

const RequestStack = createStackNavigator();

const RequestStackScreen = () => {
  return (
    <RequestStack.Navigator screenOptions={{ headerShown: false }}>
      <RequestStack.Screen name="RequestStack" component={RequestScreen} />
    </RequestStack.Navigator>
  );
};

export default RequestStackScreen;
