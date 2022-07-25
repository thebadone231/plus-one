import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityScreen from '../Main Interface/Activity';
import FAQScreen from '../Main Interface/FAQ';
import HomeScreen from '../Main Interface/Home';
import ProfileScreen from '../Main Interface/Profile';
import RequestScreen from '../Main Interface/Request';
import ChatScreen from '../Main Interface/Chat';

const ChatStack = createStackNavigator();

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
    </ChatStack.Navigator>
  );
};

export default ChatStackScreen;
