//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { BackViewMoreSettings } from '../../components/Header';
import { KeyboardObserverComponent } from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import { DismissKeyboard } from '../../utils/utils';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  console.log('order details', route.params.order);
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Order Details"
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
    //backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default OrderDetailsScreen;
