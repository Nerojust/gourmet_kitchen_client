const initialState = {
    sets: [],
    setsOrder: {},
    setsLoading: false,
    createSetsLoading: false,
    updatesetsLoading: false,
    isSetsUpdated: false,
    deductsetsLoading: false,
    deletesetsLoading: false,
    hasDeletedSets: false,
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
  
      case 'DELETE_SINGLE_SETS_PENDING':
        return {
          ...state,
          deletesetsLoading: action.loading,
        };
      case 'DELETE_SINGLE_SETS_SUCCESS':
        return {
          ...state,
          hasDeletedSets: true,
          deletesetsLoading: action.loading,
        };
      case 'DELETE_SINGLE_SETS_FAILED':
        return {
          ...state,
          deletesetsLoading: action.loading,
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
          isSetsUpdated:false
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
  
        case 'DEDUCT_SETS_PENDING':
        return {
          ...state,
          deductsetsLoading: action.loading,
          isSetsUpdated:false
        };
      case 'DEDUCT_SETS_SUCCESS':
        return {
          ...state,
          isSetsUpdated: true,
          deductsetsLoading: action.loading,
        };
      case 'DEDUCT_SETS_FAILED':
        return {
          ...state,
          isSetsUpdated: false,
          deductsetsLoading: action.loading,
          error: action.error,
        };
  
      default:
        return state;
    }
  };
  