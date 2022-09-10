//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {deviceHeight, deviceWidth, fp} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const SurplusProductItemComponent = ({
  indexKey,
  keyItem,
  keyValue,
  onClick,
}) => {
  //console.log('item', keyValue);

  const renderDetailsList = () => {
    return (
      <View style={{flex: 0.55}}>
        {Object.entries(keyValue).map(([key, value]) => {
          //console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"

          return (
            <>
              {value?.surplus ? (
                <View key={indexKey + Math.random()}>
                  <View
                    style={{
                      height: 0.3,
                      width: 100,
                      backgroundColor: COLOURS.gray,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 5,
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                    //onPress={toggleModal}
                  >
                    <ProductSans
                      style={[
                        styles.productName,
                        {
                          color: COLOURS.labelTextColor,
                          fontWeight: '400',
                          flex: 0.65,
                          paddingRight: 10,
                        },
                      ]}>
                      {value?.surplus?.productsize}
                      {/* {value?.surplus?.productsize.includes('Mini >') ||
                      value?.surplus?.productsize.includes('Mini <')
                        ? 'Mini'
                        : value?.surplus?.productsize} */}
                    </ProductSans>
                    {value.surplus ? (
                      <ProductSans style={[styles.productName, {flex: 0.2}]}>
                        {value?.surplus?.count || '0'}
                      </ProductSans>
                    ) : null}
                  </View>
                  <View
                    style={{
                      height: 0.3,
                      width: 100,
                      backgroundColor: COLOURS.gray,
                    }}
                  />
                </View>
              ) : null}
            </>
          );
        })}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.customerNameView}
      activeOpacity={0.6}
      onPress={() => onClick(keyValue)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 0.9, paddingRight: 5}}>
          <ProductSans style={styles.productName}>{keyItem || ''}</ProductSans>
        </View>
        {renderDetailsList()}
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOURS.white,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 0,
    borderRadius: 10,
    //flex: 1,
  },
  productName: {
    fontSize: fp(16),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  priceName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  quantityName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  customerNameView: {
    backgroundColor: COLOURS.lightGray4,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalStyle: {
    backgroundColor: COLOURS.white,
    marginVertical: deviceHeight * 0.15,
    marginHorizontal: deviceWidth * 0.12,
    borderRadius: 20,
    alignItems: 'center',
  },
  labelText: {
    fontSize: fp(16),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 10,
    // left: 12,
  },
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  content: {
    width: '95%',
    height: '50%',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
});

//make this component available to the app
export default SurplusProductItemComponent;
