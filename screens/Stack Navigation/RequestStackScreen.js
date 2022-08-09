import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RequestScreen from '../Main Interface/Request';

const RequestStack = createStackNavigator();

const RequestStackScreen = () => {
  return (
    <RequestStack.Navigator screenOptions={{ headerShown: false }}>
      <RequestStack.Screen name="RequestScreen" component={RequestScreen} />
    </RequestStack.Navigator>
  );
};

export default RequestStackScreen;
