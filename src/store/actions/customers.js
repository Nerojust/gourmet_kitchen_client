
import clientZupa from '../../utils/ApiZupa';
import { handleError } from '../../utils/utils';

export const createCustomer = payload => {
  //console.log('About to create customer', payload);
  return dispatch => {
    dispatch({
      type: 'CREATE_CUSTOMER_PENDING',
      loading: true,
      error: null,
    });
    return clientZupa
      .post('/customers', payload)
      .then(response => {
        if (response.data) {
          //console.log("Created customer successfully", response.data);
          const customer = response.data;
          dispatch({
            type: 'CREATE_CUSTOMER_SUCCESS',
            loading: false,
            customer,
          });
          return customer;
        }
      })
      .catch(error => {
        console.log('Failed creating customer', error);
        handleError(error, dispatch, 'creating customer');
        dispatch({
          type: 'CREATE_CUSTOMER_FAILED',
          loading: false,
          error: error.message,
        });
        return error;
      });
  };
};
