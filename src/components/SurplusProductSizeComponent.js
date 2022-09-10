import React, {useMemo, useState} from 'react';
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
  Image,
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

const SurplusProductSizeComponent = ({
  dataSource,
  handleSingleItemPress,
  handleInsertValueTextChange,
  insertedSizeValue,
  handleCreateSizeNetworkRequest,
  closeAction,
  itemName,
}) => {
  const [sizes, setSizes] = useState(dataSource);

  const handleSizeChange = (index, text) => {
    const _sizes = [...dataSource];

    console.log('Sizes at '+dataSource[index].categorysize+ " index:"+ index, text);
    // _sizes[index].surplus.count = text;
    // console.log('text', text);
    // setSizes(_sizes);
    // console.log('sizes are ', _sizes);
  };

  return (
    <SafeAreaView
      style={{
        //alignItems: "center",
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // flex: 1,
      }}>
      <>
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          style={{alignSelf: 'flex-start', left: 28, marginBottom: 15}}
          onPress={closeAction}>
          <ProductSans
            style={{
              color: COLOURS.zupaBlue,
              fontSize: fp(14),
            }}>
            Close
          </ProductSans>
        </TouchableOpacity>

        <ProductSans
          style={[
            styles.productName,
            {
              color: COLOURS.textInputColor,
              textAlign: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: fp(18),
            },
          ]}>
          {itemName}
        </ProductSans>

        <ScrollView>
          {dataSource.map((oneItem, i) => {
            //console.log('item detail', ` ${oneItem.categorysize}`);
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingHorizontal: 27,
                  paddingVertical: 4,
                  backgroundColor: COLOURS.lightGray4,
                  borderRadius: 10,
                  marginVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}
                key={Math.random()}
                // onPress={() => handleSingleItemPress(key, value)}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      //paddingBottom: value?.products ? 20 : 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}>
                    <ProductSans
                      style={[
                        styles.productName,
                        {
                          flex: 0.65,
                        },
                      ]}>
                      {oneItem.categorysize}
                    </ProductSans>
                    <TextInputComponent
                      placeholder={'Insert value'}
                      handleTextChange={text => handleSizeChange(i, text)}
                      defaultValue={dataSource[i]?.surplus?.count.toString()}
                      returnKeyType={'go'}
                      keyboardType={'phone-pad'}
                      secureTextEntry={false}
                      capitalize={'sentences'}
                      heightfigure={50}
                      props={{borderColor: COLOURS.blue, flex: 0.35}}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={handleCreateSizeNetworkRequest}
            style={{
              marginTop: 15,
              justifyContent: 'center',
              backgroundColor: COLOURS.blue,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 25,
              alignItems: 'center',
            }}>
            <Text
              style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default SurplusProductSizeComponent;

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
