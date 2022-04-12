//import liraries
import React, {Component} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {ACTIVE_OPACITY} from '../utils/Constants';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {deviceWidth, fp} from '../utils/responsive-screen';
// create a component
const LoaderButtonComponent = ({buttonRef, title, method}) => {
  return (
    <TouchableOpacity
      onPress={method.bind(this)}
      activeOpacity={ACTIVE_OPACITY}>
      <AnimateLoadingButton
        ref={c => (buttonRef.current = c)}
        width={deviceWidth / 1.15}
        height={50}
        title={title}
        onPress={null}
        //titleFontFamily={'Averta-Bold'}
        titleFontSize={fp(15)}
        titleColor={COLOURS.white}
        activityIndicatorColor={COLOURS.white}
        backgroundColor={COLOURS.blue}
        borderRadius={10}
        animationDurationWidth={Platform.OS == 'ios' ? 500 : 600}
      />
    </TouchableOpacity>
  );
};

//make this component available to the app
export default LoaderButtonComponent;
