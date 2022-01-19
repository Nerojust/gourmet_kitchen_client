//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import TextInputComponent from '../../components/TextInputComponent';
import ProductSansBold from '../../components/Text/ProductSansBold';
import {COLOURS} from '../../utils/Colours';
import {deviceWidth} from '../../utils/responsive-screen';
import {DismissKeyboard} from '../../utils/utils';
import {BackViewMoreSettings} from '../../components/Header';
import {NavigationContainer} from '@react-navigation/native';

// create a component
const OrderDetailsScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isFullNameFieldFocused, setIsFullNameFieldFocused] = useState(false);

  return (
    <DismissKeyboard>
      <KeyboardObserverComponent>
        <BackViewMoreSettings
          backText="New Order"
          onClose={() => navigation.goBack()}
        />
        <View style={[styles.actions, {paddingVertical: 13}]}>
          <ProductSansBold style={styles.actiontext}>
            BASIC DETAILS
          </ProductSansBold>
        </View>

        <TextInputComponent
          placeholder={'Full Name'}
          //handleTextChange={handleCustomerInputSearchText}
          defaultValue={fullName}
          returnKeyType={'next'}
          keyboardType={'default'}
          secureTextEntry={false}
          capitalize={'sentences'}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          //refValue={fullNameRef}
          props={
            isFullNameFieldFocused
              ? {borderColor: COLOURS.blue}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => {
            setIsFullNameFieldFocused(true);
          }}
          handleBlur={() => {
            setIsFullNameFieldFocused(false);
          }}
          onSubmitEditing={event => {}}
        />
      </KeyboardObserverComponent>
    </DismissKeyboard>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
  },
});

//make this component available to the app
export default OrderDetailsScreen;
