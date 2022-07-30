import axios from 'axios';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import {clearEverythingOrders} from '../store/actions/orders';

let localBase;
if (Platform.OS == 'android') {
  localBase = '10.0.2.2';
} else {
  localBase = 'localhost';
}
const baseURL = `http://${localBase}:8089/api/`;
//const baseURL = 'https://gourmet-kitchen-api-oq8ef.ondigitalocean.app/api/';

let client = axios.create({
  baseURL,
  headers: {
    device: `Brand: ${DeviceInfo.getDeviceId()} | Platform: ${Platform.OS.toUpperCase()} | Version: ${
      Platform.Version
    }`,
  },
});

client.interceptors.response.use(
  function (response) {
    //console.log('rrhhhhhr', response.status);
    if (response.status == 200 || 201) {
      return Promise.resolve(response);
    } else if (response.status == 500) {
      alert('Server error: ' + response.data.message);
    } else {
      alert(
        response.data.message || 'Some error occured, please try again later',
      );
    }
  },

  error => {
    console.log('errrrrrrorrr', error);
    //return Promise.reject(error);
    if (error?.response?.status == 401) {
      return Promise.reject(error);
      //console.log('401 error', error?.response);
      //   alert(
      //     'Session Expired',
      //     'Your session has expired. Would you like to be redirected to the login page?',
      //   ).then(async () => {
      //     clearStorage();
      //   });
    } else {
      console.log('full error is ', error.response.data.message);
      return Promise.reject(error);
    }
  },
);
export default client;
