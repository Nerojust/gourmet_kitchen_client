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
import {capitalizeWord, formatNumberCommaNaira, NAIRA_} from '../utils/utils';
import {deviceWidth, deviceHeight, fp} from '../utils/responsive-screen';
import {COLOURS} from '../utils/Colours';
import {ACTIVE_OPACITY} from '../utils/Constants';
import {IMAGES} from '../utils/Images';
import RefreshComponent from './RefreshComponent';

const BreadSizeComponent1 = ({
  dataSource,
  handleSingleItemPress,
  closeAction,
  itemName,
}) => {
  // console.log('data source', dataSource);
  return (
    <SafeAreaView
      style={{
        //alignItems: "center",
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
      }}>
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

        <ProductSans
          style={[
            styles.productName,
            {
              color: COLOURS.labelTextColor,
              textAlign: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
            },
          ]}>
          {'Select a size to fulfill for \n' + dataSource?.name}
        </ProductSans>

        <ScrollView>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 27,
              paddingVertical: 20,
              backgroundColor: COLOURS.lightGray4,
              borderRadius: 10,
              marginVertical: 5,
            }}
            key={Math.random()}
            onPress={() => handleSingleItemPress(dataSource)}>
            <View
              style={{
                // flexDirection: 'column',
                width: '100%',
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingBottom: dataSource?.set ? 20 : 0,
                }}>
                <ProductSans
                  style={[
                    styles.productName,
                    {
                      flex: 0.9,
                    },
                  ]}>
                  {dataSource?.name}
                </ProductSans>

                <ProductSans style={[styles.productName]}>
                  {dataSource?.sum || '0'}
                </ProductSans>
              </View>

              {dataSource?.set
                ? dataSource?.set?.products.map((item, i) => {
                    // console.log("iii",item)
                    return (
                      <ProductSans
                        style={[
                          styles.productName,
                          {paddingVertical: 5, fontWeight: '500'},
                        ]}
                        key={Math.random()}>
                        {i +
                          1 +
                          '.) ' +
                          item?.productname +
                          ' (' +
                          item?.productsize +
                          ')'}
                      </ProductSans>
                    );
                  })
                : null}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default BreadSizeComponent1;

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
  productName: {
    fontSize: fp(16),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
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
