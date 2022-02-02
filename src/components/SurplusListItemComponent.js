//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {fp} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const SurplusListItemComponent = ({item, handleClick}) => {
  //console.log('item', item);

  return (
    <TouchableOpacity
      style={styles.customerNameView}
      activeOpacity={0.6}
      onPress={() => handleClick(item)}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //paddingVertical: 5,
        }}>
        <ProductSans style={styles.labelText}>PRODUCT</ProductSans>
        <TouchableOpacity activeOpacity={0.6}  onPress={() => handleClick(item)}>
          <Image
            source={IMAGES.editImage}
            style={{
              width: 25,
              height: 25,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View>
        <ProductSans style={styles.priceName}>
          {item?.productname || 'None'}
        </ProductSans>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
          marginTop: 3,
        }}>
        <View>
          <ProductSans style={styles.labelText}>CATEGORY</ProductSans>
          <ProductSans style={styles.priceName}>
            {item?.productcategory || 'None'}
          </ProductSans>
        </View>

        <View style={{marginRight: 10}}>
          <ProductSans style={styles.labelText}>SIZE</ProductSans>
          <ProductSans style={styles.quantityName}>
            {item?.productsize || 'None'}
          </ProductSans>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <ProductSans style={styles.labelText}>SURPLUS COUNT</ProductSans>
        <ProductSans style={styles.priceName}>{item?.count || '0'}</ProductSans>
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
    paddingTop: 3,
    paddingBottom: 5,
    // left: 12,
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
    backgroundColor: COLOURS.white,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  labelText: {
    fontSize: fp(16),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 10,
    // left: 12,
  },
});

//make this component available to the app
export default SurplusListItemComponent;
