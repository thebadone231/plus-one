import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
