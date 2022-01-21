import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLOURS} from '../utils/Colours';
import {fp, hp} from '../utils/responsive-screen';

import TextInputComponent from './TextInputComponent';

const QuantityProductComponent = ({style, item, sendValue}) => {
  const [value, setValue] = useState(item?.quantity);
  //console.log("redux qty order", order)
  const decrementValue = () => {
    if (value > 1) {
      setValue(value - 1);
      sendValue(item?.quantity - 1);
    }
  };

  const incrementValue = () => {
    setValue(value + 1);
    sendValue(item?.quantity + 1);
  };
  const handleQtyChange = text => {
    sendValue(parseInt(text) || 1);
  };

  return (
    <View style={[style, {flex: 0.5}]}>
      {/* quantity count view */}
      <View style={styles.wrapperView}>
        <TouchableOpacity onPress={decrementValue} style={styles.circleView}>
          <FontAwesome name="minus" size={hp(15)} color={COLOURS.text_color} />
        </TouchableOpacity>
        {/* <Averta style={styles.qtyView}>{value}</Averta> */}
        <TextInputComponent
          placeholder={'QTY'}
          handleTextChange={handleQtyChange}
          defaultValue={value ? value.toString() : ''}
          returnKeyType={'next'}
          keyboardType={'number-pad'}
          secureTextEntry={false}
          heightfigure={40}
          length={11}
          widthFigure={55}
          //refValue={phoneNumberRef}
          props={
            (styles.qtyView,
            {
              borderWidth: 0,
              textAlign: 'center',
              paddingLeft: 0,
              marginHorizontal: 8,
            })
          }
          // handleTextInputFocus={() =>
          //   setIsPhoneNumberFieldFocused(true)
          // }
          // handleBlur={() => setIsPhoneNumberFieldFocused(false)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
        <TouchableOpacity style={styles.circleView} onPress={incrementValue}>
          <FontAwesome name="plus" size={hp(15)} color={COLOURS.text_color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  circleView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.lightGray5,
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  qtyView: {
    marginHorizontal: 15,
    fontSize: fp(15),
    color: COLOURS.text_color,
  },
  wrapperView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default QuantityProductComponent;
