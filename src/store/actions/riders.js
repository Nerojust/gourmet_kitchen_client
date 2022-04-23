import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError} from '../../utils/utils';

export const createRider = orderPayload => {
  console.log('About to create a new surplus');
  //console.log("order payload", orderPayload);
  return dispatch => {
    dispatch({
      type: 'CREATE_RIDERS_PENDING',
      loading: true,
      error: null,
    });

    return client
      .post(`/riders`, orderPayload)
      .then(response => {
        if (response.data?.isSuccessful) {
          console.log('Rider created successfully');

          dispatch({
            type: 'CREATE_RIDERS_SUCCESS',
            loading: false,
          });
          //alert('Order created successfully');
          dispatch(getAllRiders());
          return response.data?.results;
        } else {
          alert(response.data.message);
          dispatch({
            type: 'CREATE_RIDERS_FAILED',
            loading: false,
            error: error.message,
          });
        }
      })
      .catch(error => {
        console.log('Error creating rider ', error);
        handleError(error, dispatch, 'get rider list');
        dispatch({
          type: 'CREATE_RIDERS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getAllRiders = () => {
  console.log('About to get all riders');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_RIDERS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/riders`;
    //console.log('geturl', getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Riders gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_RIDERS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_ALL_RIDERS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting riders failed', error);
        handleError(error, dispatch, 'get riders list');
        dispatch({
          type: 'GET_ALL_RIDERS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getRiderById = id => {
  console.log('About to get single rider with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_RIDER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/riders/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single rider gotten successfully');
          dispatch({
            type: 'GET_SINGLE_RIDER_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single rider', error);
        handleError(error, dispatch, 'get rider');
        dispatch({
          type: 'GET_SINGLE_RIDER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const updateRiderById = (id, payload) => {
  console.log('About to update rider');

  return dispatch => {
    dispatch({
      type: 'UPDATE_RIDER_PENDING',
      loading: true,
      error: null,
    });
    var url = `/riders/${id}`;
    //console.log("geturl", getUrl);
    return client
      .patch(url, payload)
      .then(response => {
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Rider updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_RIDER_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getAllRiders());
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_RIDER_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Updating rider failed', error);
        handleError(error, dispatch, 'updating rider');
        dispatch({
          type: 'UPDATE_SURPLUS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
export const deleteRiderById = id => {
  console.log('About to delete single rider with id', id);
  return dispatch => {
    dispatch({
      type: 'DELETE_SINGLE_RIDER_PENDING',
      loading: true,
      error: null,
    });
    return client
      .delete(`/riders/${id}`)
      .then(response => {
        if (response.data) {
          console.log('Single rider deleted successfully');
          dispatch({
            type: 'DELETE_SINGLE_RIDER_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error deleting single rider', error);
        handleError(error, dispatch, 'delete rider');
        dispatch({
          type: 'DELETE_SINGLE_RIDER_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
