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
import {
  hp,
  wp,
  fp,
  deviceHeight,
  deviceWidth,
} from '../utils/responsive-screen';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import ProductSansBold from './Text/ProductSansBold';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import SettingsSelector from './SettingsSelector';
import DeleteSelector from './DeleteSelector';

export const BackViewMoreSettings = ({
  onClose,
  backText,
  shouldDisplaySettingIcon = false,
  shouldDisplayDelete = false,
  displayDelete = false,
  handleClick,
  performSearch,
  performDelete,
  shouldDisplayIcon,
  shouldDisplayBackArrow,
  performRefresh,
}) => {
  return (
    <View style={[styles.exitView]}>
      {shouldDisplayBackArrow ? (
        <TouchableOpacity
          onPress={() => onClose()}
          style={{flex: 0.2, paddingLeft: 15}}>
          <Image
            source={require('../assets/images/arrowleft1.png')}
            resizeMode={'contain'}
            style={{width: 25, height: 18}}
          />
        </TouchableOpacity>
      ) : null}
      <ProductSansBold
        style={{fontSize: fp(19), flex: 1.3, color: COLOURS.gray2}}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>
      {shouldDisplayIcon ? (
        <>
          <TouchableOpacity onPress={performRefresh}>
            <Image
              source={require('../assets/images/refresh.png')}
              style={styles.refreshImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </>
      ) : null}
      {shouldDisplayIcon ? (
        <>
          <TouchableOpacity onPress={performSearch}>
            <Image
              source={require('../assets/images/search.png')}
              style={styles.searchImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          flex: 0.2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {shouldDisplaySettingIcon ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleClick}>
            {renderSettingsMore(handleClick)}
          </TouchableOpacity>
        ) : null}
        {shouldDisplayDelete ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleClick}>
            {renderDelete(handleClick)}
          </TouchableOpacity>
        ) : null}
        {displayDelete ? (
          <TouchableOpacity onPress={performDelete}>
            <Image
              source={require('../assets/images/delete.png')}
              style={styles.deleteImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
export const BackViewWithLogout = ({
  onClose,
  backText,
  shouldDisplayLogoutIcon,
  handleLogout,
  style,
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

      <View
        style={{
          flexDirection: 'row',
          flex: 0.2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {shouldDisplayLogoutIcon ? (
          <TouchableOpacity
            activeOpacity={0.4}
            style={style}
            onPress={handleLogout}>
            <Image
              source={require('../assets/images/logout.png')}
              resizeMode={'contain'}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
export const renderSettingsMore = handleMoreClick => {
  return <SettingsSelector onPressIcon={handleMoreClick} />;
};
export const renderDelete = handleClick => {
  return <DeleteSelector onPressIcon={handleClick} />;
};

const styles = StyleSheet.create({
  exitText: {
    fontSize: 18,
    color: COLOURS.textInputColor,
    flex: 0.9,
  },
  searchImage: {
    width: wp(19),
    height: wp(19),
    marginRight: 20,
  },
  deleteImage: {
    width: wp(19),
    height: wp(19),
    marginLeft: 0,
  },
  refreshImage: {
    width: wp(19),
    height: wp(19),
    left: -25,
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
