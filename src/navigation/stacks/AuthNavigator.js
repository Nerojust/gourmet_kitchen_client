import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { horizontalAnimation } from '../Animation';
import LoginScreen from '../../screens/login';
import SignUpScreen from '../../screens/sign-up';

const Login = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Login.Navigator
      initialRouteName="Login"
      screenOptions={horizontalAnimation}
    >
      <Login.Screen name="Login" component={LoginScreen} />
      <Login.Screen name="SignUp" component={SignUpScreen} />
     
    </Login.Navigator>
  );
};
