import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SafeArea from '../../screens/utility/SafeArea';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const FAQScreen = () => {
  return (
    <View>
      <Text>TODO: FAQ screen</Text>
    </View>
  );
};

export default FAQScreen;
