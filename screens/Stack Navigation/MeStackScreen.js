import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import MeScreen from '../Main Interface/Me';

const MeStack = createStackNavigator();

const MeStackScreen = () => {
  return (
    <MeStack.Navigator screenOptions={{ headerShown: false }}>
      <MeStack.Screen name="Me" component={MeScreen} />
    </MeStack.Navigator>
  );
};

export default MeStackScreen;
