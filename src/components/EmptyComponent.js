//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {deviceHeight, deviceWidth, wp} from '../utils/responsive-screen';
import Averta from './Text/Averta';

// create a component
const EmptyComponent = ({children, title, image, style, imageStyle}) => {
  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center', ...style}}>
        <Image style={[styles.image, imageStyle]} source={image} />

        <Averta style={[styles.title]}>{title}</Averta>
        {children}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
    //paddingVertical: 30,
    //flex:1,
  },
  image: {
    width: wp(116),
    height: wp(116),
  },
  title: {
    marginTop: 15,
    color: COLOURS.textInputColor,
    paddingHorizontal: wp(50),
    textAlign: 'center',
  },
});

//make this component available to the app
export default EmptyComponent;
