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
const OrderListItemComponent = ({item}) => {
  //console.log('item', item);
  var name = item?.name || 'NONE';
  var quantity = item?.quantity;
  var price = item?.price;

  return (
    <View style={styles.customerNameView}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}>
        <ProductSans style={styles.labelText}>PRODUCT NAME</ProductSans>
        {item?.isfulfilled && item?.wasfulfilledfromsurplus ? (
          <Image
            source={IMAGES.successImage}
            style={{
              width: 20,
              height: 20,
            }}
            resizeMode="contain"
          />
        ) : (
          <Image />
        )}
        {item?.isfulfilled ? (
          <Image
            source={IMAGES.urlGood}
            style={{
              width: 20,
              height: 20,
            }}
            resizeMode="contain"
          />
        ) : (
          <ProductSans
            style={[
              styles.productName,
              {color: COLOURS.red, fontSize: fp(13)},
            ]}>
            Pending
          </ProductSans>
        )}
      </View>
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
            {NAIRA}
            {formatNumberComma(price)}
          </ProductSans>
        </View>
        <View>
          <ProductSans style={styles.labelText}>QUANTITY</ProductSans>
          <ProductSans style={styles.quantityName}>{quantity}</ProductSans>
        </View>
      </View>

      {item?.isfulfilled ? (
        <>
          <View style={{marginTop: 0}}>
            <ProductSans style={styles.labelText}>
              FULFILLMENT HISTORY
            </ProductSans>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignItems: 'center',
                }}>
                <ProductSans style={styles.labelText}>SURPLUS:</ProductSans>
                <ProductSans
                  style={[
                    styles.priceName,
                    {fontWeight: 'normal', marginLeft: 5},
                  ]}>
                  {item?.surplusquantity}
                </ProductSans>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 0.8}}>
                <ProductSans style={styles.labelText}>NORMAL:</ProductSans>
                <ProductSans
                  style={[
                    styles.priceName,
                    {fontWeight: 'normal', marginLeft: 5},
                  ]}>
                  {item?.quantity - item?.surplusquantity}
                </ProductSans>
              </View>
            </View>
          </View>
          {item?.wasfulfilledfromsurplus && item?.surplusquantity > 0 ? (
            <View style={{marginTop: 10}}>
              <ProductSans style={styles.labelText}>
                SURPLUS UPDATED AT
              </ProductSans>
              <ProductSans style={[styles.priceName, {fontWeight: 'normal'}]}>
                {item?.surplusupdatedat
                  ? moment(item?.surplusupdatedat).format('LT')
                  : 'None'}
              </ProductSans>
            </View>
          ) : null}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{marginTop: 10}}>
              <ProductSans style={styles.labelText}>
                WHOLE ITEM UPDATED AT
              </ProductSans>
              <ProductSans style={[styles.priceName, {fontWeight: 'normal'}]}>
                {item.updatedat ? moment(item.updatedat).format('LT') : 'None'}
              </ProductSans>
            </View>
          </View>
        </>
      ) : null}

      <View style={{marginTop: 10}}>
        <ProductSans style={styles.labelText}>QUANTITY BAKED</ProductSans>
        <ProductSans style={styles.priceName}>
          {item?.fulfilledquantity} of {item?.quantity}
        </ProductSans>
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

//make this component available to the app
export default OrderListItemComponent;
