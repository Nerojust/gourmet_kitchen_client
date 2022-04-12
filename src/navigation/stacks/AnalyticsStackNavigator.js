import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation} from '../Animation';
import AnalyticsScreen from '../../screens/analytics';

const Analytics = createNativeStackNavigator();

export const AnalyticsStackNavigator = () => {
  return (
    <Analytics.Navigator
      initialRouteName="Analytics"
      screenOptions={horizontalAnimation}>
      <Analytics.Screen name="Analytics" component={AnalyticsScreen} />
    </Analytics.Navigator>
  );
};
