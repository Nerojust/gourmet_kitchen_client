//import liraries
import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {NAIRA} from '../utils/Constants';
import {IMAGES} from '../utils/Images';
import {deviceWidth, fp} from '../utils/responsive-screen';
import {formatNumberCommaNaira, getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const SetListItemComponent = ({item, index}) => {
  //console.log('item', item);
  var name = item?.productname || 'NONE';
  var quantity = item?.quantity;
  var price = item?.price;

  return (
    <View style={styles.customerNameView}>
      <View
        style={{
          //flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}>
        <ProductSans style={styles.labelText}>
          {'SET ITEM NAME ' + (index + 1)}
        </ProductSans>

        <ProductSans style={styles.productName}>{name.trim()}</ProductSans>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <View>
            <ProductSans style={styles.labelText}>SIZE</ProductSans>
            <ProductSans style={styles.quantityName}>
              {item?.productsize || 'None'}
            </ProductSans>
          </View>
          <View>
            <ProductSans style={styles.labelText}>PRICE</ProductSans>
            <ProductSans style={styles.priceName}>
              {formatNumberCommaNaira(price)}
            </ProductSans>
          </View>
          <View>
            <ProductSans style={styles.labelText}>QUANTITY</ProductSans>
            <ProductSans style={styles.quantityName}>{quantity}</ProductSans>
          </View>
        </View>
      </View>
    </View>
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
    fontSize: fp(15),
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
    backgroundColor: COLOURS.white,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 3,
    paddingBottom: 5,
    // left: 12,
  },
});

export default SetListItemComponent;
