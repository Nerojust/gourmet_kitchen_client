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
const OrderProductComponent = ({item, colourType}) => {
  var orderItems = JSON.parse(item?.orderitems);
  var delay = getReadableDateAndTime(item?.createdat)
    .toLowerCase()
    .endsWith('hours')
    ? 'red'
    : getReadableDateAndTime(item?.createdat).toLowerCase().endsWith('minutes')
    ? 'orange'
    : 'green';
  return (
    <TouchableOpacity style={styles.item}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ProductSans style={styles.nameText}>
          {item?.fullname.trim()}
        </ProductSans>
        <ProductSansBold style={styles.itemsText}>
          {orderItems.length + (orderItems.length > 1 ? ' items' : ' item')}
        </ProductSansBold>
      </View>

      <Text style={styles.bakedText}>1 of {orderItems.length} baked</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <ColourComponent colourType={delay} />
        <View>
          <ProductSans style={styles.delayHeaderText}>Delay</ProductSans>
          <ProductSans style={styles.delayText}>
            {getReadableDateAndTime(item?.createdat)}
          </ProductSans>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOURS.lightGray4,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  itemsText: {
    color: COLOURS.textInputColor,
    fontSize: fp(19),
  },
  bakedText: {
    fontSize: fp(15),
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
    fontSize: fp(15),
    color: COLOURS.gray,
  },
  delayText: {
    fontSize: fp(17),
    color: COLOURS.zupaBlue,
  },
});

//make this component available to the app
export default OrderProductComponent;
