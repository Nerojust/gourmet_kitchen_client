//import liraries
import React, { Component, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLOURS } from '../utils/Colours';
import { GOOGLEAPI_KEY } from '../utils/Constants';
import { deviceWidth } from '../utils/responsive-screen';

// create a component
const GoogleSearchComponent = ({
  handleResult,
  address,
  getProps,
  handleNotFound,
  addressRef,
  holderName = 'Address'
}) => {
  // const ref = useRef();

  useEffect(() => {
    addressRef.current?.setAddressText(address);
  }, [address]);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={holderName}
        placeholderTextColor={COLOURS.red}
        minLength={1}
        autoFillOnNotFound
        ref={addressRef}
        autoFocus={false}
        isRowScrollable
        keyboardShouldPersistTaps={'handled'}
        enablePoweredByContainer={false}
        returnKeyType={'next'}
        fetchDetails={true}
        textInputProps={{
          onChangeText: getProps
        }}
        styles={{
          textInputContainer: {
            color: COLOURS.black,
            fontSize: 14,
            alignSelf: 'center',
            fontFamily: 'Averta-Regular',
            width: deviceWidth / 1.15
            //placeholderTextColor:COLOURS.textInputColor
          },

          textInput: {
            backgroundColor: COLOURS.lightGray5,
            fontSize: 14,
            paddingLeft: 16,
            height: 50,
            borderRadius: 10
            // placeholderTextColor:COLOURS.textInputColor
          },
          listView: {
            marginHorizontal: 43,
            borderRadius: 10,
            borderColor: COLOURS.lightGray
          }
        }}
        onPress={handleResult}
        onFail={handleNotFound}
        query={{
          key: GOOGLEAPI_KEY,
          language: 'en',
          components: 'country:ng'
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default GoogleSearchComponent;
