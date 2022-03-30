const initialState = {
  deliveryType: null,
  deliveryTypes: [],

  deliveryState: null,
  deliveryStates: [],

  error: null,
  loading: false,

  deliveryTypesLoading: false,
  deliveryStatesLoading: false,

  getDeliveryTypeLoading: false,
  getDeliveryStateLoading: false,

  createDeliveryTypeLoading: false,
  createDeliveryStateLoading: false,

  patchDeliveryTypeLoading: false,
  patchDeliveryStateLoading: false,

  deleteDeliveryTypeLoading: false,
  deleteDeliveryStateLoading: false,

  hasCreatedDeliveryType: false,
  hasCreatedDeliveryState: false,

  hasPatchedDeliveryType: false,
  hasPatchedDeliveryState: false,

  hasDeletedDeliveryType: false,
  hasDeletedDeliveryState: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_DELIVERY_DATA':
      return initialState;

    case 'FETCH_ALL_DELIVERY_TYPES_PENDING':
      return { ...state, deliveryTypesLoading: action.loading };
    case 'FETCH_ALL_DELIVERY_TYPES_SUCCESS':
      return {
        ...state,
        deliveryTypes: action.deliveryTypes,
        hasCreatedDeliveryType: false,
        hasDeletedDeliveryType: false,
        deliveryTypesLoading: action.loading
      };
    case 'FETCH_ALL_DELIVERY_TYPES_FAILED':
      return {
        ...state,
        deliveryTypesLoading: action.loading,
        error: action.error
      };

    // New
    // Fetch
    case 'FETCH_ALL_DELIVERY_STATES_PENDING':
      return { ...state, deliveryStatesLoading: action.loading };
    case 'FETCH_ALL_DELIVERY_STATES_SUCCESS':
      return {
        ...state,
        deliveryStates: action.deliveryStates,
        hasDeletedDeliveryType: false,
        deliveryStatesLoading: action.loading
      };
    case 'FETCH_ALL_DELIVERY_STATES_FAILED':
      return {
        ...state,
        deliveryStatesLoading: action.loading,
        error: action.error
      };

    //   Get
    case 'GET_DELIVERY_STATE_PENDING':
      return { ...state, getDeliveryStateLoading: action.loading };
    case 'GET_DELIVERY_STATE_SUCCESS':
      return {
        ...state,
        deliveryState: action.deliveryState,
        getDeliveryStateLoading: action.loading
      };
    case 'GET_DELIVERY_STATE_FAILED':
      return {
        ...state,
        getDeliveryStateLoading: action.loading,
        error: action.error
      };

    //   Create

    case 'CREATE_DELIVERY_STATE_PENDING':
      return { ...state, createDeliveryStateoading: action.loading };
    case 'CREATE_DELIVERY_STATE_SUCCESS':
      return {
        ...state,
        hasCreatedDeliveryState: true,
        createDeliveryStateLoading: action.loading
      };
    case 'CREATE_DELIVERY_STATE_FAILED':
      return {
        ...state,
        hasCreatedDeliveryState: false,
        createDeliveryStateLoading: action.loading,
        error: action.error
      };

    //   Update
    case 'PATCH_DELIVERY_STATE_PENDING':
      return { ...state, patchDeliveryStateLoading: action.loading };
    case 'PATCH_DELIVERY_STATE_SUCCESS':
      return {
        ...state,
        hasPatchedDeliveryState: true,
        patchDeliveryStateLoading: action.loading
      };
    case 'PATCH_DELIVERY_STATE_FAILED':
      return {
        ...state,
        patchDeliveryStateLoading: action.loading,
        error: action.error
      };

    //Delete
    case 'DELETE_DELIVERY_STATE_PENDING':
      return { ...state, deleteDeliveryStateLoading: action.loading };
    case 'DELETE_DELIVERY_STATE_SUCCESS':
      return {
        ...state,
        hasDeletedDeliveryState: true,
        deleteDeliveryStateLoading: action.loading
      };
    case 'DELETE_DELIVERY_STATE_FAILED':
      return {
        ...state,
        deleteDeliveryStateLoading: action.loading,
        error: action.error
      };

    // New

    case 'GET_DELIVERY_TYPE_PENDING':
      return { ...state, getDeliveryTypeLoading: action.loading };
    case 'GET_DELIVERY_TYPE_SUCCESS':
      return {
        ...state,
        deliveryType: action.deliveryType,
        getDeliveryTypeLoading: action.loading
      };
    case 'GET_DELIVERY_TYPE_FAILED':
      return {
        ...state,
        getDeliveryTypeLoading: action.loading,
        error: action.error
      };

    case 'CREATE_DELIVERY_TYPE_PENDING':
      return { ...state, createDeliveryTypeLoading: action.loading };
    case 'CREATE_DELIVERY_TYPE_SUCCESS':
      return {
        ...state,
        hasCreatedDeliveryType: true,
        createDeliveryTypeLoading: action.loading
      };
    case 'CREATE_DELIVERY_TYPE_FAILED':
      return {
        ...state,
        hasCreatedDeliveryType: false,
        createDeliveryTypeLoading: action.loading,
        error: action.error
      };

    case 'PATCH_DELIVERY_TYPE_PENDING':
      return { ...state, patchDeliveryTypeLoading: action.loading };
    case 'PATCH_DELIVERY_TYPE_SUCCESS':
      return {
        ...state,
        hasPatchedDeliveryType: true,
        patchDeliveryTypeLoading: action.loading
      };
    case 'PATCH_DELIVERY_TYPE_FAILED':
      return {
        ...state,
        patchDeliveryTypeLoading: action.loading,
        error: action.error
      };

    case 'DELETE_DELIVERY_TYPE_PENDING':
      return { ...state, deleteDeliveryTypeLoading: action.loading };
    case 'DELETE_DELIVERY_TYPE_SUCCESS':
      return {
        ...state,
        hasDeletedDeliveryType: true,
        deleteDeliveryTypeLoading: action.loading
      };
    case 'DELETE_DELIVERY_TYPE_FAILED':
      return {
        ...state,
        deleteDeliveryTypeLoading: action.loading,
        error: action.error
      };

    case 'FETCH_ALL_PERMISSIONS_PENDING':
      return { ...state, permissionsLoading: action.loading };
    case 'FETCH_ALL_PERMISSIONS_SUCCESS':
      return {
        ...state,
        permissions: action.permissions,
        permissionsLoading: action.loading
      };
    case 'FETCH_ALL_PERMISSIONS_FAILED':
      return {
        ...state,
        permissionsLoading: action.loading,
        error: action.error
      };

    default:
      return state;
  }
};
