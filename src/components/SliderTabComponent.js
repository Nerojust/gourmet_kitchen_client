//import liraries
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import {
  deviceHeight,
  deviceWidth,
  fp,
  hp,
  wp,
} from '../utils/responsive-screen';
import {COLOURS} from '../utils/Colours';
import ProductSans from './Text/ProductSans';

// create a component
const SliderTabComponent = ({
  tabRef,
  name1,
  name2,
  name3,
  onPress1,
  onPress2,
  onPress3,
  style,
  selectedTab,
  isTabClicked,
}) => {
  const [active, setActive] = useState(0);
  const [xTabOne, setXTabOne] = useState(0);
  const [xTabTwo, setXTabTwo] = useState(0);
  const [xTabThree, setXTabThree] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));

  const handleSlide = type => {
    Animated.timing(translateX, {
      toValue: type,
      duration: 330,
      useNativeDriver: false,
    }).start();
  };

  const pressed1 = () => {
    handleSlide(xTabOne);
    setActive(0);
    //setTimeout(() => {
    onPress1();
    //}, 330);
  };

  const pressed2 = () => {
    handleSlide(xTabTwo);
    setActive(1);
    //setTimeout(() => {
    onPress2();
    // }, 313);
  };

  const pressed3 = () => {
    handleSlide(xTabThree);
    setActive(2);
    //setTimeout(() => {
    onPress3();
    //}, 330);
  };

  return (
    <View style={styles.containerView}>
      <TouchableOpacity style={styles.parentView} activeOpacity={0.7}>
        <View style={styles.mainView}>
          <Animated.View style={styles.animatedStyle(translateX, active)} />
          <TouchableOpacity
            style={styles.tabView}
            onLayout={event => setXTabOne(event.nativeEvent.layout.x)}
            onPress={pressed1}>
            <ProductSans style={styles.allText(active)}>{name1}</ProductSans>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabView}
            onLayout={event => setXTabTwo(event.nativeEvent.layout.x)}
            onPress={pressed2}>
            <ProductSans style={styles.centerText(active)}>{name2}</ProductSans>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabView}
            onLayout={event => setXTabThree(event.nativeEvent.layout.x)}
            onPress={pressed3}>
            <ProductSans style={styles.onlineText(active)}>{name3}</ProductSans>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
    // backgroundColor: "#2c3e50",
  },
  titleTabText: {
    fontSize: fp(14),
    color: COLOURS.labelTextColor,
    //right: -10,
  },
  swipeView: {
    paddingTop: 3,
    backgroundColor: COLOURS.white,
  },
  tabView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: COLOURS.blue,
  },
  sliderBg: {
    position: 'absolute',
    width: Platform.OS == 'ios' ? deviceWidth / 5.5 : wp(deviceHeight * 0.11),
    height: '85%',

    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOURS.blue,
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  animatedStyle: (translateX, active) => ({
    position: 'absolute',
    width: '35%',
    height: '100%',
    top: 0,
    left: active == 0 ? wp(-5) : 0,
    backgroundColor: COLOURS.blue,
    borderRadius: 20,
    transform: [
      {
        translateX: translateX,
      },
    ],
  }),
  mainView: {
    flexDirection: 'row',
    height: '100%',
    position: 'relative',
    width: '90%',
    borderRadius: 20,
  },
  parentView: {
    width: '70%',
    height:
      Platform.OS == 'android' ? deviceHeight * 0.048 : deviceHeight * 0.045,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLOURS.lightGray5,
  },
  containerView: {
    //flex: 1,
    borderRadius: 20,
    paddingVertical: hp(3),
    backgroundColor: COLOURS.white,
  },
  allText: active => ({
    color: active === 0 ? COLOURS.white : COLOURS.textInputColor,
    left: active == 0 ? wp(-5) : 0,
    textAlign: 'center',
    fontSize: fp(14),
  }),
  centerText: active => ({
    color: active === 1 ? COLOURS.white : COLOURS.textInputColor,
    textAlign: 'center',
    fontSize: fp(14),
  }),
  onlineText: active => ({
    color: active === 2 ? COLOURS.white : COLOURS.textInputColor,
    textAlign: 'center',
    fontSize: fp(14),
  }),
  tabSelectorView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    // width:
    //   Platform.OS == "ios" ? hp(deviceHeight / 4.1): wp(deviceHeight * 0.35),
    width: fp(deviceWidth * 0.65),
    //height:  Platform.OS == "ios" ? wp(deviceHeight * 0.040):wp(deviceHeight * 0.045),
    height: fp(40),
    backgroundColor: COLOURS.lightGray5,
    borderRadius: 20,
    //paddingHorizontal: 25,
    //overflow:"hidden"
    //flex: 1,
  },
});

//make this component available to the app
export default SliderTabComponent;
