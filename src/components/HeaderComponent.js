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
import DeleteSelector from './DeleteSelector';
import OrdersSelector from './OrdersSelector';
import SettingsSelector from './SettingsSelector';
import ProductSansBold from './Text/ProductSansBold';

export const HeaderComponent = ({
  name,
  isDashboard,
  performDelete,
  performSearch,
  shouldDisplayIcon,
  handleMoreClick,
  performRefresh,
  displayCalendar,
  toggleDateModal,
  handleSettingsClick,
  shouldDisplaySettingIcon,
}) => {
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
        {/* {shouldDisplayIcon ? (
          <>
            <TouchableOpacity onPress={performRefresh}>
              <Image
                source={require('../assets/images/refresh.png')}
                style={styles.refreshImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </>
        ) : null} */}
        {shouldDisplayIcon ? (
          <>
            <TouchableOpacity onPress={performSearch}>
              <Image
                source={require('../assets/images/search.png')}
                style={styles.searchImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={performDelete}>
              <Image
                source={require('../assets/images/delete.png')}
                style={styles.deleteImage}
                resizeMode={'contain'}
              />
            </TouchableOpacity> */}
          </>
        ) : null}
        {displayCalendar ? (
          <TouchableOpacity onPress={toggleDateModal}>
            <Image
              source={require('../assets/images/calendar.png')}
              style={[styles.deleteImage, {tintColor: COLOURS.gray4}]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : null}

        {shouldDisplaySettingIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSettingsClick}
            style={{left: wp(20)}}>
            {renderDelete(handleSettingsClick)}
          </TouchableOpacity>
        ) : null}
      </>
    </View>
  );
};
export const renderDelete = handleSettingsClick => {
  return <OrdersSelector onPressIcon={handleSettingsClick} />;
};
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
  refreshImage: {
    width: wp(18),
    height: wp(18),
    // marginRight: 0,
  },
  deleteImage: {
    width: wp(18),
    height: wp(18),
    marginLeft: 24,
    tintColor: COLOURS.gray3,
  },
  searchImage: {
    width: wp(18),
    height: wp(18),
    left: 7,
    tintColor: COLOURS.gray3,
  },
  titleHeaderText: {
    fontSize: fp(16),
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
