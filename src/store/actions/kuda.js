import client from '../../utils/Api';
import {handleError, handleLogout} from '../../utils/utils';

export const getKudaTransactionHistory = (date, roleid) => {
  console.log('About to get all kuda transaction history', date, roleid);

  return dispatch => {
    dispatch({
      type: 'GET_KUDA_HISTORY_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/kuda/virtualAccounts/transactions`;

    let payload = {
      startDate: date + ' 00:00:01',
      endDate: date + ' 23:59:59',
      roleId: roleid,
    };

    //console.log('geturl', getUrl);
    return client
      .post(getUrl, payload)
      .then(response => {
       
        //console.log("status",response.data)
        if (response?.data) {
          console.log(
            'Kuda history gotten successfully',
            response?.data.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_KUDA_HISTORY_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            alert(response?.data?.message);
            dispatch({
              type: 'GET_KUDA_HISTORY_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('Getting kuda history failed', error);
        handleError(error, dispatch, 'get kuda list');
        dispatch({
          type: 'GET_KUDA_HISTORY_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
