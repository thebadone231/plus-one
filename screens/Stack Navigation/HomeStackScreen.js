import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityScreen from '../Main Interface/Activity';
import FAQScreen from '../Main Interface/FAQ';
import HomeScreen from '../Main Interface/Home';
import ProfileScreen from '../Main Interface/Profile';
import RequestScreen from '../Main Interface/Request';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="ActivityScreen" component={ActivityScreen} />
      <HomeStack.Screen name="RequestScreen" component={RequestScreen} />
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <HomeStack.Screen name="FAQScreen" component={FAQScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
