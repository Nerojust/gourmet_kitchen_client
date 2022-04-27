// import liraries
import moment from 'moment';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewBase,
  Image,
} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {deviceWidth, fp} from '../utils/responsive-screen';
import {
  getColourCode,
  getProcessingTimeString,
  getReadableDateAndTime,
} from '../utils/utils';
import ColourComponent from './ColorComponent';
import AvertaBold from './Text/AvertaBold';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const SalesAverageComponent = ({item, handleClick}) => {
  //console.log('item', item);

  return (
    <TouchableOpacity
      style={styles.customerNameView}
      activeOpacity={0.6}
      onPress={() => handleClick(item)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.labelText, {left: 0}]}>
            TOTAL AVERAGE PROCESSING TIME
          </ProductSansBold>
          <TouchableOpacity onPress={null}>
            <AvertaBold style={styles.custName}>
              {item ? getProcessingTimeString(item?.avg_time) : 'None'}
            </AvertaBold>
          </TouchableOpacity>
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
    paddingHorizontal: 0,
    borderRadius: 10,
    //flex: 1,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  customerNameView: {
    //width: deviceWidth - 50,
    marginTop: 5,
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
  labelText: {
    fontSize: fp(16),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 10,
    // left: 12,
  },
});

// make this component available to the app
export default SalesAverageComponent;
