import client from '../../utils/Api';
import {handleError} from '../../utils/utils';

export const getRiderAnalytics = date => {
  console.log('About to get all rider analytics data');

  return dispatch => {
    dispatch({
      type: 'GET_RIDER_ANALYTICS_PENDING',
      loading: true,
      error: null,
    });
    //var getUrl = `/dispatch/analytics`;

    var getUrl = `/dispatch/analytics?startDate=${
      date + ' 00:00:01'
    }&endDate=${date + ' 23:59:59'}`;

    console.log('geturl', getUrl);

    // var getUrl = `/orders/analytics`;
    //console.log("geturl", getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'Rider analytics gotten successfully',
            response?.data?.recordCount,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_RIDER_ANALYTICS_SUCCESS',
              loading: false,
              data: response?.data?.results,
            });
            return response?.data?.results;
          } else {
            //alert(response?.data?.message);
            dispatch({
              type: 'GET_RIDER_ANALYTICS_FAILED',
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
          type: 'GET_RIDER_ANALYTICS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};
