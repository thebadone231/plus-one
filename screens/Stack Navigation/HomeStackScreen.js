import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Main Interface/Home';
import ChatScreen from '../Main Interface/Chat';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
