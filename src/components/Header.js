import React, {Component, useState} from 'react';
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
import {hp, wp, fp,deviceHeight, deviceWidth} from '../utils/responsive-screen';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import ProductSansBold from './Text/ProductSansBold';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import SettingsSelector from './SettingsSelector';

export const BackViewMoreSettings = ({
  onClose,
  backText,
  shouldDisplayAdd = false,
  handleClick,
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
        style={{fontSize: fp(19), flex: 1.3, color: COLOURS.gray2}}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>

      <View
        style={{
          flexDirection: 'row',
          flex: 0.2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          
        {shouldDisplayAdd ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClick}>
            {renderSettingsMore(handleClick)}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
export const renderSettingsMore = handleMoreClick => {
  return (
    <SettingsSelector
      onPressIcon={handleMoreClick}
    />
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
  
});
