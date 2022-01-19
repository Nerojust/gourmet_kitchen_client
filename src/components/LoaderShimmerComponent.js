import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {COLOURS} from '../utils/Colours';
import {deviceHeight, deviceWidth} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

const LoaderShimmerComponent = ({
  isLoading,
  isFullScreen,
  loadingMessage,
  extraMessage,
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, isFullScreen && {height: deviceHeight}]}>
        <Shimmer
          animating={isLoading}
          duration={2000}
          direction={'right'}
          opacity={0.03}
          animationOpacity={1}>
          <ProductSans style={{color: COLOURS.textInputColor, fontSize: 14}}>
            Please wait while we
          </ProductSans>
        </Shimmer>
        <Shimmer
          animating={isLoading}
          duration={2000}
          direction={'right'}
          opacity={0.02}
          animationOpacity={1}>
          <ProductSans style={{color: COLOURS.textInputColor, fontSize: 14}}>
            {loadingMessage || 'load your data'}
          </ProductSans>
        </Shimmer>
        <Shimmer
          animating={isLoading}
          duration={2000}
          direction={'right'}
          opacity={0.02}
          animationOpacity={1}>
          <ProductSans style={{color: COLOURS.textInputColor, fontSize: 14}}>
            {extraMessage}
          </ProductSans>
        </Shimmer>
      </View>
    );
  }
  return null;
};
const styles = StyleSheet.create({
  container: {
    //bottom: 10,
    height: deviceHeight,
    width: deviceWidth,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default LoaderShimmerComponent;
