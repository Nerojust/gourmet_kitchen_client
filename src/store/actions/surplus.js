import client from '../../utils/Api';
import {LIMIT_FIGURE} from '../../utils/Constants';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError, handleLogout} from '../../utils/utils';
import {getAllOrderedProductsStats} from './orders';

export const clearSurplusData = () => {
  console.log('surplus cleared');
  return dispatch => {
    dispatch({
      type: 'CLEAR_SURPLUS_STATE',
    });
  };
};
export const updateSurplusProductData = data => {
  console.log('surplus pdt data added', data.length);
  return dispatch => {
    dispatch({
      type: 'SET_SURPLUS_PRODUCTS',
      data: data,
    });
  };
};
export const createSurplus = (orderPayload, date) => {
  console.log('About to create a new surplus', date);
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/surplus`;
    console.log('surplus create url', getUrl);
    return client
      .post(getUrl, orderPayload)
      .then(response => {
        //console.log("surplus",response)
        if (response.data?.isSuccessful) {
          console.log('surplus created successfully');

          dispatch({
            type: 'CREATE_SURPLUS_SUCCESS',
            loading: false,
          });
          //alert('Order created successfully');

          dispatch(getAllSurplusProducts(date));

          // dispatch(getAllSurplus(date));
          //dispatch(getAllOrderedProductsStats(date));
          return response.data?.results;
        }
      })
      .catch(error => {
        console.log('Error creating surplus ', error);
        handleError(error, dispatch, 'get surplus list');
        dispatch({
          type: 'CREATE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const createSurplusProduct = (orderPayload, date, offset) => {
  console.log('About to create a new surplus product', date);
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/surplusProducts`;
    console.log('surplus products create url', getUrl);
    return client
      .post(getUrl, orderPayload)
      .then(response => {
        //console.log("surplus",response)
        if (response.data?.isSuccessful) {
          console.log('surplus product created successfully');

          dispatch(clearSurplusData());
          dispatch({
            type: 'CREATE_SURPLUS_SUCCESS',
            loading: false,
            data: response?.data?.results,
          });
          //alert('Order created successfully');
          dispatch(getAllSurplusProducts(date, LIMIT_FIGURE, offset));

          //dispatch(getAllSurplus(date));
          //dispatch(getAllOrderedProductsStats(date));
          return response.data?.results;
        }
      })
      .catch(error => {
        console.log('Error creating surplus ', error);
        handleError(error, dispatch, 'get surplus list');
        dispatch({
          type: 'CREATE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getAllSurplus = date => {
  console.log('About to get all surplus');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/surplus?startDate=${date + ' 00:00:01'}&endDate=${
      date + ' 23:59:59'
    }`;

    console.log('geturl surplus', getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Surplus gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_SURPLUS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_ALL_SURPLUS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting surplus failed', error);
        handleError(error, dispatch, 'get surplus list');
        dispatch({
          type: 'GET_ALL_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getAllSurplusProducts = (date, limit, offset, status) => {
  console.log('About to get all surplus products');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_SURPLUS_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/surplusProducts?startDate=${date + ' 00:00:01'}&endDate=${
      date + ' 23:59:59'
    }&limit=${limit}&offset=${offset}&status=${status}`;

    console.log('geturl surplus', getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Surplus products gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_SURPLUS_PRODUCTS_SUCCESS',
              loading: false,
              data: response?.data?.results,
              count: response?.data?.totalCount,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_ALL_SURPLUS_PRODUCTS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting surplus failed', error);
        handleError(error, dispatch, 'get surplus product list');
        dispatch({
          type: 'GET_ALL_SURPLUS_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getSurplusById = (id, date) => {
  console.log('About to get single surplus with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/surplus/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single order gotten successfully');
          dispatch({
            type: 'GET_SINGLE_SURPLUS_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single surplus', error);
        handleError(error, dispatch, 'get surplus');
        dispatch({
          type: 'GET_SINGLE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const deductSurplusCount = (payload, date) => {
  console.log('About to deduct count from surplus', date);

  return dispatch => {
    dispatch({
      type: 'DEDUCT_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    var url = `/surplus/deduct?startDate=${date + 'T00:00:01'}&endDate=${
      date + 'T23:59:59'
    }`;
    //console.log("geturl", getUrl);
    return client
      .post(url, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Surplus deducted successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'DEDUCT_SURPLUS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getAllSurplus(date));
            return response?.data?.results;
          } else {
            dispatch({
              type: 'DEDUCT_SURPLUS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('deducting surplus failed', error);
        handleError(error, dispatch, 'deducting surplus');
        dispatch({
          type: 'DEDUCT_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const updateSurplusById = (id, payload, date) => {
  console.log('About to update surplus', date);

  return dispatch => {
    dispatch({
      type: 'UPDATE_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/surplus/${id}?startDate=${date + ' 00:00:01'}&endDate=${
      date + ' 23:59:59'
    }`;
    //var url = `/surplus/${id}`;
    //console.log("geturl", getUrl);
    return client
      .patch(getUrl, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Surplus updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_SURPLUS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getAllSurplus(date));
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_SURPLUS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Updating surplus failed', error);
        handleError(error, dispatch, 'updating surplus');
        dispatch({
          type: 'UPDATE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const deleteSurplusById = (id, date) => {
  console.log('About to delete single surplus with id', id, date);
  return dispatch => {
    dispatch({
      type: 'DELETE_SINGLE_SURPLUS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .delete(`/surplus/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single surplus deleted successfully');
          dispatch({
            type: 'DELETE_SINGLE_SURPLUS_SUCCESS',
            loading: false,
            data: response.data,
          });
          dispatch(getAllSurplus(date));
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error deleting single surplus', error);
        handleError(error, dispatch, 'delete surplus');
        dispatch({
          type: 'DELETE_SINGLE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
