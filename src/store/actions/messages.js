import client from '../../utils/Api';
import {dateFilterParser} from '../../utils/DateFilter';
import {clearStorage, handleError, handleLogout} from '../../utils/utils';
import {getAllOrderedProductsStats} from './orders';

export const getAllMessages = () => {
  console.log('About to get all messages');
  return dispatch => {
    dispatch({
      type: 'GET_MESSAGES_PENDING',
      loading: true,
      error: null,
    });

    return client
      .get('/messages')
      .then(response => {
        handleLogout(response, dispatch);
        if (response?.data) {
          console.log(
            'Messages gotten successfully, size is ',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_MESSAGES_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_MESSAGES_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting messages failed', error);
        handleError(error, dispatch, 'get message list');
        dispatch({
          type: 'GET_MESSAGES_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const updateMessageById = (id, payload) => {
  console.log('About to update message with id', id);

  return dispatch => {
    dispatch({
      type: 'UPDATE_MESSAGE_PENDING',
      loading: true,
      error: null,
    });

    var url = `/messages/${id}`;
    //console.log("geturl", getUrl);
    return client
      .patch(url, payload)
      .then(response => {
        handleLogout(response, dispatch);
        if (response?.data) {
          if (response?.data?.isSuccessful) {
            console.log(
              'Message updated successfully',
              response?.data?.recordCount,
            );
            dispatch({
              type: 'UPDATE_MESSAGE_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });

            dispatch(getAllMessages());
            return response?.data?.results;
          } else {
            dispatch({
              type: 'UPDATE_MESSAGE_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Updating message failed', error);
        handleError(error, dispatch, 'updating message');
        dispatch({
          type: 'UPDATE_MESSAGE_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
