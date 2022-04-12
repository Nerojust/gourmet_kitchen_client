/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {AppStack} from './src/navigation/RootNavigation';
import {store} from './src/store/store';
import {COLOURS} from './src/utils/Colours';

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1500);
  }, []);

  return (
    <NavigationContainer>
      <Provider store={store}>
        <SafeAreaProvider style={sheet.container}>
          <AppStack />
        </SafeAreaProvider>
      </Provider>
    </NavigationContainer>
    //  <Provider store={store}>
    //    <PersistGate persistor={persistor}>
    //      <AppStack />
    //    </PersistGate>
    //  </Provider>
  );
};
const sheet = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLOURS.white},
});
export default App;
