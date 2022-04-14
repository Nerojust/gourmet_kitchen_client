//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {fp} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const SingleRadioComponent = ({item, radioButtonName, onClicked}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => onClicked(item)}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: COLOURS.lightGray,
            backgroundColor:
              radioButtonName == item.name ? COLOURS.blue : COLOURS.white,
            marginRight: 5,
          }}
        />
        <ProductSans style={{color: COLOURS.textInputColor, fontSize: fp(15)}}>
          {item?.name}
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
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 30,
  },
});

//make this component available to the app
export default SingleRadioComponent;
