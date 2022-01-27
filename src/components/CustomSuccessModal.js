//import liraries
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Modal from 'react-native-modal';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {deviceHeight, deviceWidth, hp, wp} from '../utils/responsive-screen';

import SuccessPageComponent from './SuccessPageComponent';

// create a component
const CustomSuccessModal = ({isModalVisible, onPressButton, message}) => {
  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={100}
        animationOutTiming={20}
        useNativeDriver
        backdropColor={COLOURS.gray1}
        style={{
          backgroundColor: COLOURS.white,
          marginVertical: hp(deviceHeight / 3.2),
          marginHorizontal: wp(deviceWidth * 0.17),
          borderRadius: 20,
          alignItems: 'center',
        }}>
        <SuccessPageComponent
          onPress1={onPressButton}
          image={IMAGES.storeSetup}
          headerName1={'Successful'}
          headerSubName={message}
          buttonName1={'Continue'}
        />
      </Modal>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: "30%",
    //backgroundColor: COLOURS.zupa_gray_bg,
  },
  tag: {
    color: COLOURS.text_color,
    bottom: 0,
    fontSize: 12,
  },
  labelText: {
    color: COLOURS.text_color,
    //width: deviceWidth,
    // paddingVertical: 8,
    fontSize: 12,
  },
  text: {
    color: COLOURS.text_color,
    //width: deviceWidth,
    // paddingVertical: 8,
    fontSize: 14,
    paddingVertical: 15,
  },

  button: {
    //marginBottom: hp(40),
    //width: deviceWidth - wp(64),
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLOURS.blue,
    marginVertical: 5,
  },

  buttonText: {
    color: COLOURS.white,
    fontSize: hp(16),
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});

//make this component available to the app
export default CustomSuccessModal;
