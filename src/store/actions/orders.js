import {Alert} from 'react-native';
import client from '../../utils/Api';
import clientZupa from '../../utils/ApiZupa';
import {LOGIN_TOKEN} from '../../utils/Constants';
import {getDateWithoutTime} from '../../utils/DateFilter';
import {handleError} from '../../utils/utils';
import {createCustomer} from './customers';
import {logoutUser} from './users';

export const setOrderStatus = status => {
  return dispatch => {
    dispatch({
      type: 'SELECTED_ORDER_STATUS',
      status: status,
    });
  };
};

export const getAllAnalytics = status => {
  console.log('About to get all analytics data');
  return dispatch => {
    dispatch({
      type: 'GET_ANALYTICS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/orders/analytics`;
    //console.log("geturl", getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Analytics gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ANALYTICS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_ANALYTICS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting analytics failed', error);
        handleError(error, dispatch, 'get analytics list');
        dispatch({
          type: 'GET_ANALYTICS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getAllOrderedProductsStats = status => {
  console.log('About to get all orders stats');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_PRODUCTS_STATS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/orders/count`;
    //console.log("geturl", getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Order stats gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_PRODUCTS_STATS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_ALL_PRODUCTS_STATS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting orders stats failed', error);
        // handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'GET_ALL_PRODUCTS_STATS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const saveOrderDate = date => {
  return async dispatch => {
    await dispatch({
      type: 'SAVE_ORDER_DATE',
      orderDate: date,
    });
  };
};
export const getAllOrderedProductsStatsById = id => {
  console.log('About to get stats with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_PRODUCT_STAT_PENDING',
      loading: true,
      error: null,
    });
    var url = `/orders/count/${id}`;
    //console.log("geturl", getUrl);
    return client
      .get(url)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Gotten stat successfully',
              response?.data?.results.length,
            );
            dispatch({
              type: 'GET_SINGLE_PRODUCT_STAT_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            return response?.data?.results;
          } else {
            dispatch({
              type: 'GET_SINGLE_PRODUCT_STAT_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('getting stat failed', error);
        handleError(error, dispatch, 'getting stat');
        dispatch({
          type: 'GET_SINGLE_PRODUCT_STAT_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const getAllOrderedProducts = (status = 'all', orderDate) => {
  console.log('About to get all orders');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_ORDERED_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });

    var getUrl = `/orders?status=${status}&startDate=${
        orderDate + ' 00:00:01'
      }&endDate=${orderDate + ' 23:59:59'}`;
 
    console.log('geturl', getUrl);

    //client.defaults.headers.common['Authorization'] = `Bearer ${LOGIN_TOKEN}`;
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Orders gotten successfully',
            response?.data?.recordCount,
          );
          //check status if it failed to patch from BE
          if (!status || status.length == 0) {
            //patch it
            handleCompleteOrdersStatus(
              response?.data?.results,
              dispatch,
              orderDate,
            );
            //refresh list
            getAllOrderedProducts('all', orderDate);
          }

          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_ORDERED_PRODUCTS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);

            dispatch({
              type: 'GET_ALL_ORDERED_PRODUCTS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting orders failed', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'GET_ALL_ORDERED_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
const handleCompleteOrdersStatus = (orders, dispatch, orderDate) => {
  if (orders && orders.length > 0) {
    // console.log('here ');
    orders?.map(fullOrderItem => {
      // console.log('fulfilled status', fullOrderItem?.isfulfilled);
      let count = 0;
      if (fullOrderItem.isfulfilled == false) {
        //console.log('inside ');
        fullOrderItem?.products &&
          fullOrderItem?.products.map(async oneItem => {
            if (
              oneItem.isfulfilled &&
              oneItem.quantity == oneItem.fulfilledquantity
            ) {
              count++;
            }
            if (count == fullOrderItem?.products.length) {
              console.log(
                'this order has its products all fulfilled, complete it ' +
                  fullOrderItem?.id,
              );
              let payload = {
                status: 'completed',
                isfulfilled: true,
              };
              dispatch(
                updateCompleteStatusForOrder(
                  fullOrderItem?.id,
                  payload,
                  orderDate,
                ),
              );
              count = 0;
            }
            //'count', count);
          });
      }
    });
  }
};

export const updateOrderListProductCount = (payload, orderDate) => {
  console.log('About to update breadlist count', payload);
  return dispatch => {
    dispatch({
      type: 'UPDATE_OVEN_COUNT_PENDING',
      loading: true,
      error: null,
    });
    var url = `/orders/updateOrders`;
    //console.log("geturl", getUrl);
    return client
      .patch(url, payload)
      .then(response => {
        if (response?.data) {
          console.log(
            'Orders gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'UPDATE_OVEN_COUNT_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            dispatch(getAllOrderedProductsStats());
            dispatch(getAllOrderedProducts('all', orderDate));
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_OVEN_COUNT_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting orders failed', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'UPDATE_OVEN_COUNT_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const updateSurplusStatusForOrderItemById = (id, payload) => {
  console.log('About to update surplus status with id', id, payload);
  return dispatch => {
    dispatch({
      type: 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_PENDING',
      loading: true,
      error: null,
    });
    var url = `/orders/updateSurplusStatusForOrderItem/${id}`;
    console.log('update surplus url', url);
    return client
      .patch(url, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Order SurplusStatusForOrderItem updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Updating SurplusStatusForOrderItem failed', error);
        handleError(error, dispatch, 'updating order');
        dispatch({
          type: 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const updateCompleteStatusForOrder = (id, payload, orderDate) => {
  console.log('About to updateCompleteStatusForOrder with id', id);
  return dispatch => {
    dispatch({
      type: 'UPDATE_COMPLETE_ORDER_PENDING',
      loading: true,
      error: null,
    });
    var url = `/orders/updateCompleteStatusForOrder/${id}`;
    //console.log("geturl", getUrl);
    return client
      .patch(url, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'updateCompleteStatusForOrder updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_COMPLETE_ORDER_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getAllOrderedProducts('all', orderDate));
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_COMPLETE_ORDER_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('updateCompleteStatusForOrder failed', error);
        handleError(error, dispatch, 'updating order');
        dispatch({
          type: 'UPDATE_COMPLETE_ORDER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const updateOrderSpecialNoteById = (id, payload) => {
  console.log('About to update order with id', id);
  return dispatch => {
    dispatch({
      type: 'UPDATE_ORDER_SPECIAL_NOTE_PENDING',
      loading: true,
      error: null,
    });
    var url = `/orders/updateOrderNote/${id}`;
    //console.log("geturl", getUrl);
    return client
      .patch(url, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Order special note updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_ORDER_SPECIAL_NOTE_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getOrder(id));
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_ORDER_SPECIAL_NOTE_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Updating order failed', error);
        handleError(error, dispatch, 'updating order');
        dispatch({
          type: 'UPDATE_ORDER_SPECIAL_NOTE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const createOrder = (
  kitchenPayload,
  customerPayload,
  orderPayload,
  orderDate,
) => {
  console.log('About to create a new kitchen order');
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_ORDER_PENDING',
      loading: true,
      error: null,
    });

    return client
      .post(`/orders`, kitchenPayload)
      .then(response => {
        if (response.data?.isSuccessful) {
          console.log('Kitchen Order created successfully');

          //save to zupa too
          dispatch(createZupaOrder(customerPayload, orderPayload)).then(
            (result, error) => {
              if (!error) {
                dispatch(getAllOrderedProducts('all', orderDate));
                dispatch({
                  type: 'CREATE_ORDER_SUCCESS',
                  loading: false,
                });
              } else {
                console.log('zupa save error', error);
                //there was an error, process it
                dispatch({
                  type: 'CREATE_ORDER_FAILED',
                  loading: false,
                  error: error.message,
                });
                displayRetryDialog();

                console.log('zupz Error ooops ', error);
              }
            },
          );
          //alert('Order created successfully');
          return response.data?.results;
        }
      })
      .catch(error => {
        console.log('Error creating kitchen order ', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'CREATE_ORDER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
const displayRetryDialog = () => {
  Alert.alert(
    'Alert',
    'Oops!, we could not create the order on Zupa',
    [
      {
        text: 'Never mind',
        onPress: () => {
          console.log('cancel Pressed');
          dispatch({
            type: 'CREATE_ORDER_SUCCESS',
            loading: false,
          });
        },
      },
      {
        text: 'Try Again',
        onPress: () => {
          dispatch(createZupaOrder(customerPayload, orderPayload)).then(
            (result, error) => {
              if (!error) {
                console.log('ZUPA ORDER CREATED ON SECOND TRY');
                dispatch({
                  type: 'CREATE_ORDER_SUCCESS',
                  loading: false,
                });
              } else {
                dispatch({
                  type: 'CREATE_ORDER_FAILED',
                  loading: false,
                  error: error.message,
                });
                displayRetryDialog();
              }
            },
          );
        },
      },
    ],
    {cancelable: true},
  );
};
export const createZupaOrder = (customerPayload, orderPayload) => {
  console.log('About to create a ZUPA order');
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_ORDER_PENDING',
      loading: true,
      error: null,
    });

    return dispatch(createCustomer(customerPayload))
      .then(customerResponse => {
        orderPayload.customerId = customerResponse?.id;
        //console.log("updated payload", orderPayload);
        return clientZupa
          .post(`/orders`, orderPayload)
          .then(response => {
            //console.log("response", response);
            if (response?.data) {
              console.log('=========ZUPA ORDER CREATED successfully==========');
              dispatch({
                type: 'CREATE_ORDER_SUCCESS',
                loading: false,
              });
              //alert("Order created successfully");
              return response?.data;
            }
          })
          .catch(error => {
            console.log('========Error creating ZUPA order=======', error);
            //handleError(error, dispatch, 'get orders list');
            dispatch({
              type: 'CREATE_ORDER_FAILED',
              loading: false,
              error: error.message,
            });
            return error;
          });
      })
      .catch(err => {
        console.log('Error creating new customer', err);

        //handleError(error, ' create order');
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
            data: response.data.results[0],
          });
          return response.data.results[0];
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
export const deleteOrderById = (id,orderDate) => {
  console.log('About to delete single order with id', id);
  return dispatch => {
    dispatch({
      type: 'DELETE_SINGLE_ORDERS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .delete(`/orders/${id}`)
      .then(response => {
        if (response.data.isSuccessful) {
          console.log('Single order deleted successfully');
          dispatch(getAllOrderedProducts('all', orderDate));
          dispatch({
            type: 'DELETE_SINGLE_ORDERS_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error deleting single surplus', error);
        handleError(error, dispatch, 'delete surplus');
        dispatch({
          type: 'DELETE_SINGLE_ORDERS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const deleteAllOrders = orderDate => {
  console.log('About to delete all orders');

  return dispatch => {
    dispatch({
      type: 'DELETE_ORDERS_PENDING',
      loading: true,
      error: null,
    });

    var url = `/orders/deleteAll?startDate=${orderDate + ' 00:00:01'}&endDate=${
      orderDate + ' 23:59:59'
    }`;

    return client
      .delete(url)
      .then(response => {
        if (response.data) {
          console.log('Deleted all orders successfully');
          dispatch(getAllOrderedProducts('all', orderDate));
          dispatch({
            type: 'DELETE_ORDERS_SUCCESS',
            loading: false,
            data: response.data,
          });

          return response.data;
        }
      })

      .catch(error => {
        console.log('Error deleting all orders', error);
        handleError(error, dispatch, 'get order');
        dispatch({
          type: 'DELETE_ORDERS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
