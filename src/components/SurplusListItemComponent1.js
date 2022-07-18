//import liraries
import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {fp} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const SurplusListItemComponent1 = ({
  indexKey,
  keyItem,
  keyValue,
  onClick,
  handleEditClick,
  handleNormalClick,
}) => {
  //console.log('item', keyValue);
  let totalCount = 0;
  return (
    <View style={{flex: 0.55}}>
      {Object.entries(keyValue).map(([key, value]) => {
        // totalCount = totalCount + value?.count;
        // console.log('total', totalCount);
        return (
          <TouchableOpacity
            style={styles.customerNameView}
            activeOpacity={0.6}
            onPress={() => handleNormalClick(keyValue)}
            key={indexKey + Math.random()}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //paddingVertical: 5,
              }}>
              <ProductSans style={styles.labelText}>PRODUCT</ProductSans>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => handleEditClick(keyValue)}>
                <Image
                  source={IMAGES.editImage}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: COLOURS.gray4,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View>
              <ProductSans style={styles.priceName}>
                {keyItem.trim() || 'None'}
              </ProductSans>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
                marginTop: 3,
              }}>
              <View style={{marginRight: 10}}>
                <ProductSans style={styles.labelText}>SIZE</ProductSans>
                <ProductSans style={styles.quantityName}>
                  {value?.productsize.trim().includes('Mini < 4')
                    ? 'Mini '
                    : value?.productsize.trim().includes('Mini > 4')
                    ? 'Mini.'
                    : value?.productsize.trim() || 'None'}
                </ProductSans>
              </View>
              <View>
                <ProductSans style={styles.labelText}>
                  SURPLUS COUNT
                </ProductSans>
                <ProductSans style={[styles.priceName, {alignSelf: 'center'}]}>
                  {value?.count || '0'}
                </ProductSans>
              </View>
            </View>
            <View style={{marginTop: 0}}>
              <ProductSans style={[styles.labelText, {fontSize: fp(13)}]}>
                ENTERED OVEN AT{' '}
                {value?.createdat
                  ? moment(value?.updatedat).format('LLL')
                  : 'None'}
              </ProductSans>
              {/* <ProductSans style={[styles.priceName,{ fontWeight: 'normal',}]}>
            {item.createdat ? moment(item.createdat).format('LT') : 'None'}
          </ProductSans> */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOURS.white,
    padding: 10,
    // marginVertical: 5,
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
    fontSize: fp(14),
    color: COLOURS.textInputColor,
    fontWeight: '500',
    alignSelf: 'center',
  },
  customerNameView: {
    backgroundColor: COLOURS.lightGray4,
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 3,
    paddingBottom: 10,
    // left: 12,
  },
});

//make this component available to the app
export default SurplusListItemComponent1;
