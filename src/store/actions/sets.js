import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError} from '../../utils/utils';

export const setOrderStatus = status => {
  return dispatch => {
    dispatch({
      type: 'SELECTED_ORDER_STATUS',
      status: status,
    });
  };
};

export const getAllSets = () => {
  console.log('About to get all sets');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_SETS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/sets`;
    console.log('geturl sets', getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log('sets gotten successfully', response?.data?.recordCount);
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_SETS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
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
        console.log('Getting sets failed', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'GET_ALL_SETS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const createSet = orderPayload => {
  console.log('About to create a new set');
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_SETS_PENDING',
      loading: true,
      error: null,
    });

    return client
      .post(`/sets`, orderPayload)
      .then(response => {
        if (response.data?.isSuccessful) {
          console.log('set created successfully');

          dispatch({
            type: 'CREATE_SETS_SUCCESS',
            loading: false,
          });
          //alert('set created successfully');
          dispatch(getAllSets());
          dispatch(getAllSets());
          return response.data?.results;
        } else {
          dispatch({
            type: 'CREATE_SETS_FAILED',
            loading: false,
            error: error.message,
          });
        }
      })
      .catch(error => {
        console.log('Error creating set ', error);
        handleError(error, dispatch, 'get set list');
        dispatch({
          type: 'CREATE_SETS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getSetById = id => {
  console.log('About to get single set with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_SETS_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/sets/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single set gotten successfully');
          dispatch({
            type: 'GET_SINGLE_SETS_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single set', error);
        handleError(error, dispatch, 'get set');
        dispatch({
          type: 'GET_SINGLE_SETS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const deleteSetById = id => {
  console.log('About to delete one set with id ' + id);

  return dispatch => {
    dispatch({
      type: 'DELETE_SINGLE_SET_PENDING',
      loading: true,
      error: null,
    });

    return client
      .delete(`/sets/${id}`)
      .then(response => {
        if (response.data) {
          if (response?.data?.isSuccessful) {
            console.log('Deleted single set successfully', id, response.data);
            alert('Deleted single set successfully');
            dispatch(getAllSets(''));
            dispatch({
              type: 'DELETE_SINGLE_SET_SUCCESS',
              loading: false,
              //data: response.data,
            });

            return response.data;
          }
        }
      })

      .catch(error => {
        console.log('Error deleting single set', error);
        handleError(error, dispatch, 'deleting set');
        dispatch({
          type: 'DELETE_SINGLE_SET_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
