import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {horizontalAnimation} from './Animation';
import Loader from '../components/Loader';
import {persistor, store} from '../store/store';
import client from '../utils/Api';
import {HomeStackNavigator} from './stacks/HomeStackNavigator';
import {AuthNavigator} from './stacks/AuthNavigator';
import SplashScreen from 'react-native-splash-screen';

export const AppStack = () => {
  const AppNav = createNativeStackNavigator();

  //retrieve saved token and add to header before calls
  const {accessToken} = useSelector(x => x.users);
 

  //add to header
  client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <Loader isLoading isFullScreen loadingMessage={'Loading app'} />
        }
        persistor={persistor}>
        <PaperProvider>
          <AppNav.Navigator screenOptions={horizontalAnimation}>
            {!accessToken ? (
              <AppNav.Screen name="Auth" component={AuthNavigator} />
            ) : (
              <AppNav.Screen name="Home" component={HomeStackNavigator} />
            )}
          </AppNav.Navigator>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};
