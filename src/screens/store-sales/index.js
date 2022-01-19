//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { COLOURS } from '../../utils/Colours';

// create a component
const StoreSalesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>StoreSalesScreen </Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
  },
});

//make this component available to the app
export default StoreSalesScreen;
