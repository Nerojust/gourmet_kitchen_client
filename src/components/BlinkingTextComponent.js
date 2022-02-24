//import liraries
import React, {Component, useRef, useState, useEffect} from 'react';
import {View, Animated, Text, StyleSheet} from 'react-native';
import {COLOURS} from '../utils/Colours';

// create a component
export default class BlinkingTextComponent extends Component {
  constructor() {
    super();
    this.state = {
      animation: new Animated.Value(1),
    };
  }
  componentDidMount() {
    this.startAnimation();
  }
  startAnimation = () => {
    setInterval(() => {
      Animated.timing(this.state.animation, {
        toValue: 0,
        timing: 600,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }).start();
      });
    }, 2000);
  };
  render() {
    const animatedStyle = {
      opacity: this.state.animation,
    };

    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.text, animatedStyle, this.props.style]}>
          If the delivery address is not auto-detected, enter the city e.g Lekki
          Phase 1 or Surulere
        </Animated.Text>
      </View>
    );
  }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 44,
    color: COLOURS.red,
    fontSize: 9,
  },
});
