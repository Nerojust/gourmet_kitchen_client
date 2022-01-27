//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {COLOURS} from '../utils/Colours';

// create a component
export default class ColourComponent extends Component {
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
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
  };
  render() {
    //console.log('colourtype is ', this.props.colourType);
    const animatedStyle = {
      opacity: this.state.animation,
    };
    return (
      <View>
        <Animated.View
          style={[
            styles.container(this.props.colourType),
            animatedStyle,
            this.props.style,
          ]}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: colourType => ({
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colourType,
    borderRadius: 20,
    width: 15,
    height: 15,
  }),
});
