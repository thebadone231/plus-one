import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../Login/Login';
import NewUser from '../Login/NewUser';
import ForgotPassword from '../Login/ForgotPassword';

const AuthenticationStack = createStackNavigator();

export const AuthenticationStackScreen = () => (
  <AuthenticationStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthenticationStack.Screen name="Login" component={LoginScreen} />
    <AuthenticationStack.Screen name="NewUser" component={NewUser} />
    <AuthenticationStack.Screen
      name="Forgot Password"
      component={ForgotPassword}
    />
  </AuthenticationStack.Navigator>
);
