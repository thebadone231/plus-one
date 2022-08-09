import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityScreen from '../Main Interface/Activity';

const ActivityStack = createStackNavigator();

const ActivityStackScreen = () => {
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivityStack.Screen name="ActivityScreen" component={ActivityScreen} />
    </ActivityStack.Navigator>
  );
};

export default ActivityStackScreen;
