import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation} from '../Animation';
import OrderDetailsScreen from '../../screens/order-details';
import OrdersScreen from '../../screens/orders';
import NewOrderScreen from '../../screens/new-order';
import OrderFulfillScreen from '../../screens/order-fulfill';
import DispatchMessageScreen from '../../screens/dispatch-msg';
import AddRiderScreen from '../../screens/add-rider';

const Orders = createNativeStackNavigator();

export const OrderStackNavigator = () => {
  return (
    <Orders.Navigator
      initialRouteName="Orders"
      screenOptions={horizontalAnimation}>
      <Orders.Screen name="Orders" component={OrdersScreen} />
      <Orders.Screen name="NewOrder" component={NewOrderScreen} />
      <Orders.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Orders.Screen name="OrderFulfill" component={OrderFulfillScreen} />
      <Orders.Screen name="CustomMessage" component={DispatchMessageScreen} />
      <Orders.Screen name="AddRider" component={AddRiderScreen} />
    </Orders.Navigator>
  );
};
