import React, {} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment';
import {
  wp,
  fp,
  deviceHeight,
} from '../utils/responsive-screen';
import ProductSansBold from './Text/ProductSansBold';
import {COLOURS} from '../utils/Colours';
import SettingsSelector from './SettingsSelector';
import DeleteSelector from './DeleteSelector';
import CopySelector from './CopySelector';

export const BackViewHeader = ({
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
  displayCalendar,
  dateText,
  toggleDateModal,
  breadStyle,
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
        style={{
          fontSize: fp(19),
          flex: 2,
          color: COLOURS.gray2,
          right: displayCalendar ? -wp(10) : 0,
        }}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>

      {displayCalendar ? (
        <TouchableOpacity onPress={toggleDateModal} style={{flex: 0.25}}>
          <Image
            source={require('../assets/images/calendar.png')}
            style={[styles.deleteImage, {tintColor: COLOURS.gray4}]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      ) : null}

      {shouldDisplayIcon ? (
        <>
          <TouchableOpacity onPress={performSearch} style={{right: -wp(7)}}>
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
          ...breadStyle,
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
      </View>
    </View>
  );
};
export const BackViewSurplus = ({
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
  displayCalendar,
  dateText,
  toggleDateModal,
  breadStyle,
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
        style={{
          fontSize: fp(19),
          flex: 2,
          color: COLOURS.gray2,
          right: displayCalendar ? -wp(10) : 0,
        }}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>

      {displayCalendar ? (
        <TouchableOpacity onPress={toggleDateModal} style={{flex: 0.3}}>
          <Image
            source={require('../assets/images/calendar.png')}
            style={[styles.deleteImage, {tintColor: COLOURS.gray4}]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
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
          //flex: 0.2,
          justifyContent: 'space-between',
          alignItems: 'center',
          ...breadStyle,
        }}>
        {shouldDisplaySettingIcon ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleClick}>
            {renderCopy(handleClick)}
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
  displayCalendar,
  dateText,
  toggleDateModal,
  breadStyle,
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
        style={{
          fontSize: fp(19),
          flex: 1.3,
          color: COLOURS.gray2,
          right: displayCalendar ? -wp(10) : 0,
        }}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>

      {displayCalendar ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1.3,
            //justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <ProductSansBold
            style={{
              fontSize: fp(16),
              flex: 2,
              color: COLOURS.gray2,
              //right: -wp(50),
            }}
            numberOfLines={1}>
            {dateText ? moment(dateText).format('LL') : "Today's Date"}
          </ProductSansBold>

          <TouchableOpacity onPress={toggleDateModal} style={{flex: 0.7}}>
            <Image
              source={require('../assets/images/calendar.png')}
              style={[styles.deleteImage, {tintColor: COLOURS.gray4}]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
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
          ...breadStyle,
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
  displayCalendar,
  toggleDateModal,
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
        style={{fontSize: fp(19), flex: 1.3, color: COLOURS.gray2}}
        numberOfLines={1}>
        {backText}
      </ProductSansBold>
      {displayCalendar ? (
        <TouchableOpacity onPress={toggleDateModal}>
          <Image
            source={require('../assets/images/calendar.png')}
            style={[styles.calendarImage, {tintColor: COLOURS.gray4}]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      ) : null}
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
export const renderCopy = handleMoreClick => {
  return <CopySelector onPressIcon={handleMoreClick} />;
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
    flex: 1,
  },
  calendarImage: {
    width: wp(19),
    height: wp(19),
    marginRight: 30,
    flex: 1,
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
