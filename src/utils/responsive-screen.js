import {
  widthPercentageToDP,
  heightPercentageToDP
} from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const CustomHeight = 812;
const CustomWidth = 375;

export const hp = (value) => {
  const dimension = (value / CustomHeight) * 100;
  return heightPercentageToDP(`${dimension}%`);
};

export const wp = (value) => {
  const dimension = (value / CustomWidth) * 100;
  return widthPercentageToDP(`${dimension}%`);
};
export const fp = (value) => {
  return RFValue(value, deviceHeight);
};

export const deviceWidth = Dimensions.get('window').width;

export const deviceHeight = Dimensions.get('window').height;
export const deviceStatusBarHeight = getStatusBarHeight();

// console.log(getStatusBarHeight());

// // will be 0 on Android, because You pass true to skipAndroid
// console.log(getStatusBarHeight(true));
