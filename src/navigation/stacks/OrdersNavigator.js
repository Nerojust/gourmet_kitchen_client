import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import { horizontalAnimation } from '../Animation';
import OrderDetailsScreen from '../../screens/order-details';
import OrdersScreen from '../../screens/orders';

const Orders = createNativeStackNavigator();

export const OrderStackNavigator = () => {
  return (
    <Orders.Navigator
      initialRouteName="Orders"
      screenOptions={horizontalAnimation}
    >
      <Orders.Screen name="Orders" component={OrdersScreen} />
      <Orders.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Orders.Navigator>
  );
};
