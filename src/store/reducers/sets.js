const initialState = {
  sets: [],
  setsOrder: {},
  setsLoading: false,
  createSetsLoading: false,
  updatesetsLoading: false,
  isSetsUpdated: false,
  deductsetsLoading: false,
  deleteSetLoading: false,
  hasDeletedSet: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_SETS_STATE':
      return {
        ...state,
        sets: [],
      };

    case 'CREATE_SETS_PENDING':
      return {
        ...state,
        createSetsLoading: action.loading,
      };
    case 'CREATE_SETS_SUCCESS':
      return {
        ...state,
        sets: action.data,
        createSetsLoading: action.loading,
      };
    case 'CREATE_SETS_FAILED':
      return {
        ...state,
        createSetsLoading: action.loading,
        error: action.error,
      };

    case 'GET_SINGLE_SETS_PENDING':
      return {
        ...state,
        setsLoading: action.loading,
      };
    case 'GET_SINGLE_SETS_SUCCESS':
      return {
        ...state,
        setsOrder: action.data,
        setsLoading: action.loading,
      };
    case 'GET_SINGLE_SETS_FAILED':
      return {
        ...state,
        setsLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_SINGLE_SET_PENDING':
      return {
        ...state,
        deleteSetLoading: action.loading,
      };
    case 'DELETE_SINGLE_SET_SUCCESS':
      return {
        ...state,
        hasDeletedSet: true,
        deleteSetLoading: action.loading,
      };
    case 'DELETE_SINGLE_SET_FAILED':
      return {
        ...state,
        deleteSetLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_SETS_PENDING':
      return {
        ...state,
        setsLoading: action.loading,
      };
    case 'GET_ALL_SETS_SUCCESS':
      return {
        ...state,
        sets: action.data,
        setsLoading: action.loading,
      };
    case 'GET_ALL_SETS_FAILED':
      return {
        ...state,
        setsLoading: action.loading,
        error: action.error,
      };

    case 'UPDATE_SETS_PENDING':
      return {
        ...state,
        updatesetsLoading: action.loading,
        isSetsUpdated: false,
      };
    case 'UPDATE_SETS_SUCCESS':
      return {
        ...state,
        isSetsUpdated: true,
        updatesetsLoading: action.loading,
      };
    case 'UPDATE_SETS_FAILED':
      return {
        ...state,
        isSetsUpdated: false,
        updatesetsLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
