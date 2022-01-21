//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOURS} from '../utils/Colours';

// create a component
const ColourComponent = ({colourType}) => {
  return <View style={styles.container(colourType)}></View>;
};

// define your styles
const styles = StyleSheet.create({
  container: colourType => ({
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      colourType == 'green'
        ? COLOURS.green2
        : colourType == 'orange'
        ? COLOURS.orange
        : COLOURS.gray,
    borderRadius: 20,
    width: 15,
    height: 15,
  }),
});

//make this component available to the app
export default ColourComponent;
