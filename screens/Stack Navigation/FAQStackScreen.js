import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FAQScreen from '../Main Interface/FAQ';
import HomeScreen from '../Main Interface/Home';

const FAQStack = createStackNavigator();

const FAQStackScreen = () => {
  return (
    <FAQStack.Navigator screenOptions={{ headerShown: false }}>
      <FAQStack.Screen name="FAQScreen" component={FAQScreen} />
      <FAQStack.Screen name="HomeScreen" component={HomeScreen} />
    </FAQStack.Navigator>
  );
};

export default FAQStackScreen;
