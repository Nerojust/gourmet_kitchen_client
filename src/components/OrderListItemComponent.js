//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewBase} from 'react-native';
import {COLOURS} from '../utils/Colours';
import { NAIRA } from '../utils/Constants';
import {deviceWidth, fp} from '../utils/responsive-screen';
import {formatNumberComma, getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const OrderListItemComponent = ({item}) => {
  console.log('item', item);
  var name = item?.name||"NONE";
  var quantity = item?.quantity;
  var price = item?.price;

  return (
    <View style={styles.customerNameView}>
      <ProductSans style={styles.labelText}>Product Name</ProductSans>
      <ProductSans style={styles.productName}>{name.trim()}</ProductSans>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:10}}>
        <View>
          <ProductSans style={styles.labelText}>Price</ProductSans>
          <ProductSans style={styles.priceName}>{NAIRA}{formatNumberComma(price)}</ProductSans>
        </View>
        <View>
          <ProductSans style={styles.labelText}>Quantity</ProductSans>
          <ProductSans style={styles.quantityName}>
            {quantity}
          </ProductSans>
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
    alignSelf:'center'
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
    paddingTop: 5,
    paddingBottom: 5,
    // left: 12,
  },
});

//make this component available to the app
export default OrderListItemComponent;
