import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  Animated,
  CheckBox,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {hp, wp, deviceHeight, deviceWidth} from '../utils/responsive-screen';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import ProductSansBold from './Text/ProductSansBold';
import {COLOURS} from '../utils/Colours';

export const BackViewMoreSettings = ({
  onClose,
  backText,
  shouldDisplayRefresh = false,
  handleRefresh,
}) => {
  return (
    <View style={[styles.exitView]}>
      <TouchableOpacity
        onPress={() => onClose()}
        style={{flex: 0.2, paddingLeft: 15}}>
        <Image
          source={require('../assets/images/arrowleft1.png')}
          resizeMode={'contain'}
          style={{width: 25, height: 18}}
        />
      </TouchableOpacity>

      <ProductSansBold
        style={{fontSize: 19, flex: 1.3, color: COLOURS.gray2}}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>
      {shouldDisplayRefresh ? (
        <TouchableOpacity
          onPress={handleRefresh}
          style={{flex: 0.2, right: 10}}>
          <Image
            source={require('../assets/images/refresh.png')}
            resizeMode={'contain'}
            style={{width: 30, height: 22}}
          />
        </TouchableOpacity>
      ) : (
        <View style={{flex: 0.2, right: 10}}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  exitText: {
    fontSize: 18,
    color: COLOURS.textInputColor,
    flex: 0.9,
  },
  exitView: {
    flexDirection: 'row',
    // paddingLeft: wp(40),
    paddingVertical: Platform.OS == 'android' ? deviceHeight * 0.02 : 13,
    alignItems: 'center',
    backgroundColor: COLOURS.white,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceWidth,
    backgroundColor: COLOURS.zupa_gray_bg,
    // borderBottomWidth: hp(0.5),
    borderColor: COLOURS.lightGray,
    borderTopWidth: 0.4,
    //opacity: this.props.opacity,
  },
  dateSelectorBoxView: {
    flexDirection: 'row',
    right: deviceWidth * 0.08,
  },

  headerContainerView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.08 : deviceHeight * 0.07,
    backgroundColor: COLOURS.white,
  },
  zupaLogo: {
    width: wp(30),
    height: wp(30),
    marginLeft: 20,
  },
  titleHeaderText: {
    fontSize: 19,
    flex: 0.9,
    left: 20,
    color: COLOURS.gray2,
  },
  imageIcon: {width: 21, height: 21},
  periodText: {
    fontSize: 13,
    color: COLOURS.textInputColor,
    marginRight: wp(8),
    alignSelf: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    width: deviceWidth,
    height: hp(73) + getStatusBarHeight(),
    borderBottomWidth: 0.4,
    backgroundColor: 'rgba(44,63,94,0.27)',
    borderColor: '#EAECF0',
    // marginTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    zIndex: 10000,
  },
});
