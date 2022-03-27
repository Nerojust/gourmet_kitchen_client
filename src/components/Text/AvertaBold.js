import React from "react";
import { Text, StyleSheet } from "react-native";
import { fp } from "../../utils/responsive-screen";

const AvertaBold = (props) => {
  return (
    <Text style={[styles.defaultStyles, props.style]} {...props} selectable>
      {props.children}
    </Text>
  );
};
export default AvertaBold;

const styles = StyleSheet.create({
  defaultStyles: {
    fontFamily: "Averta-Bold",
    //color: '#fff',
    fontSize: fp(14)
  }
});
