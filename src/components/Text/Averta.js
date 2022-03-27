import React from "react";
import { Text, StyleSheet } from "react-native";
import { fp } from "../../utils/responsive-screen";

const Averta = (props) => {
  return (
    <Text style={[styles.defaultStyles, props.style]} {...props} selectable>
      {props.children}
    </Text>
  );
};
export default Averta;

const styles = StyleSheet.create({
  defaultStyles: {
    fontFamily: "Averta-Regular",
    //color: '#fff',
    fontSize: fp(14)
  }
});
