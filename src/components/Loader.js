import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {deviceHeight, deviceWidth} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

const Loader = ({isLoading, isFullScreen, loadingMessage}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, isFullScreen && {height: deviceHeight}]}>
        <ActivityIndicator size="large" color={COLOURS.blue} />
        <ProductSans style={{color: COLOURS.blue, fontSize: 11}}>
          {loadingMessage}
        </ProductSans>
      </View>
    );
  }
  return null;
};
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: deviceHeight,
    width: deviceWidth,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default Loader;
