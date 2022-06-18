import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { TabNavigator } from '../screens/Tab Navigation/TabNavigator';
import { AuthenticationStackScreen } from '../screens/Stack Navigation/AuthenticationStackScreen';

import { AuthenticationContext } from './Firebase';

export const Navigation = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthenticationStackScreen />}
    </NavigationContainer>
  );
};
