import React from "react";
import { Text, StyleSheet } from "react-native";
import { fp } from "../../utils/responsive-screen";
import { COLOURS } from "../../utils/Colours";

const ProductSansBold = ({ style, ...props }) => {
  return (
    <Text style={[styles.defaultStyles, style]} {...props} selectable>
      {props.children}
    </Text>
  );
};
export default ProductSansBold;

const styles = StyleSheet.create({
  defaultStyles: {
    fontFamily: "ProductSans-Bold",
    //color: COLOURS.white,
    fontSize: fp(14)
  }
});
