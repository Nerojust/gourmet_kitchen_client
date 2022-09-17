import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError, handleLogout} from '../../utils/utils';

export const getAllConfig = () => {
  console.log('About to get all config');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_CONFIG_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/config`;
    //console.log('geturl', getUrl);
    return client
      .get(getUrl)
      .then(response => {
       
        if (response?.data) {
          console.log('config gotten successfully', response?.data?.recordCount);
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_CONFIG_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            dispatch({
              type: 'GET_ALL_CONFIG_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting config failed', error);
        handleError(error, dispatch, 'get config list');
        dispatch({
          type: 'GET_ALL_CONFIG_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getConfigById = id => {
  console.log('About to get single config with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_CONFIG_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/config/${id}`)
      .then(response => {
       
        if (response.data) {
          console.log('Single config gotten successfully');
          dispatch({
            type: 'GET_SINGLE_CONFIG_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single config', error);
        handleError(error, dispatch, 'get config');
        dispatch({
          type: 'GET_SINGLE_CONFIG_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
