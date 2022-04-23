const initialState = {
  riders: [],
  rider: {},
  ridersLoading: false,
  createRidersLoading: false,
  updateRidersLoading: false,
  isRidersUpdated: false,
  deductRidersLoading: false,
  deleteRidersLoading: false,
  hasDeletedRiders: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_RIDERS_STATE':
      return {
        ...state,
        Riders: [],
      };

    case 'CREATE_RIDERS_PENDING':
      return {
        ...state,
        createRidersLoading: action.loading,
      };
    case 'CREATE_RIDERS_SUCCESS':
      return {
        ...state,
        riders: action.data,
        createRidersLoading: action.loading,
      };
    case 'CREATE_RIDERS_FAILED':
      return {
        ...state,
        createRidersLoading: action.loading,
        error: action.error,
      };

    case 'GET_SINGLE_RIDER_PENDING':
      return {
        ...state,
        ridersLoading: action.loading,
      };
    case 'GET_SINGLE_RIDER_SUCCESS':
      return {
        ...state,
        rider: action.data,
        ridersLoading: action.loading,
      };
    case 'GET_SINGLE_RIDER_FAILED':
      return {
        ...state,
        ridersLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_SINGLE_RIDER_PENDING':
      return {
        ...state,
        deleteRidersLoading: action.loading,
      };
    case 'DELETE_SINGLE_RIDER_SUCCESS':
      return {
        ...state,
        hasDeletedRiders: true,
        deleteRidersLoading: action.loading,
      };
    case 'DELETE_SINGLE_RIDER_FAILED':
      return {
        ...state,
        deleteRidersLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_RIDERS_PENDING':
      return {
        ...state,
        ridersLoading: action.loading,
      };
    case 'GET_ALL_RIDERS_SUCCESS':
      return {
        ...state,
        riders: action.data,
        ridersLoading: action.loading,
      };
    case 'GET_ALL_RIDERS_FAILED':
      return {
        ...state,
        ridersLoading: action.loading,
        error: action.error,
      };

    case 'UPDATE_RIDER_PENDING':
      return {
        ...state,
        updateRidersLoading: action.loading,
        isRidersUpdated: false,
      };
    case 'UPDATE_RIDER_SUCCESS':
      return {
        ...state,
        isRidersUpdated: true,
        updateRidersLoading: action.loading,
      };
    case 'UPDATE_RIDER_FAILED':
      return {
        ...state,
        isRidersUpdated: false,
        updateRidersLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
