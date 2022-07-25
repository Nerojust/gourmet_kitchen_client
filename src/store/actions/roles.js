import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError, handleLogout} from '../../utils/utils';

export const getAllRoles = () => {
  console.log('About to get all roles');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_ROLES_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/roles`;
    //console.log('geturl', getUrl);
    return client
      .get(getUrl)
      .then(response => {
       
        if (response?.data) {
          console.log('roles gotten successfully', response?.data?.recordCount);
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_ROLES_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            dispatch({
              type: 'GET_ALL_ROLES_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting roles failed', error);
        handleError(error, dispatch, 'get role list');
        dispatch({
          type: 'GET_ALL_ROLES_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getRoleById = id => {
  console.log('About to get single role with id', id);
  return dispatch => {
    dispatch({
      type: 'GET_SINGLE_ROLE_PENDING',
      loading: true,
      error: null,
    });
    return client
      .get(`/roles/${id}`)
      .then(response => {
       
        if (response.data) {
          console.log('Single role gotten successfully');
          dispatch({
            type: 'GET_SINGLE_ROLE_SUCCESS',
            loading: false,
            data: response.data,
          });
          return response.data;
        }
      })

      .catch(error => {
        console.log('Error getting single role', error);
        handleError(error, dispatch, 'get role');
        dispatch({
          type: 'GET_SINGLE_ROLE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
