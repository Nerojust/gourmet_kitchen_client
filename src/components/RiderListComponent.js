import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
  TextInput,
  SafeAreaView,
  Keyboard,
  Platform,
} from 'react-native';

import ProductSans from './Text/ProductSans';
import TextInputComponent from './TextInputComponent';
import ProductSansBold from './Text/ProductSansBold';
import EmptyComponent from './EmptyComponent';
import AvertaBold from './Text/AvertaBold';
import Averta from './Text/Averta';
import LoaderShimmerComponent from './LoaderShimmerComponent';
import AddComponent from './AddComponent';
import {capitalizeWord, formatNumberComma, NAIRA_} from '../utils/utils';
import {deviceWidth, deviceHeight} from '../utils/responsive-screen';
import {COLOURS} from '../utils/Colours';
import {ACTIVE_OPACITY} from '../utils/Constants';
import {IMAGES} from '../utils/Images';
import RefreshComponent from './RefreshComponent';

const RiderListComponent = ({
  dataSource,
  handleSingleItemPress,
  addProductPress,
  handleInputSearchText,
  inputValue,
  handleSearchInputSubmit,
  closeAction,
  isRidersLoading,
  handleRefresh,
  //handleAddProduct,
}) => {
  const RenderProductItem = ({item, categoryName}) => {
    //console.log("products", categoryName, item);
    return (
      <>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => handleSingleItemPress(item)}>
          <View style={{justifyContent: 'center'}}>
            <AvertaBold
              style={[styles.itemText, {fontWeight: 'bold', flex: 1}]}>
              {item?.name ? capitalizeWord(item?.name.trim()) : null}
            </AvertaBold>
            <View style={{flexDirection: 'row'}}>
              <Averta style={[styles.itemText, {flex: 1}]}>
                {item && item?.phonenumber ? item?.phonenumber : null}
              </Averta>
            </View>
          </View>
        </TouchableOpacity>

        {/* line divider */}
        <View
          style={{
            width: deviceWidth,
            backgroundColor: COLOURS.lightGray,
            height: 0.5,
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView
      style={{
        //alignItems: "center",
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
      }}>
      <LoaderShimmerComponent isLoading={isRidersLoading} />
      {isRidersLoading ? null : (
        <>
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            style={{alignSelf: 'flex-start', left: 28, marginBottom: 15}}
            onPress={closeAction}>
            <ProductSans
              style={{
                color: COLOURS.zupaBlue,
                fontSize: 12,
              }}>
              Close
            </ProductSans>
          </TouchableOpacity>

          <TextInputComponent
            placeholder={'Search'}
            handleTextChange={handleInputSearchText}
            defaultValue={inputValue}
            returnKeyType={'go'}
            keyboardType={'default'}
            secureTextEntry={false}
            props={{
              width: deviceWidth * 0.88,
              borderWidth: 0,
            }}
            heightfigure={50}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleSearchInputSubmit();
            }}
          />
          <View style={{paddingBottom: 20}} />
          {dataSource && dataSource.length > 0 ? (
            <>
              <FlatList
                data={dataSource}
                keyExtractor={item => item.id}
                renderItem={RenderProductItem}
                initialNumToRender={10}
                keyboardShouldPersistTaps={'handled'}
              />
              <RefreshComponent goto={handleRefresh} style={{bottom: 70}} />
              <View style={{paddingBottom: 10}} />
            </>
          ) : (
            <TouchableOpacity
              style={styles.noResultView}
              activeOpacity={1}
              onPress={() => Keyboard.dismiss()}>
              <EmptyComponent
                title={'No rider/s found'}
                image={IMAGES.noProducts}
                style={{top: -160}}>
                <TouchableOpacity
                  activeOpacity={ACTIVE_OPACITY}
                  onPress={handleRefresh}>
                  <ProductSansBold
                    style={[
                      styles.noResultText,
                      {color: COLOURS.blue, marginVertical: 20},
                    ]}>
                    Click to refresh
                  </ProductSansBold>
                </TouchableOpacity>

                {/* <Averta style={{color: COLOURS.textInputColor, fontSize: 12}}>
                  Click the icon to add products
                </Averta> */}
              </EmptyComponent>
              {/* <AddComponent goto={handleAddProduct} /> */}
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default RiderListComponent;

const styles = StyleSheet.create({
  itemView: {
    width: deviceWidth,
    //justifyContent: "center",
    paddingVertical: 13,
    backgroundColor: COLOURS.white,
    marginBottom: 5,
    paddingHorizontal: 30,
    //flex:1
  },
  itemPriceText: {
    //fontWeight: "bold",
    width: deviceWidth,
    fontSize: 14,
    marginTop: 5,
    color: COLOURS.textInputColor,
  },
  itemText: {
    color: COLOURS.text_color,
    //width: "100%",
    fontSize: 14,
    //fontWeight: "bold",
  },
  noResultView: {
    alignSelf: 'center',
    height: deviceHeight - 260,
    width: deviceWidth,
    //justifyContent: "center",
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOURS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
