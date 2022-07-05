import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation} from '../Animation';
import AnalyticsScreen from '../../screens/analytics';
import TransactionsScreen from '../../screens/transactions';

const Transactions = createNativeStackNavigator();

export const TransactionsStackNavigator = () => {
  return (
    <Transactions.Navigator
      initialRouteName="Analytics"
      screenOptions={horizontalAnimation}>
      <Transactions.Screen name="Transactions" component={TransactionsScreen} />
    </Transactions.Navigator>
  );
};
