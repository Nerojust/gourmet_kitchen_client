import AsyncStorage from '@react-native-community/async-storage';

import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Dimensions,
  Alert,
  ToastAndroid,
  BackHandler,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {GET_RIDER_REQUESTS} from './Api';
import {COLOURS} from '../utils/Colours';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/routers';

export const capitalizeWord = string => {
  var result = [];
  string &&
    string
      .split(' ')
      .map((word, i) =>
        result.push(
          word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase(),
        ),
      );
  //console.log('final word', result.join(','));
  return result.join(' ');
};

export const showLoader = ref => {
  ref.current.showLoading(true);
};

export const dismissLoader = ref => {
  if (ref.current) {
    ref.current.showLoading(false);
  }
};

export const dismissBottomSheetDialog = ref => {
  if (ref.current) {
    ref.current.close();
  }
};

export const showBottomSheet = ref => {
  if (ref.current) {
    ref.current.open();
  }
};

export const dismissTextInput = refdata => {
  refdata.current.blur();
};

export const NAIRA_ = '\u20a6';

export const formatNumberComma = inputNumber => {
  let formattedNumber = Number(inputNumber)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  //console.log("formatted number", formattedNumber);
  let splitArray = formattedNumber.split('.');
  //console.log("split", splitArray);
  if (splitArray.length > 1) {
    formattedNumber = splitArray[0];
  }
  return formattedNumber;
};

export const toggleDrawer = navigation => {
  navigation.dispatch(DrawerActions.toggleDrawer());
};

export const CustomStatusBar = ({
  backgroundColor = Platform.OS == 'ios' ? COLOURS.white : COLOURS.blue,
  barStyle = 'dark-content',
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: Platform.OS == 'ios' ? insets.top : 0,
        //height: Platform.OS == 'ios' ? deviceStatusBarHeight : 0,
        backgroundColor,
        flex: 1,
      }}>
      <StatusBar
        animated={false}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
      {children}
    </View>
  );
};

/**
 * Method to start the journey for an order or batch
 * @param {id to patch} data_id
 */
export const displayDialog = (message, method) => {
  Alert.alert(
    'Alert',
    message,
    [
      {
        text: 'No',
        onPress: () => {
          console.log('cancel Pressed');
        },
      },
      {
        text: 'Yes',
        onPress: () => method,
      },
    ],
    {cancelable: true},
  );
};
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Cleared all storage');
  } catch (error) {
    console.log(error);
  }
};

let currentCount = 0;
export const useDoubleBackPressExit = (exitHandler: () => void) => {
  if (Platform.OS === 'ios') return;
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    if (currentCount === 1) {
      exitHandler();
      subscription.remove();
      return true;
    }
    backPressHandler();
    return true;
  });
};
const backPressHandler = () => {
  if (currentCount < 1) {
    currentCount += 1;
    ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
  }
  setTimeout(() => {
    currentCount = 0;
  }, 2000);
};
export const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
export const dismissLoaderButton = loadingButtonRef => {
  if (loadingButtonRef.current) {
    loadingButtonRef.current.showLoading(false);
  }
};
export const showLoaderButton = loadingButtonRef => {
  loadingButtonRef.current.showLoading(true);
};

export const validatePassword = password => {
  const pass = /^[a-zA-Z0-9.,\\s]{3,40}$/;
  if (pass.test(password) === false) {
    Alert.alert('Invalid password character/s');
    return false;
  }
  return true;
};

export const validateNumber = number => {
  const num = /[0-9]{1,11}$/;
  if (num.test(number) === false) {
    Alert.alert('Invalid number character/s');
    return false;
  }

  return true;
};

export const validateEmail = email => {
  const emailadd =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailadd.test(email) === false) {
    //alert("Invalid email character/s");
    return false;
  }
  if (email.length !== 0 && email.length >= 4) {
  }
  return true;
};
// export const checkNetworkConnection = (setisNetworkAvailable) => {
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       //console.log("Is connected?", state.isConnected);
//       setisNetworkAvailable(state.isConnected);
//     });
//     return () => {
//       if (unsubscribe != null) unsubscribe();
//     };
//   }, []);
// };
export const LIMIT_FIGURE = 50;
export const INDEX_PAGE_SIZE_DEFAULT = 50;
export const INDEX_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];

