//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { COLOURS } from '../../utils/Colours';
import { BackViewMoreSettings } from '../../components/Header';
import { KeyboardObserverComponent } from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import { DismissKeyboard } from '../../utils/utils';

// create a component
const StoreSalesScreen = ({navigation}) => {
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Store Sales"
            onClose={() => navigation.goBack()}
          />
         
        </KeyboardObserverComponent>
      </DismissKeyboard>
    </ViewProviderComponent>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
  },
});

//make this component available to the app
export default StoreSalesScreen;
