const initialState = {
  phoneArray: [],
  orders: [],
  order:{},
  ordersLoading: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_PHONE_NUMBERS':
      return {
        ...state,
        phoneArray: [],
      };

    case 'CLEAR_ORDERS_STATE':
      return {
        ...state,
        orders: [],
      };

    case 'GET_SINGLE_ORDERED_PRODUCTS_PENDING':
      return {
        ...state,
        ordersLoading: action.loading,
      };
    case 'GET_SINGLE_ORDERED_PRODUCTS_SUCCESS':
      return {
        ...state,
        order: action.data,
        ordersLoading: action.loading,
      };
    case 'GET_SINGLE_ORDERED_PRODUCTS_FAILED':
      return {
        ...state,
        ordersLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_ORDERED_PRODUCTS_PENDING':
      return {
        ...state,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_ORDERED_PRODUCTS_SUCCESS':
      return {
        ...state,
        orders: action.data,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_ORDERED_PRODUCTS_FAILED':
      return {
        ...state,
        ordersLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
