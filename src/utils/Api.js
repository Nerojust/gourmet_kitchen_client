import axios from 'axios';

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
});

client.interceptors.response.use(
  function (response) {
    //console.log("rrhhhhhr", response)
    return Promise.resolve(response);
  },
  error => {
    //console.log("errrrrrrorrr", error)
    //return Promise.reject(error);
    if (error?.response?.status === 401) {
      //console.log('401 error', error?.response);
      //   alert(
      //     'Session Expired',
      //     'Your session has expired. Would you like to be redirected to the login page?',
      //   ).then(async () => {
      //     clearStorage();
      //   });
    } else {
      console.log('full error is ', error.message);
      return Promise.reject(error);
    }
  },
);
export default client;
