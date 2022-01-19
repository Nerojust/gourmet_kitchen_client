//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Platform} from 'react-native';
import {COLOURS} from '../utils/Colours';
import { fp } from '../utils/responsive-screen';

// create a component
const TextInputComponent = ({
  placeholder,
  handleTextChange,
  defaultValue,
  onSubmitEditing,
  keyboardType,
  refValue,
  secureTextEntry,
  handleTextInputFocus,
  returnKeyType,
  props,
  handleBlur,
  heightfigure,
  widthFigure,
  multiline,
  length,
  editable,
  capitalize = 'none',
  paddingLeft = 16,
}) => {
  return (
    <TextInput
      style={[
        styles.textInput,
        {height: heightfigure, width: widthFigure, paddingLeft: paddingLeft},
        props,
      ]}
      blurOnSubmit={false}
      placeholder={placeholder}
      placeholderTextColor={COLOURS.textInputColor}
      onChangeText={handleTextChange}
      underlineColor={COLOURS.white}
      defaultValue={defaultValue && defaultValue.trim()}
      ref={refValue}
      onFocus={handleTextInputFocus}
      onBlur={handleBlur}
      onSubmitEditing={onSubmitEditing}
      returnKeyLabel={'Next'}
      returnKeyType={returnKeyType}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={capitalize}
      multiline={multiline}
      editable={editable}
      //clearButtonMode={"always"}
      textAlignVertical={multiline ? 'top' : null}
      maxLength={length}
    />
  );
};

// define your styles
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: COLOURS.lightGray5,
    paddingLeft: 16,
    color: COLOURS.black,
    borderWidth: 0.7,
    borderRadius: 10,
    fontSize: fp(15),
    alignSelf: 'center',
    fontFamily: 'ProductSans-Regular',
    //letterSpacing: -0.4,
  },
});

//make this component available to the app
export default TextInputComponent;
