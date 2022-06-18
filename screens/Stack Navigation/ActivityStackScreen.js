import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityScreen from '../Main Interface/Activity';
import HomeScreen from '../Main Interface/Home';

const ActivityStack = createStackNavigator();

const ActivityStackScreen = () => {
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivityStack.Screen name="ActivityScreen" component={ActivityScreen} />
      <ActivityStack.Screen name="HomeScreen" component={HomeScreen} />
    </ActivityStack.Navigator>
  );
};

export default ActivityStackScreen;
