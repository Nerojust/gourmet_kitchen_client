import axios from 'axios';

export const baseURL = 'https://dev.api.zupa.ng'; //new dev link
//export const baseURL = 'https://api.zupa.ng'; //new prod link


let clientZupa = axios.create({
  baseURL,
});

clientZupa.interceptors.response.use(
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

export default clientZupa;
