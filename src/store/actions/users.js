import client from '../../utils/Api';
import {handleError} from '../../utils/utils';

export const login = payload => {
  console.log('About to login with ', payload);

  return dispatch => {
    dispatch({
      type: 'LOGIN_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/login`, payload)
      .then(async response => {
        //console.log('ddddddddd', response.data);
        if (response?.data?.isSuccessful) {
          //console.log('Login successful');

          const accessToken = response.data.results.token;
          const user = response.data.results.user;

          console.log(
            'Login successful for ',
            response.data.results?.user?.firstname,
            response.data.results?.user?.lastname + '\n' + accessToken,
          );

          client.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`;

          dispatch({
            type: 'LOGIN_SUCCESS',
            loading: false,
            user: user,
            accessToken: accessToken,
            error: null,
          });

          return response.data.results;
        } else {
          alert(response.data.message);
          dispatch({
            type: 'LOGIN_FAILED',
            loading: false,
            error: response.data.message,
          });
        }
      })
      .catch(error => {
        console.log('Login failed =>', error.message);
        dispatch({
          type: 'LOGIN_FAILED',
          loading: false,
          error: error.message,
        });

        handleError(error, dispatch);
      });
  };
};

export const register = payload => {
  console.log('About to register a new user');
  return dispatch => {
    dispatch({
      type: 'REGISTER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/users`, payload)
      .then(async response => {
        //console.log("register resp", response);
        if (response?.data?.isSuccessful) {
          console.log(
            'New user registration successful',
            response?.data?.results,
          );
          const accessToken = response?.data?.results?.token;
          const profile = response?.data?.results?.user;

          // storeValue('userData', response.data);
          client.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`;

          dispatch({
            type: 'REGISTER_SUCCESS',
            loading: false,
            accessToken: accessToken,
            user: profile,
          });

          return response.data;
        } else {
          alert(response.data.message);
          dispatch({
            type: 'REGISTER_FAILED',
            loading: false,
            error: response.data.message,
          });
        }
      })

      .catch(error => {
        console.log('Error registering user', error);
        handleError(error);
        dispatch({
          type: 'REGISTER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const refreshToken = payload => {
  return dispatch => {
    dispatch({
      type: 'REFRESH_TOKEN_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/auth/refresh-token`, payload)
      .then(response => {
        // const accessToken = response.data.jwt;
        // const profile = response.data.user;
        // window.localStorage.setItem('accessToken', accessToken);
        // window.localStorage.setItem('_profile', JSON.stringify(profile));
        dispatch({
          type: 'REFRESH_TOKEN_SUCCESS',
          loading: false,
        });
        return response;
      })
      .catch(error => {
        dispatch({
          type: 'REFRESH_TOKEN_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const passwordUpdateRequest = payload => {
  console.log('About to update password ');
  return dispatch => {
    dispatch({
      type: 'REQUEST_PASSWORD_UPDATE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/password-update`, payload)
      .then(response => {
        if (response.data) {
          console.log('Password update successful', response.data);

          dispatch({
            type: 'REQUEST_PASSWORD_UPDATE_SUCCESS',
            loading: false,
          });
          //alert("Password update successful");

          return response.data;
        }
      })
      .catch(error => {
        console.log('Reset password failed', error);
        if (error == 'Error: Request failed with status code 404') {
          alert('User does not exist');
        } else if (error == 'Error: Request failed with status code 403') {
          alert('Invalid old or new password');
        }
        dispatch({
          type: 'REQUEST_PASSWORD_UPDATE_FAILED',
          loading: false,
          error:
            error.response.message ||
            error.response.data.message ||
            error.message,
        });
      });
  };
};

export const requestPasswordUpdate = payload => {
  console.log('About to update password');
  return dispatch => {
    dispatch({
      type: 'REQUEST_PASSWORD_UPDATE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/password-update`, payload)
      .then(async response => {
        if (response.data) {
          console.log('Password updated successful', response.data);
          dispatch({
            type: 'COMPLETE_PASSWORD_UPDATE_SUCCESS',
            loading: false,
          });

          return response;
        }
      })
      .catch(async error => {
        console.log('Error updating password');
        dispatch({
          type: 'COMPLETE_PASSWORD_UPDATE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const requestPasswordReset = payload => {
  console.log('About to reset password for ', payload.email);
  return dispatch => {
    // dispatch({
    //   type: "REQUEST_PASSWORD_RESET_PENDING",
    //   loading: true,
    //   error: null,
    // });
    return client
      .get(`/auth/password-reset?email=${payload.email}`)
      .then(response => {
        if (response?.status == 200 || response?.status == 204) {
          console.log('Password reset successful', response.data);
          dispatch({
            type: 'REQUEST_PASSWORD_RESET_SUCCESS',
            loading: false,
          });
          //alert("Password reset successful, please check your email");
          return 'successful';
        }
      })
      .catch(error => {
        console.log('Reset password failed', error);
        if (error == 'Error: Request failed with status code 404') {
          alert('User does not exist');
        }
        dispatch({
          type: 'REQUEST_PASSWORD_RESET_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const completePasswordReset = payload => {
  return dispatch => {
    dispatch({
      type: 'COMPLETE_PASSWORD_RESET_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/auth/password-reset`, payload)
      .then(response => {
        dispatch({
          type: 'COMPLETE_PASSWORD_RESET_SUCCESS',
          loading: false,
        });
        return response;
      })
      .catch(error => {
        dispatch({
          type: 'COMPLETE_PASSWORD_RESET_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getAllAdminUsers = keyword => {
  return dispatch => {
    dispatch({
      type: 'FETCH_ALL_USERS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(
        `/users?$order=-id&&$include=roles&$roles.id$[$ne]=user&$q=${keyword}&$searchFields=firstName%2C%20lastName%2C%20email`,
      )
      .then(response => {
        dispatch({
          type: 'FETCH_ALL_USERS_SUCCESS',
          loading: false,
          users: response.data.data,
        });
      })
      .catch(error => {
        dispatch({
          type: 'FETCH_ALL_USERS_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const getAllUsers = () => {
  console.log('About to get all users');
  return dispatch => {
    dispatch({
      type: 'FETCH_ALL_USERS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/users`)
      .then(response => {
        if (response.data.isSuccessful) {
          console.log('All users gotten successfully');
          dispatch({
            type: 'FETCH_ALL_USERS_SUCCESS',
            loading: false,
            users: response.data.results,
          });
          return response.data.results
        } else {
          alert(response.data.message);
          dispatch({
            type: 'FETCH_ALL_USERS_FAILED',
            loading: false,
            error: response.data.message,
          });
        }
      })
      .catch(error => {
        console.log('All users retrieval failed =>', error);
      
        dispatch({
          type: 'FETCH_ALL_USERS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const createUser = payload => {
  return dispatch => {
    dispatch({
      type: 'CREATE_USER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/users`, payload)
      .then(response => {
        dispatch({
          type: 'CREATE_USER_SUCCESS',
          loading: false,
        });
      })
      .catch(error => {
        dispatch({
          type: 'CREATE_USER_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const getUser = id => {
  return dispatch => {
    dispatch({
      type: 'GET_USER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/users/${id}`)
      .then(response => {
        const user = response.data;
        dispatch({
          type: 'GET_USER_SUCCESS',
          loading: false,
          user,
        });
      })
      .catch(error => {
        dispatch({
          type: 'GET_USER_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const patchUser = (id, payload) => {
  return dispatch => {
    dispatch({
      type: 'PATCH_USER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .patch(`/users/${id}`, payload)
      .then(response => {
        dispatch({
          type: 'PATCH_USER_SUCCESS',
          loading: false,
        });
      })
      .catch(error => {
        dispatch({
          type: 'PATCH_USER_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const uploadFile = payload => {
  console.log('About to upload file to s3');

  return dispatch => {
    dispatch({
      type: 'UPLOAD_FILE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post('/aws/s3/uploadFile', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        //timeout: 1000
      })

      .then(response => {
        if (response.data) {
          // console.log('status code', response.status);
          console.log(
            'Uploaded file successfully, response is',
            response.data.url,
          );
          if (response.data.url) {
            alert('Image uploaded successfully');
          }
          dispatch({
            type: 'UPLOAD_FILE_SUCCESS',
            url: response.data.url,
            loading: false,
          });
          return response.data.url;
        }
      })
      .catch(error => {
        console.log('Upload failed', error);
        if (
          error ==
            "TypeError: undefined is not an object (evaluating 't.response.status')" ||
          'Error: timeout of 1000ms exceeded'
        ) {
          alert('Error uploading image, please try again');
          return 'error';
        }
        dispatch({
          type: 'UPLOAD_FILE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const deleteUser = id => {
  return dispatch => {
    dispatch({
      type: 'DELETE_USER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .delete(`/users/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_USER_SUCCESS',
          loading: false,
        });
      })
      .catch(error => {
        dispatch({
          type: 'DELETE_USER_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const deleteUsers = query => {
  return dispatch => {
    dispatch({
      type: 'DELETE_USER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .delete(`/users${query}`)
      .then(response => {
        dispatch({
          type: 'DELETE_USER_SUCCESS',
          loading: false,
        });
      })
      .catch(error => {
        dispatch({
          type: 'DELETE_USER_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const logoutUser = () => {
  console.log('logged out user');
  //navigation.goBack();

  return dispatch => {
    dispatch({
      type: 'LOGOUT_USER',
      user: null,
      accessToken: '',
    });
  };
};

export const getDashboardStats = (
  period = 'day',
  startDate = '',
  endDate = '',
) => {
  console.log('About to get dashboard statistics', startDate, endDate);
  // const { startDate, endDate, period } = dateFilter;
  return dispatch => {
    dispatch({
      type: 'FETCH_DASHBOARD_ORDERS_STATS_PENDING',
      loading: true,
      error: null,
    });
    var withdate = `/stats?periodType=custom&periodFrom=${startDate}&periodTo=${endDate}`;
    var withoutDate = `/stats?periodType=${period}`;
    //console.log("dashboard stats",withdate )
    return client
      .get(period === 'custom' ? withdate : withoutDate)
      .then(response => {
        if (response.data) {
          console.log('Gotten dashboard statistics successfully.');
          dispatch({
            type: 'FETCH_DASHBOARD_ORDERS_STATS_SUCCESS',
            loading: false,
            stats: response.data.data,
          });
          return response.data;
        }
      })
      .catch(error => {
        console.log('Failed to get dashboard statistics', error.message);
        handleError(error, dispatch);
        dispatch({
          type: 'FETCH_DASHBOARD_ORDERS_STATS_FAILED',
          loading: false,
          error: error.message || error,
        });
      });
  };
};

export const getOrdersStats = dateFilter => {
  console.log('About to get orders statistics');
  return dispatch => {
    dispatch({
      type: 'FETCH_ORDERS_STATS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/stats?periodType=${dateFilter}`)
      .then(response => {
        console.log('Gotten orders statistics successfully.');
        dispatch({
          type: 'FETCH_ORDERS_STATS_SUCCESS',
          loading: false,
          stats: response.data.data,
        });
      })
      .catch(error => {
        console.log('Failed to get dashboard statistics');
        handleError(error, dispatch);
        dispatch({
          type: 'FETCH_ORDERS_STATS_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};

export const getCustomerStats = dateFilter => {
  console.log('About to get dashboard statistics');
  return dispatch => {
    dispatch({
      type: 'FETCH_CUSTOMER_STATS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/stats?periodType=${dateFilter}`)
      .then(response => {
        console.log('Gotten customer statistics successfully.');
        dispatch({
          type: 'FETCH_CUSTOMER_STATS_SUCCESS',
          loading: false,
          stats: response.data.data,
        });
      })
      .catch(error => {
        console.log('Failed to get dashboard statistics');
        handleError(error, dispatch);
        dispatch({
          type: 'FETCH_CUSTOMER_STATS_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};
export const checkUrlAvailability = (url, isSignup = false) => {
  console.log('About to check url', url);
  return dispatch => {
    dispatch({
      type: 'GET_URL_AVAILABILITY_PENDING',
      loading: true,
      error: null,
    });
    // if (isSignup) {
    //   //add it to the client header
    //   client.defaults.headers.common["Authorization"] = `Bearer ${APP_TOKEN}`;
    // }
    return client
      .get(`/store?url=${url}`)
      .then(response => {
        if (response.data) {
          console.log('Gotten url status', response.data.status);

          dispatch({
            type: 'GET_URL_AVAILABILITY_SUCCESS',
            loading: false,
            storeUrlStatus: response.data.status,
          });

          return response.data;
        }
      })
      .catch(error => {
        console.log('Failed getting url details', error);
        dispatch({
          type: 'GET_URL_AVAILABILITY_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getStoreWithWallet = () => {
  console.log('About to get store with wallet data with');
  return dispatch => {
    dispatch({
      type: 'GET_STORE_WALLET_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/stores?$include=wallet,states,location,user`)
      .then(response => {
        if (response.data) {
          const store = response.data;
          console.log('Gotten store and wallet successfully');
          dispatch({
            type: 'GET_STORE_WALLET_SUCCESS',
            loading: false,
            store,
          });

          return response.data;
        }
      })
      .catch(error => {
        handleError(error, dispatch);
        console.log('Failed getting store and wallet details', error);
        dispatch({
          type: 'GET_STORE_WALLET_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getLocations = () => {
  console.log('About to get locations');
  return dispatch => {
    dispatch({
      type: 'GET_LOCATION_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/locations`)
      .then(response => {
        if (response.data) {
          console.log('Gotten locations successfully');
          dispatch({
            type: 'GET_LOCATION_SUCCESS',
            loading: false,
            data: response.data.data,
          });

          return response.data;
        }
      })
      .catch(error => {
        handleError(error, dispatch);
        console.log('Failed getting locations', error);
        dispatch({
          type: 'GET_LOCATION_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getStore = id => {
  console.log('About to get store data with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_STORE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/stores/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Gotten store successfully');
          const store = response.data;
          dispatch({
            type: 'GET_STORE_SUCCESS',
            loading: false,
            store,
          });

          return response.data;
        }
      })
      .catch(error => {
        console.log('Failed getting store details', error);
        dispatch({
          type: 'GET_STORE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const patchLocation = (id, payload) => {
  console.log('About to patch location with id ', id);
  return dispatch => {
    dispatch({
      type: 'PATCH_LOCATION_PENDING',
      loading: true,
      error: null,
    });
    return client
      .patch(`/locations/${id}`, payload)
      .then(response => {
        if (response.data) {
          dispatch({
            type: 'PATCH_LOCATION_SUCCESS',
            loading: false,
          });
          console.log('Location patched successfully');

          dispatch(getStoreWithWallet(response?.data?.storeId));
          // dispatch(getStore(id));
          //dispatch(checkUrlAvailability(payload.customUrl));
          //alert("Update Successful");
          return response.data;
        }
      })
      .catch(error => {
        console.log('Error patching location', error);
        dispatch({
          type: 'PATCH_LOCATION_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
        return 'error';
      });
  };
};
export const updateNewLocation = payload => {
  console.log('About to patch new location');
  return dispatch => {
    dispatch({
      type: 'UPDATE_NEW_LOCATION_PENDING',
      loading: true,
      error: null,
    });
    return client
      .post(`/custom/stores/updatePopularLocation`, payload)
      .then(response => {
        if (response.data) {
          dispatch({
            type: 'UPDATE_NEW_LOCATION_SUCCESS',
            loading: false,
          });
          console.log('new Location patched successfully');

          dispatch(getStoreWithWallet(response?.data?.storeId));
          return response.data;
        }
      })
      .catch(error => {
        console.log('Error patching new location', error);
        dispatch({
          type: 'UPDATE_NEW_LOCATION_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
        return 'error';
      });
  };
};
export const patchStore = (id, payload) => {
  console.log('About to patch store with id ', id);
  return dispatch => {
    dispatch({
      type: 'PATCH_STORE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .patch(`/stores/${id}`, payload)
      .then(response => {
        if (response.data) {
          dispatch({
            type: 'PATCH_STORE_SUCCESS',
            loading: false,
          });
          console.log('Store patched successfully');
          dispatch(getStoreWithWallet(id));
          // dispatch(getStore(id));
          //dispatch(checkUrlAvailability(payload.customUrl));
          //alert("Update Successful");
          return response.data;
        }
      })
      .catch(error => {
        console.log('Error patching store', error);
        dispatch({
          type: 'PATCH_STORE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getTopItemsAnalytics = (
  periodType,
  periodCount,
  startDate = '',
  endDate = '',
) => {
  console.log('About to get top item analytics');
  return dispatch => {
    dispatch({
      type: 'FETCH_ITEMS_ANALYTICS_PENDING',
      loading: true,
      error: null,
    });
    var withdate = `/analytics?periodType=custom&periodFrom=${startDate}&periodTo=${endDate}&periodCount=${periodCount}`;
    var withoutDate = `/analytics?periodType=${periodType}&periodCount=${
      periodCount || 12
    }`;
    console.log('custom url', periodType === 'custom' ? withdate : withoutDate);
    return client
      .get(periodType === 'custom' ? withdate : withoutDate)
      .then(response => {
        if (response.data) {
          console.log('Analysis gotten successfully');

          dispatch({
            type: 'FETCH_ITEMS_ANALYTICS_SUCCESS',
            loading: false,
            itemsAnalytics: response.data.data,
          });

          return response.data;
        }
      })
      .catch(error => {
        console.log('Analytics failed', error);
        handleError(error, dispatch);
        dispatch({
          type: 'FETCH_ITEMS_ANALYTICS_FAILED',
          loading: false,
          error:
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.message,
        });
      });
  };
};
