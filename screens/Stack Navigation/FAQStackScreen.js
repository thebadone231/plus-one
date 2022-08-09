import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FAQScreen from '../Main Interface/FAQ';

const FAQStack = createStackNavigator();

const FAQStackScreen = () => {
  return (
    <FAQStack.Navigator screenOptions={{ headerShown: false }}>
      <FAQStack.Screen name="FAQScreen" component={FAQScreen} />
    </FAQStack.Navigator>
  );
};

export default FAQStackScreen;
