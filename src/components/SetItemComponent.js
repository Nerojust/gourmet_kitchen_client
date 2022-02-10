//import liraries
import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {NAIRA} from '../utils/Constants';
import {IMAGES} from '../utils/Images';
import {deviceWidth, fp} from '../utils/responsive-screen';
import {formatNumberComma, getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const SetItemComponent = ({item, handleClick}) => {
  //console.log('item', item);

  return (
    <TouchableOpacity style={styles.item} onPress={() => handleClick(item)}>
      <View>
        <ProductSans style={styles.nameText}>{item?.name.trim()}</ProductSans>

        <View
          style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
          <ProductSansBold style={[styles.itemsText]}>
            {item?.products.length +
              (item?.products.length > 1 ? ' items' : ' item')}
          </ProductSansBold>

          <View style={{paddingTop: 5}}>
            <ProductSans style={styles.delayHeaderText}>Created</ProductSans>
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
    flex: 1,
  },
  bakedText: {
    fontSize: fp(16),
    color: COLOURS.purple,
    paddingTop: 5,
  },
  nameText: {
    fontSize: fp(17),
    color: COLOURS.textInputColor,
    fontWeight:'bold'
  },
  smallTitle: {
    fontSize: fp(13),
    color: COLOURS.textInputColor,
  },
  delayHeaderText: {
    fontSize: fp(14),
    color: COLOURS.labelTextColor,
  },
  delayText: {
    fontSize: fp(16),
    color: COLOURS.yellow1,
    fontWeight: 'bold',
  },
});

//make this component available to the app
export default SetItemComponent;
