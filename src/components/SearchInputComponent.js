import React, { Component, PureComponent, useState } from 'react';
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
  Platform
} from 'react-native';
import { COLOURS } from '../utils/Colours';
import { deviceWidth, hp } from '../utils/responsive-screen';
import TextInputComponent from './TextInputComponent';

const SearchComponent = ({
  shouldDisplaySearchView,
  searchPlaceholder,
  cancelPress,
  handleSearch,
  inputValue,
  searchChange,
  shouldDisplayTopBorder = false
}) => {
  const [isTextFocused, setisTextFocused] = useState(false);

  return (
    <SafeAreaView>
      {shouldDisplaySearchView ? (
        <>
          <View
            style={[
              styles.searchView,
              shouldDisplayTopBorder
                ? { borderTopColor: COLOURS.lightGray, borderTopWidth: hp(0.5) }
                : null
            ]}
          >
            <Image
              source={require('../assets/images/search.png')}
              resizeMode={'contain'}
              style={{
                width: 15,
                height: 15,
                flex: 0.22,
                marginLeft: 18
              }}
            />
            <TextInputComponent
              placeholder={searchPlaceholder}
              handleTextChange={searchChange}
              defaultValue={inputValue}
              returnKeyType={'search'}
              keyboardType={'default'}
              secureTextEntry={false}
              heightfigure={50}
              props={{
                borderRadius: 0,
                borderWidth: 0,
                backgroundColor: COLOURS.zupa_gray_bg,
                fontSize: 13,
                flex: 2.6,
                left: -5
              }}
              handleTextInputFocus={() => setisTextFocused(true)}
              handleBlur={() => setisTextFocused(false)}
              onSubmitEditing={handleSearch}
            />
            {inputValue.length > 0 ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={cancelPress}
                style={{ flex: 0.4 }}
              >
                <Image
                  source={require('../assets/images/cancel.png')}
                  resizeMode={'contain'}
                  style={{ width: 14, height: 14 }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceWidth,
    backgroundColor: COLOURS.zupa_gray_bg,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray
    // borderTopWidth: 0.4,
  }
});
