// import liraries
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
import {getColourCode, getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const OrderProductComponent = ({item, handleClick}) => {
  //console.log("item",item.products[0].isfulfilled)
  let productCount = 0;
  let fulfilledQCount = 0;
  let quantityQCount = 0;
  let colourResult = getColourCode(item?.createdat);
  let isAllFulfilled = false;
  let fulfillCount = 0;
  item.products.map((product, i) => {
    //console.log('iii', product);
    if (product.isfulfilled) {
      fulfillCount++;
    }
    fulfilledQCount = fulfilledQCount + product.fulfilledquantity;
    quantityQCount = quantityQCount + product.quantity;
    if (fulfillCount == item.products.length) {
      isAllFulfilled = true;
    }
  });
  return (
    <TouchableOpacity style={styles.item} onPress={() => handleClick(item)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ProductSans style={styles.nameText}>{item?.name.trim()}</ProductSans>

        {isAllFulfilled ? (
          <Image
            source={IMAGES.urlGood}
            style={{
              width: 20,
              height: 20,
            }}
            resizeMode="contain"
          />
        ) : (
          <Image />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{justifyContent: 'space-between'}}>
          <Text style={styles.bakedText}>
            {fulfilledQCount + ' of ' + quantityQCount + ' baked'}
          </Text>
          {!item.isfulfilled ? (
            <ColourComponent
              colourType={
                !item.products[0].isfulfilled ? colourResult : COLOURS.gray
              }
            />
          ) : null}
        </View>

        <View style={{marginTop: 5}}>
          <ProductSansBold style={styles.itemsText}>
            {item?.products.length +
              (item?.products.length > 1 ? ' items' : ' item')}{' '}
          </ProductSansBold>

          {!item.isfulfilled && colourResult == COLOURS.red ? (
            <View style={{paddingTop: 5}}>
              <ProductSans style={styles.delayHeaderText}>
                Delayed by
              </ProductSans>
              <ProductSans style={styles.delayText}>
                {getReadableDateAndTime(item?.createdat)}
              </ProductSans>
            </View>
          ) : (
            <View style={{paddingTop: 5}}>
              <ProductSans style={styles.delayHeaderText}></ProductSans>
              <ProductSans style={styles.delayText}></ProductSans>
            </View>
          )}
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
    // paddingRight:30
  },
  bakedText: {
    fontSize: fp(16),
    color: COLOURS.purple,
    paddingTop: 5,
  },
  nameText: {
    fontSize: fp(17),
    color: COLOURS.textInputColor,
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

// make this component available to the app
export default OrderProductComponent;