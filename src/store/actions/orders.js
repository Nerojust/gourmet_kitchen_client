import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError} from '../../utils/utils';

export const getAllOrderedProducts = (status) => {
  console.log('About to get all orders');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_ORDERED_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/orders`;
    //console.log("geturl", getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Orders gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_ORDERED_PRODUCTS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data;
          } else {
            dispatch({
              type: 'GET_ALL_ORDERED_PRODUCTS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting dashboard orders failed', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'GET_ALL_ORDERED_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const createOrder = orderPayload => {
  console.log('About to create a new order');
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_ORDER_PENDING',
      loading: true,
      error: null,
    });

    return client
      .post(`/orders`, orderPayload)
      .then(response => {
        if (response.data?.isSuccessful) {
          console.log('Order created successfully');

          dispatch({
            type: 'CREATE_ORDER_SUCCESS',
            loading: false,
          });
          //alert('Order created successfully');
          dispatch(getAllOrderedProducts());
          return response.data?.results;
        }
      })
      .catch(error => {
        console.log('Error creating order ', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'CREATE_ORDER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getOrder = id => {
  console.log('About to get single ordered product with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_ORDERED_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/orders/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single order gotten successfully');
          dispatch({
            type: 'GET_SINGLE_ORDERED_PRODUCTS_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single order', error);
        handleError(error, dispatch, 'get order');
        dispatch({
          type: 'GET_SINGLE_ORDERED_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
