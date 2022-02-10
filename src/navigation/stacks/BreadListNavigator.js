import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import { horizontalAnimation } from '../Animation';
import BreadListScreen from '../../screens/bread-list';
import BreadListDetailsScreen from '../../screens/breadlist-details';
import NewSetScreen from '../../screens/new-set';
import SetListScreen from '../../screens/setlist';
import SetDetailsScreen from '../../screens/set-details';

const BreadList = createNativeStackNavigator();

export const BreadListStackNavigator = () => {
  return (
    <BreadList.Navigator
      initialRouteName="BreadList"
      screenOptions={horizontalAnimation}
    >
      <BreadList.Screen name="BreadList" component={BreadListScreen} />
      <BreadList.Screen name="BreadListDetails" component={BreadListDetailsScreen} />
      <BreadList.Screen name="AddSet" component={NewSetScreen} />
      <BreadList.Screen name="SetList" component={SetListScreen} />
      <BreadList.Screen name="SetDetails" component={SetDetailsScreen} />
    </BreadList.Navigator>
  );
};
