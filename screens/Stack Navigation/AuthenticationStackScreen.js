import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Login/Login';
import NewUser from '../Login/NewUser';
import ForgotPassword from '../Login/ForgotPassword';

const AuthenticationStack = createStackNavigator();

export const AuthenticationStackScreen = () => {
  return (
    <AuthenticationStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthenticationStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthenticationStack.Screen name="NewUser" component={NewUser} />
      <AuthenticationStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
      />
    </AuthenticationStack.Navigator>
  );
};
