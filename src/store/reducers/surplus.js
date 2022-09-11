const initialState = {
  surplus: [],
  surplusProducts: [],
  activeSurplusProducts: [],
  inactiveSurplusProducts: [],
  surplusOrder: {},
  surplusLoading: false,
  createSurplusLoading: false,
  updateSurplusLoading: false,
  isSurplusUpdated: false,
  deductSurplusLoading: false,
  deleteSurplusLoading: false,
  hasDeletedSurplus: false,
  error: '',
  totalCount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_SURPLUS_STATE':
      return {
        ...state,
        surplus: [],
        surplusProducts: [],
        activeSurplusProducts: [],
        inactiveSurplusProducts: [],

      };
    case 'SET_SURPLUS_PRODUCTS':
      return {
        ...state,
        surplusProducts: [...state.surplusProducts, ...action.data],
      };

    case 'CREATE_SURPLUS_PENDING':
      return {
        ...state,
        createSurplusLoading: action.loading,
      };
    case 'CREATE_SURPLUS_SUCCESS':
      return {
        ...state,
        surplus: action.data,
        createSurplusLoading: action.loading,
      };
    case 'CREATE_SURPLUS_FAILED':
      return {
        ...state,
        createSurplusLoading: action.loading,
        error: action.error,
      };

    case 'GET_SINGLE_SURPLUS_PENDING':
      return {
        ...state,
        surplusLoading: action.loading,
      };
    case 'GET_SINGLE_SURPLUS_SUCCESS':
      return {
        ...state,
        surplusOrder: action.data,
        surplusLoading: action.loading,
      };
    case 'GET_SINGLE_SURPLUS_FAILED':
      return {
        ...state,
        surplusLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_SINGLE_SURPLUS_PENDING':
      return {
        ...state,
        deleteSurplusLoading: action.loading,
      };
    case 'DELETE_SINGLE_SURPLUS_SUCCESS':
      return {
        ...state,
        hasDeletedSurplus: true,
        deleteSurplusLoading: action.loading,
      };
    case 'DELETE_SINGLE_SURPLUS_FAILED':
      return {
        ...state,
        deleteSurplusLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_SURPLUS_PRODUCTS_PENDING':
      return {
        ...state,
        surplusLoading: action.loading,
      };
    case 'GET_ALL_SURPLUS_PRODUCTS_SUCCESS':
      return {
        ...state,
        surplusProducts: [...state.surplusProducts, ...action.data],
        activeSurplusProducts: action.data,
        inactiveSurplusProducts: action.data,
        totalCount: action.count,
        surplusLoading: action.loading,
      };
    case 'GET_ALL_SURPLUS_PRODUCTS_FAILED':
      return {
        ...state,
        surplusLoading: action.loading,
        error: action.error,
      };
    case 'GET_ALL_SURPLUS_PENDING':
      return {
        ...state,
        surplusLoading: action.loading,
      };
    case 'GET_ALL_SURPLUS_SUCCESS':
      return {
        ...state,
        surplus: action.data,
        surplusLoading: action.loading,
      };
    case 'GET_ALL_SURPLUS_FAILED':
      return {
        ...state,
        surplusLoading: action.loading,
        error: action.error,
      };

    case 'UPDATE_SURPLUS_PENDING':
      return {
        ...state,
        updateSurplusLoading: action.loading,
        isSurplusUpdated: false,
      };
    case 'UPDATE_SURPLUS_SUCCESS':
      return {
        ...state,
        isSurplusUpdated: true,
        updateSurplusLoading: action.loading,
      };
    case 'UPDATE_SURPLUS_FAILED':
      return {
        ...state,
        isSurplusUpdated: false,
        updateSurplusLoading: action.loading,
        error: action.error,
      };

    case 'DEDUCT_SURPLUS_PENDING':
      return {
        ...state,
        deductSurplusLoading: action.loading,
        isSurplusUpdated: false,
      };
    case 'DEDUCT_SURPLUS_SUCCESS':
      return {
        ...state,
        isSurplusUpdated: true,
        deductSurplusLoading: action.loading,
      };
    case 'DEDUCT_SURPLUS_FAILED':
      return {
        ...state,
        isSurplusUpdated: false,
        deductSurplusLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
