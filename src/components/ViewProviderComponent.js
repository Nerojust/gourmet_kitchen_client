import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { COLOURS } from "../utils/Colours";
import { CustomStatusBar } from '../utils/utils';

const ViewProviderComponent = ({
  children,
  style,
  onPress,
  isRefreshing,
  onRefreshData,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <CustomStatusBar>
      <View activeOpacity={1} style={[styles.container(insets), style]}>
        {children}
      </View>
    </CustomStatusBar>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: (insets) => ({
    flex: 1,
    //paddingTop: insets.top,
    backgroundColor: COLOURS.zupa_rider_bg,
  }),
});

//make this component available to the app
export default ViewProviderComponent;
