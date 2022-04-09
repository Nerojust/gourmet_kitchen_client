
import clientZupa from '../../utils/ApiZupa';
import { handleError } from '../../utils/utils';

export const clearDeliveryTypesArray = () => {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_DELIVERY_DATA'
    });
    console.log('cleared delivery types redux array');
  };
};

export const getAllDeliveryTypes = (keyword) => {
  console.log('About to get delivery types');
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_DELIVERY_TYPES_PENDING',
      loading: true,
      error: null
    });
    
    return clientZupa
      .get(`/delivery-types?$order=-createdAt`)
      .then((response) => {
        if (response.data) {
          console.log(
            'Delivery types gotten successfully. Size is ' +
              response.data.data.length
          );
          dispatch({
            type: 'FETCH_ALL_DELIVERY_TYPES_SUCCESS',
            loading: false,
            deliveryTypes: response.data.data
          });

          return response.data;
        }
      })
      .catch((error) => {
        console.log('Failed getting delivery types');
        //handleError(error, dispatch, 'get delivery types');
        dispatch({
          type: 'FETCH_ALL_DELIVERY_TYPES_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const createDeliveryType = (payload) => {
  console.log('About to create a delivery type');
  return (dispatch) => {
    dispatch({
      type: 'CREATE_DELIVERY_TYPE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .post(`/delivery-types`, payload)
      .then((response) => {
        if (response.data) {
          console.log('delivery type created successfully', response.data);
          dispatch({
            type: 'CREATE_DELIVERY_TYPE_SUCCESS',
            loading: false
          });
          dispatch(getAllDeliveryTypes(''));
          //alert("Shipping price updated successfully");

          return response.data;
        }
      })
      .catch((error) => {
        handleError(error, dispatch, '');

        console.log('Error creating delivery type', error);
        dispatch({
          type: 'CREATE_DELIVERY_TYPE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const getDeliveryType = (id) => {
  return (dispatch) => {
    dispatch({
      type: 'GET_DELIVERY_TYPE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .delete(`/delivery-types/${id}`)
      .then((response) => {
        dispatch({
          type: 'GET_DELIVERY_TYPE_SUCCESS',
          loading: false
        });
      })
      .catch((error) => {
        handleError(error, dispatch, '');

        dispatch({
          type: 'GET_DELIVERY_TYPE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const patchDeliveryType = (id, payload) => {
  console.log('About to patch delivery type', id);
  return (dispatch) => {
    dispatch({
      type: 'PATCH_DELIVERY_TYPE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .patch(`/delivery-types/${id}`, payload)
      .then((response) => {
        if (response.data) {
          console.log('Delivery type patched successfully', response.data);
          dispatch({
            type: 'PATCH_DELIVERY_TYPE_SUCCESS',
            loading: false
          });
          dispatch(getAllDeliveryTypes(''));
          //alert("Update successful")
          return response.data;
        }
      })
      .catch((error) => {
        console.log('patching delivery type failed', error);
        handleError(error, dispatch, '');
        dispatch({
          type: 'PATCH_DELIVERY_TYPE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const deleteDeliveryType = (id) => {
  console.log('About to delete delivery type with id ', id);
  return (dispatch) => {
    dispatch({
      type: 'DELETE_DELIVERY_TYPE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .delete(`/delivery-types/${id}`)
      .then((response) => {
        if (response.data) {
          console.log('Delivery type deleted successfully', response.data);
          dispatch({
            type: 'DELETE_DELIVERY_TYPE_SUCCESS',
            loading: false
          });
          //alert("Deleted Successfully")
          dispatch(getAllDeliveryTypes(''));
          return response.data;
        }
      })
      .catch((error) => {
        console.log('error deleting delivery type', error);
        handleError(error, dispatch, '');
        dispatch({
          type: 'DELETE_DELIVERY_TYPE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const getDeliveryStates = () => {
  console.log('About to get all delivery states');
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_DELIVERY_STATES_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .get(`/states?$order=-createdAt`)
      .then((response) => {
        if (response.data) {
          console.log(
            'Delivery states gotten successfully, size is ',
            response.data.data.length
          );
          dispatch({
            type: 'FETCH_ALL_DELIVERY_STATES_SUCCESS',
            loading: false,
            deliveryStates: response.data.data
          });

          return response.data;
        }
      })
      .catch((error) => {
        handleError(error, dispatch, '');
        console.log('Delivery states failed', error);
        dispatch({
          type: 'FETCH_ALL_DELIVERY_STATES_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const createDeliveryState = (payload) => {
  console.log('About to create delivery state', payload);
  return (dispatch) => {
    dispatch({
      type: 'CREATE_DELIVERY_STATE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .post(`/states`, payload)
      .then((response) => {
        if (response.data) {
          console.log('delivery state created successfully', response.data);
          dispatch({
            type: 'CREATE_DELIVERY_STATE_SUCCESS',
            loading: false
          });

          dispatch(getDeliveryStates());
          //alert("Delivery state created successfully");

          return response.data;
        }
      })
      .catch((error) => {
        console.log('Delivery state creation failed', error);
        handleError(error, dispatch, '');
        dispatch({
          type: 'CREATE_DELIVERY_STATE_FAILED',
          loading: false,
          error: error.message
        });
        // message.error("An error occurred!");
      });
  };
};

export const getDeliveryState = (id) => {
  return (dispatch) => {
    dispatch({
      type: 'GET_DELIVERY_STATE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .delete(`/states/${id}`)
      .then((response) => {
        dispatch({
          type: 'GET_DELIVERY_STATE_SUCCESS',
          loading: false,
          deliveryState: response.data.data
        });
      })
      .catch((error) => {
        handleError(error, dispatch, '');
        dispatch({
          type: 'GET_DELIVERY_STATE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const patchDeliveryState = (id, payload) => {
  console.log('About to patch delivery state with id', id, payload);
  return (dispatch) => {
    dispatch({
      type: 'PATCH_DELIVERY_STATE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .patch(`/states/${id}`, payload)
      .then((response) => {
        if (response.data) {
          console.log('Delivery state updated successfully', response.data);
          dispatch({
            type: 'PATCH_DELIVERY_STATE_SUCCESS',
            loading: false
          });
          //alert("Delivery location updated succesfully");
          dispatch(getDeliveryStates());
          dispatch(getAllDeliveryTypes());
          return response.data;
        }
      })
      .catch((error) => {
        console.log('Delivery state failed', error);
        handleError(error, dispatch, '');
        dispatch({
          type: 'PATCH_DELIVERY_STATE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};

export const deleteDeliveryState = (id) => {
  console.log('About to delete delivery state with id ', id);
  return (dispatch) => {
    dispatch({
      type: 'DELETE_DELIVERY_STATE_PENDING',
      loading: true,
      error: null
    });
    return clientZupa
      .delete(`/states/${id}`)
      .then((response) => {
        if (response.data) {
          console.log('Delivery state deleted successfully', response.data);
          dispatch({
            type: 'DELETE_DELIVERY_STATE_SUCCESS',
            loading: false
          });
          //alert("Deleted successfully");
          dispatch(getDeliveryStates());

          return response.data;
        }
      })
      .catch((error) => {
        handleError(error, dispatch, '');

        console.log('Deleting delivery location failed', error);
        dispatch({
          type: 'DELETE_DELIVERY_STATE_FAILED',
          loading: false,
          error: error.message
        });
      });
  };
};
