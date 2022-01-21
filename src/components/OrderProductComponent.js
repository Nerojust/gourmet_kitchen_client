//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewBase} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {deviceWidth, fp} from '../utils/responsive-screen';
import {getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const OrderProductComponent = ({item, colourType, handleClick}) => {
  var orderItems = JSON.parse(item?.orderitems);
  var delay = getReadableDateAndTime(item?.createdat)
    .toLowerCase()
    .endsWith('hours')
    ? 'red'
    : getReadableDateAndTime(item?.createdat).toLowerCase().endsWith('minutes')
    ? 'orange'
    : 'green';
  return (
    <TouchableOpacity style={styles.item} onPress={() => handleClick(item)}>
      <ProductSans style={styles.nameText}>
        {item?.customername.trim()}
      </ProductSans>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{justifyContent: 'space-between'}}>
          <Text style={styles.bakedText}>1 of {orderItems.length} baked</Text>

          <ColourComponent colourType={delay} />
        </View>

        <View>
          <ProductSansBold style={styles.itemsText}>
            {orderItems.length + (orderItems.length > 1 ? ' items' : ' item')}
          </ProductSansBold>
          <View style={{paddingTop: 5}}>
            <ProductSans style={styles.delayHeaderText}>Delay</ProductSans>
            <ProductSans style={styles.delayText}>
              {getReadableDateAndTime(item?.createdat)}
            </ProductSans>
          </View>
        </View>
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
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  itemsText: {
    color: COLOURS.textInputColor,
    fontSize: fp(16),
    //paddingRight:30
  },
  bakedText: {
    fontSize: fp(16),
    color: COLOURS.red1,
    paddingTop: 5,
  },
  nameText: {
    fontSize: fp(22),
    color: COLOURS.textInputColor,
  },
  smallTitle: {
    fontSize: fp(13),
    color: COLOURS.textInputColor,
  },
  delayHeaderText: {
    fontSize: fp(14),
    color: COLOURS.gray,
  },
  delayText: {
    fontSize: fp(16),
    color: COLOURS.zupaBlue,
  },
});

//make this component available to the app
export default OrderProductComponent;
