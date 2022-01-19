import React from "react";
import { Text, StyleSheet } from "react-native";
import { fp } from "../../utils/responsive-screen";

const ProductSans = (props) => {
  return (
    <Text style={[styles.defaultStyles, props.style]} {...props} selectable>
      {props.children}
    </Text>
  );
};
export default ProductSans;

const styles = StyleSheet.create({
  defaultStyles: {
    fontFamily: "ProductSans-Regular",
    // color: '#fff',
    fontSize: fp(14)
  }
});
