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
  Platform,
} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';
import {deviceWidth, fp, hp, wp} from '../utils/responsive-screen';
import {getColourCode, getReadableDateAndTime} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const OrderProductComponent = ({item, handleClick, handleDispatchClick}) => {
  // console.log('item', item);
  var currDate = new Date();
  var diffMs = currDate.getTime() - new Date(item?.createdat).getTime();
  var sec = diffMs / 1000;
  var min = sec / 60;
  //console.log("min",min)
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
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: 15}}>
          {item.isset ? (
            <View style={{alignItems: 'flex-end', paddingVertical: 5}}>
              <ProductSansBold style={[styles.itemsText, {fontWeight: '300'}]}>
                {item?.setname ? item?.setname : 'Set'}
              </ProductSansBold>
            </View>
          ) : null}

          {item?.isonlineorder && item?.zupaorderid?.length > 0 ? (
            <View style={{alignItems: 'flex-end', paddingVertical: 5}}>
              <ProductSansBold
                style={[
                  styles.itemsText,
                  {fontWeight: '700', color: COLOURS.green2, fontSize: fp(12)},
                ]}>
                ONLINE ORDER
              </ProductSansBold>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}>
            <ProductSans style={styles.nameText}>
              {item?.customer ? item?.customer?.name.trim() : 'None'}
            </ProductSans>

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
              <Image />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: Platform.OS == 'android' ? 2 : 5,
            }}>
            <View style={{justifyContent: 'space-between'}}>
              <Text style={styles.bakedText}>
                {fulfilledQCount + ' of ' + quantityQCount + ' baked'}
              </Text>
              {min > 30 ? (
                <ColourComponent
                  colourType={!isAllFulfilled ? colourResult : null}
                />
              ) : (
                <>
                  {item?.status != 'completed' ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLOURS.gray,
                        borderRadius: 20,
                        width: 15,
                        height: 15,
                      }}
                    />
                  ) : null}
                </>
              )}
            </View>

            <View style={{marginTop: 5}}>
              <ProductSansBold style={[styles.itemsText]}>
                {item?.products.length +
                  (item?.products.length > 1 ? ' items' : ' item')}{' '}
              </ProductSansBold>

              {!item.isfulfilled ? (
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
                  <ProductSans style={styles.delayText}></ProductSans>
                </View>
              )}
            </View>
          </View>
          {item.isfulfilled ? (
            <ProductSans style={styles.delayHeaderText}>
              {moment(item.updatedat).format('LLL')}
            </ProductSans>
          ) : null}
        </View>

        <View style={{flex: 0.3, justifyContent: 'center', right: -wp(10)}}>
          {!item.isfulfilled ? (
            <TouchableOpacity
              onPress={() => handleDispatchClick('Fulfill', item)}
              activeOpacity={0.6}
              style={{
                height: Platform.OS == 'android' ? hp(40) : hp(35),
                justifyContent: 'center',
                //paddingHorizontal: 10,
                borderRadius: 8,
                borderColor: COLOURS.white,
                borderWidth: 0.4,
                backgroundColor: COLOURS.blue,
                alignItems: 'center',
              }}>
              <ProductSansBold
                style={[
                  styles.actiontext,
                  {
                    left: 0,
                    marginTop: 0,
                    color: COLOURS.white,
                    fontSize: fp(12),
                    fontWeight: 'bold',
                  },
                ]}>
                Fulfill
              </ProductSansBold>
            </TouchableOpacity>
          ) : null}
          {!item.dispatch ? (
            <TouchableOpacity
              onPress={() => handleDispatchClick('Dispatch', item)}
              activeOpacity={0.6}
              style={{
                height: Platform.OS == 'android' ? hp(40) : hp(35),
                justifyContent: 'center',
                // paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 0.4,
                borderColor: COLOURS.white,
                backgroundColor: COLOURS.green5,
                alignItems: 'center',
                marginTop: 15,
              }}>
              <ProductSansBold
                style={[
                  styles.actiontext,
                  {
                    left: 0,
                    marginTop: 0,
                    color: COLOURS.white,
                    fontSize: fp(12),
                    fontWeight: 'bold',
                  },
                ]}>
                Dispatch
              </ProductSansBold>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOURS.lightGray4,
    padding: Platform.OS == 'android' ? 5 : 10,
    marginVertical: Platform.OS == 'android' ? hp(7) : hp(5),
    marginHorizontal: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  itemsText: {
    color: COLOURS.gray1,
    fontSize: fp(14),
    fontWeight: 'bold',
    // paddingRight:30
  },
  bakedText: {
    fontSize: fp(14),
    color: COLOURS.purple,
    paddingTop: 5,
  },
  nameText: {
    fontSize: fp(17),
    color: COLOURS.textInputColor,
  },
  smallTitle: {
    fontSize: fp(12),
    color: COLOURS.textInputColor,
  },
  delayHeaderText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
  },
  delayText: {
    fontSize: Platform.OS == 'android' ? fp(14) : fp(15),
    color: COLOURS.yellow1,
    fontWeight: 'bold',
  },
});

// make this component available to the app
export default OrderProductComponent;
