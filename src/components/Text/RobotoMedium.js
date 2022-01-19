import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLOURS } from "../../utils/Colours";
import { fp } from "../../utils/responsive-screen";


const RobotoMedium = ({ style, ...props }) => {
  return (
    <Text style={[styles.defaultStyles, style]} {...props} selectable>
      {props.children}
    </Text>
  );
};
export default RobotoMedium;

const styles = StyleSheet.create({
  defaultStyles: {
    fontFamily: "Roboto-medium",
    color: COLOURS.white,
    fontSize: fp(14)
  }
});
