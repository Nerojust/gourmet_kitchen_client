import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {deviceHeight, deviceWidth, fp, wp} from '../utils/responsive-screen';
import ProductSansBold from './Text/ProductSansBold';

const HeaderComponent = ({name, isDashboard}) => {
  return (
    <View
      style={[
        styles.headerContainerView,
        isDashboard
          ? {borderBottomWidth: 0.4, borderBottomColor: COLOURS.lightGray}
          : null,
      ]}>
      <>
        <Image
          source={require('../assets/images/zupa-logo.png')}
          style={styles.zupaLogo}
          resizeMode={'contain'}
        />

        {/* title name */}
        <ProductSansBold style={[styles.titleHeaderText]}>
          {name}
        </ProductSansBold>
      </>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  iconImage: {width: 21, height: 21},
  transpClickableBg: {
    width: 40,
    height: 40,
    backgroundColor: COLOURS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipPlace: {left: -10, top: 10},
  clipIconView: {
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: COLOURS.textInputColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -7,
    top: 10,
  },

  dateSelectorBoxView: {
    flexDirection: 'row',
    // marginRight: 0,
  },
  printerBoxView: {
    flexDirection: 'row',
    right: deviceWidth * 0.06,
    backgroundColor: COLOURS.white,
  },

  headerContainerView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.075 : deviceHeight * 0.075,
    backgroundColor: COLOURS.white,
  },
  zupaLogo: {
    width: wp(30),
    height: wp(30),
    marginLeft: 20,
  },
  titleHeaderText: {
    fontSize: fp(20),
    flex: 0.9,
    left: 20,
    color: COLOURS.gray2,
  },
  periodText: {
    fontSize: 13,
    color: COLOURS.textInputColor,
    marginRight: wp(8),
    alignSelf: 'center',
  },
});
