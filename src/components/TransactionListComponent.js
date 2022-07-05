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
  formatNumberCommaNaira,
  getColourCode,
  getReadableDateAndTime,
  NAIRA_,
} from '../utils/utils';
import ColourComponent from './ColorComponent';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const TransactionListComponent = ({item, handleClick, index}) => {
  // console.log('item', item);

  return (
    <TouchableOpacity
      key={index}
      style={styles.customerNameView}
      activeOpacity={0.6}
      onPress={() => handleClick(item)}>
      <View
        key={index}
        style={{
          //flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center',
        }}>
        {/* sendername section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Sender Name:
          </ProductSans>

          <ProductSans
            style={[
              styles.labelText,
              {
                alignSelf: 'flex-end',
                fontWeight: 'bold',
                flex: 1,
                color: COLOURS.purple,
              },
            ]}>
            {' '}
            {item.senderName ? item?.senderName.trim() : 'None'}
          </ProductSans>
        </View>

        {/* sender bank section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Bank Name:
          </ProductSans>

          <ProductSans
            style={[
              styles.labelText,
              {alignSelf: 'flex-end', fontWeight: 'bold', flex: 1},
            ]}>
            {' '}
            {item.senderBank ? item?.senderBank.trim() : 'None'}
          </ProductSans>
        </View>

        {/* amount section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Amount:
          </ProductSans>

          <ProductSans
            style={[
              styles.labelText,
              {
                alignSelf: 'flex-end',
                fontWeight: 'bold',
                flex: 1,
                color: COLOURS.green4,
              },
            ]}>
            {' '}
            {item.amount ? formatNumberCommaNaira(item?.amount) : 'None'}
          </ProductSans>
        </View>

        {/* narration section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Narration:
          </ProductSans>

          <ProductSans
            style={[styles.labelText, {alignSelf: 'flex-end', flex: 1}]}>
            {' '}
            {item.narration ? item?.narration.trim() : 'None'}
          </ProductSans>
        </View>
        {/* reference section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Reference:
          </ProductSans>

          <ProductSans
            style={[styles.labelText, {alignSelf: 'flex-end', flex: 1}]}>
            {' '}
            {item.referenceNumber ? item?.referenceNumber.trim() : 'None'}
          </ProductSans>
        </View>

        {/* beneficiary nae section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Beneficiary Name:
          </ProductSans>

          <ProductSans
            style={[styles.labelText, {alignSelf: 'flex-end', flex: 1}]}>
            {' '}
            {item.beneficiaryName ? item?.beneficiaryName.trim() : 'None'}
          </ProductSans>
        </View>

        {/* date section */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProductSans style={[styles.labelText, {flex: 0.4}]}>
            Date:
          </ProductSans>

          <ProductSans
            style={[styles.labelText, {alignSelf: 'flex-end', flex: 1}]}>
            {' '}
            {moment(item?.transactionDate).format('LLL')}
          </ProductSans>
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
    backgroundColor: COLOURS.lightGray4,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  labelText: {
    fontSize: fp(15),
    color: COLOURS.labelTextColor,
    paddingTop: 0,
    paddingBottom: 5,
    // left: 12,
  },
});

// make this component available to the app
export default TransactionListComponent;
