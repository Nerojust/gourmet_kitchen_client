//import liraries
import React from 'react';
import {
  View,
  StyleSheet,
  Image} from 'react-native';
import { COLOURS } from '../utils/Colours';
import { deviceWidth, hp } from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';
import ProductSansBold from './Text/ProductSansBold';

// create a component
const SuccessPageComponent = ({
  image,
  headerName1,
  headerSubName
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          width: deviceWidth
        }}
      >
        <Image
          source={image}
          resizeMode={'contain'}
          style={{ width: 70, height: 70 }}
        />
        <ProductSansBold
          style={{
            fontSize: 24,
            color: COLOURS.textInputColor,
            marginVertical: 20
          }}
        >
          {headerName1}
        </ProductSansBold>
        <ProductSans
          style={{
            fontSize: 14,
            color: COLOURS.textInputColor,
            textAlign: 'center',
            lineHeight: 22.4,
            paddingHorizontal: 80
          }}
        >
          {headerSubName}
        </ProductSans>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    //backgroundColor: '#2c3e50',
  },
  buttonText: {
    fontSize: 14,
    color: COLOURS.white,
    fontWeight: 'bold',
    lineHeight: 22.4
  },
  button: {
    width: '55%',
    height: hp(50),
    top: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 20,
    borderRadius: 10,
    //marginHorizontal: 25,
    backgroundColor: COLOURS.blue
  }
});

//make this component available to the app
export default SuccessPageComponent;
