import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation} from '../Animation';
import StoreSalesScreen from '../../screens/store-sales';

const StoreSales = createNativeStackNavigator();

export const StoreSalesStackNavigator = () => {
  return (
    <StoreSales.Navigator
      initialRouteName="StoreSales"
      screenOptions={horizontalAnimation}>
      <StoreSales.Screen name="StoreSales" component={StoreSalesScreen} />
    </StoreSales.Navigator>
  );
};
