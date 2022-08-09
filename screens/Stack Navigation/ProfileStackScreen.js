import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Main Interface/Profile';

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
