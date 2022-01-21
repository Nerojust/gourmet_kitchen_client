import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import { horizontalAnimation } from '../Animation';
import BreadListScreen from '../../screens/bread-list';

const BreadList = createNativeStackNavigator();

export const BreadListStackNavigator = () => {
  return (
    <BreadList.Navigator
      initialRouteName="BreadList"
      screenOptions={horizontalAnimation}
    >
      <BreadList.Screen name="BreadList" component={BreadListScreen} />
    </BreadList.Navigator>
  );
};
