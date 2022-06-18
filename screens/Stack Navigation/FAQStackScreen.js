import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import FAQScreen from '../Main Interface/FAQ';

const FAQStack = createStackNavigator();

const FAQStackScreen = () => {
  return (
    <FAQStack.Navigator screenOptions={{ headerShown: false }}>
      <FAQStack.Screen name="FAQ" component={FAQScreen} />
    </FAQStack.Navigator>
  );
};

export default FAQStackScreen;