export const handleError = (errormessage, dispatch, extMessage) => {
  var error = errormessage?.message;
  //console.log('the error is ', error);

  if (
    error == 'Network Error' ||
    error == 'Request failed with status code 502' ||
    error == 'timeout of 0ms exceeded'
  ) {
    alert('Network error, please check your network and try again');
    return;
  } else if (error == 'Request failed with status code 401') {
    console.log('session expired. try to go back to auth page.');
    dispatch(logoutUser());
    return;
  } else if (error == 'Request failed with status code 500') {
    alert('Oops! Server error, unable to ' + extMessage);
    return;
  } else if (error.includes('undefined is not an object (evaluating ')) {
    alert('Oops! Server error, unable to ' + extMessage + '. 3');
    return;
  } else if (error == 'Request failed with status code 403') {
    alert('Sorry!, Invalid credentials, please check and try again');
    return;
  } else if (error == 'Request failed with status code 409') {
    alert(
      'Sorry!, this email address already exists, please check and try again',
    );
    return;
  } else if (
    error == 'undefined is not an object (evaluating "t.response.status")'
  ) {
    alert(
      'Sorry!, this email address already exists, please check and try again',
    );
    return;
  } else {
    alert(
      'Oops!, we ran into a little issue, no worries, just refresh the page.',
    );
    // alert(error + '');
    return;
  }
};

export function getReadableDateAndTime(stringDate) {
  var currDate = new Date();
  var diffMs = currDate.getTime() - new Date(stringDate).getTime();

  var sec = diffMs / 1000;
  if (sec < 0) return 'now';

  if (sec < 60)
    return parseInt(sec) + ' second' + (parseInt(sec) > 1 ? 's' : '') + ' ago';

  var min = sec / 60;
  if (min < 60)
    return parseInt(min) + ' minute' + (parseInt(min) > 1 ? 's' : '') + ' ago';

  var h = min / 60;
  if (h < 24)
    return parseInt(h) + ' hour' + (parseInt(h) > 1 ? 's' : '') + ' ago';

  var d = h / 24;
  if (d < 30)
    return parseInt(d) + ' day' + (parseInt(d) > 1 ? 's' : '') + ' ago';

  var m = d / 30;
  if (m < 12)
    return parseInt(m) + ' month' + (parseInt(m) > 1 ? 's' : '') + ' ago';

  var y = m / 12;
  return parseInt(y) + ' year' + (parseInt(y) > 1 ? 's' : '') + ' ago';
}

export const getTodaysDate = date => {
  var dateFormat = require('dateformat');
  var now = new Date();

  // Basic usage
  if (!date) {
    return dateFormat(now, 'dS mmmm, yyyy');
  } else {
    return dateFormat(date, 'dS mmmm, yyyy @ hh:MM TT');
  }
};
export const storeValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    //console.log("stored state", value)
  } catch (error) {
    console.log(error);
  }
};
export const deleteValue = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('deleted successfully from storage');
  } catch (error) {
    console.log(error);
  }
};
export const removeItemValue = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

export const getValue = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      //console.log("gotten value from storage ", value)
      return value;
    } else {
      //console.log("error reading from storage");
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};
export const getOrdersRequest = (
  setLoadingMessage,
  setIsLoading,
  message,
  loginData,
  dispatch,
  shouldScroll,
  flatListRef,
  setIsResultOrderEmpty,
  setRefreshing,
) => {
  setIsLoading(true);
  setLoadingMessage(message);

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + loginData.jwt);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  fetch(GET_RIDER_REQUESTS, requestOptions)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson) {
        if (!responseJson.code) {
          if (responseJson.length > 0) {
            var refreshedList = [];
            //filter through to get only pending and started
            for (let i = 0; i < responseJson.length; i++) {
              const element = responseJson[i];
              if (element.status != 'completed') {
                refreshedList.push(element);
              }
            }
            //dispatch(saveOrder(refreshedList));
            console.log('done getting orders in utils');
            //scroll to the top
            if (shouldScroll) {
              flatListRef.current.scrollToOffset({
                animated: true,
                offset: 0,
              });
            }
          } else {
            setIsResultOrderEmpty(true);
          }
        } else {
          alert(responseJson.message);
        }
      } else {
        alert(responseJson.message);
      }
      setRefreshing(false);
      setIsLoading(false);
    })
    .catch(error => {
      console.log('error block', error);
      handleError(error);
      setRefreshing(false);
      setIsLoading(false);
    });
};
export function loopThroughOrders(
  orderState,
  newOrderList,
  setIsResultOrderEmpty,
) {
  for (let i = 0; i < orderState.length; i++) {
    const element = orderState[i];
    if (element.status != 'completed') {
      newOrderList.push(element);
      console.log('redux list done');
    }
    if (!newOrderList.length) {
      setIsResultOrderEmpty(true);
    }
  }
}
