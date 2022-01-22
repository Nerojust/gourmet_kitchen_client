//import liraries
import React, {Component, useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {capitalizeWord, DismissKeyboard} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import AvertaBold from '../../components/Text/AvertaBold';
import {deviceWidth, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import TextInputComponent from '../../components/TextInputComponent';

// create a component
const BreadListDetailsScreen = ({navigation, route}) => {
  console.log('bread details', route.params.bread);
  const [ovenCount, setOvenCount] = useState();
  const [isOvenCountFocused, setIsOvenCountFocused] = useState(false);
  var {name, sum:count} = route.params.bread;
  const ovenCountRef = useRef();

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            TOTAL NEEDED
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {count.toString()}
          </Averta>
        </View>

        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            PENDING
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {count-ovenCount||"0"}
          </Averta>
        </View>

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            IN OVEN
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {ovenCount &&ovenCount.toString() || '0'}
          </Averta>
        </View>
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            OVEN COUNT
          </ProductSansBold>
        
          <TextInputComponent
            placeholder={'Enter Oven Count'}
            handleTextChange={text => setOvenCount(text)}
            defaultValue={ovenCount}
            returnKeyType={'next'}
            keyboardType={'default'}
            secureTextEntry={false}
            capitalize={'sentences'}
            heightfigure={50}
            widthFigure={deviceWidth / 1.15}
            refValue={ovenCountRef}
            props={
              isOvenCountFocused
                ? {borderColor: COLOURS.blue}
                : {borderColor: COLOURS.zupa_gray_bg}
            }
            handleTextInputFocus={() => {
              setIsOvenCountFocused(true);
            }}
            handleBlur={() => {
              setIsOvenCountFocused(false);
            }}
            onSubmitEditing={event => {}}
          />
        </View>
      </View>
    );
  };

  const handleSubmit = () => {
    if (!ovenCount) {
      alert('Oven count is required');
      return;
    }
    if (ovenCount.length < 1 || ovenCount == '0') {
      alert('Oven count must be greater than zero');
      return;
    }
  };

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleSubmit}
        style={{
          marginTop: 5,
          justifyContent: 'center',
          //   marginBottom:
          //     keyboardHeight > 0 ? (Platform.OS == 'ios' ? 250 : 100) : 20,
          backgroundColor: COLOURS.zupaBlue,
          height: 50,
          borderRadius: 10,
          marginHorizontal: 20,
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          Submit
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText={route?.params?.bread?.name || 'Bread List Details'}
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              <>
                {renderDetails()}
                {displaySubmitButton()}
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
        </KeyboardObserverComponent>
      </DismissKeyboard>
    </ViewProviderComponent>
  );
};

// define your styles
const styles = StyleSheet.create({
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  customerNameView: {
    //width: deviceWidth - 50,
    marginTop: 5,
  },
  actions: {
    justifyContent: 'center',
    //height: hp(65),
    alignItems: 'flex-start',
  },
  actiontext: {
    fontSize: 12,
    //lineHeight: hp(19),
    color: COLOURS.labelTextColor,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 12,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
});

//make this component available to the app
export default BreadListDetailsScreen;
