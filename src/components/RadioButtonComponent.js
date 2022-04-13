//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOURS } from '../utils/Colours';
import { fp } from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const RadioButtonComponent = ({
  radioButtonState,
  button1Name,
  button2Name,
  onClicked
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => onClicked('Male')}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: COLOURS.lightGray,
            backgroundColor:
              radioButtonState == 'Male' ? COLOURS.blue : COLOURS.white,
            marginRight: 5
          }}
        />
        <ProductSans style={{ color: COLOURS.textInputColor, fontSize: fp(15) }}>
          {button1Name}
        </ProductSans>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flexDirection: 'row', marginLeft: 20 }}
        onPress={() => onClicked('Female')}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: COLOURS.lightGray,
            backgroundColor:
              radioButtonState == 'Female' ? COLOURS.blue : COLOURS.white,
            marginRight: 5
          }}
        />
        <ProductSans style={{ color: COLOURS.textInputColor, fontSize: 14 }}>
          {button2Name}
        </ProductSans>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

//make this component available to the app
export default RadioButtonComponent;
