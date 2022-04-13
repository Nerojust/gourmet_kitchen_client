//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLOURS} from '../utils/Colours';
import {ACTIVE_OPACITY} from '../utils/Constants';
import {IMAGES} from '../utils/Images';
import {deviceHeight, deviceWidth, hp} from '../utils/responsive-screen';

// create a component
const RefreshComponent = ({
  goto,
  children,
  displayAdd = true,
  style
}) => {
  return (
    <TouchableOpacity
      onPress={goto}
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.iconshape, {...style}]}>
      {displayAdd ? (
        <Ionicons name="refresh" size={hp(27)} color={COLOURS.white} />
      ) : null}
      {children}
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  iconshape: {
    width: 60,
    height: 60,
    backgroundColor: COLOURS.blue,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: deviceHeight * 0.02,
    right: deviceWidth * 0.03,
    shadowColor: COLOURS.gray,
    shadowOffset: {
      width: -1,
      height: 1,
    },
    elevation: 2,
    shadowOpacity: 1.13,
    shadowRadius: 2.05,
  },
  iconImage: {width: 21, height: 21, tintColor: COLOURS.lightGray2},
  transpClickableBg: {
    width: 40,
    height: 40,
    backgroundColor: COLOURS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipPlace: {left: deviceWidth * 0.03, bottom: deviceHeight * 0.025},
  clipIconView: {
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: COLOURS.lightGray1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -7,
    top: 10,
  },
});

//make this component available to the app
export default RefreshComponent;
