const initialState = {
  phoneArray: [],
  orders: [],
  orderedProductsStats: [],
  orderedProducts: [],
  order: {},
  countItem:{},
  selectedOrderStatus: '',
  ordersLoading: false,
  deleteAllOrdersLoading: false,
  createOrderLoading: false,
  updateSurplusOrderLoading: false,
  updateOrderLoading: false,
  isOrderUpdated: false,
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
    case 'SELECTED_ORDER_STATUS':
      return {
        ...state,
        selectedOrderStatus: action.status,
      };

    case 'DELETE_ORDERS_PENDING':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
      };
    case 'DELETE_ORDERS_SUCCESS':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
      };
    case 'DELETE_ORDERS_FAILED':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
        error: action.error,
      };

    case 'CREATE_ORDER_PENDING':
      return {
        ...state,
        createOrderLoading: action.loading,
      };
    case 'CREATE_ORDER_SUCCESS':
      return {
        ...state,
        order: action.data,
        createOrderLoading: action.loading,
      };
    case 'CREATE_ORDER_FAILED':
      return {
        ...state,
        createOrderLoading: action.loading,
        error: action.error,
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

    case 'GET_ALL_ORDERED_PRODUCTS_STATS_PENDING':
      return {
        ...state,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_ORDERED_PRODUCTS_STATS_SUCCESS':
      return {
        ...state,
        orderedProductsStats: action.data,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_ORDERED_PRODUCTS_STATS_FAILED':
      return {
        ...state,
        ordersLoading: action.loading,
        error: action.error,
      };

    case 'GET_ALL_PRODUCTS_STATS_PENDING':
      return {
        ...state,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_PRODUCTS_STATS_SUCCESS':
      return {
        ...state,
        orderedProducts: action.data,
        ordersLoading: action.loading,
      };
    case 'GET_ALL_PRODUCTS_STATS_FAILED':
      return {
        ...state,
        ordersLoading: action.loading,
        error: action.error,
      };

      case 'GET_SINGLE_PRODUCT_STAT_PENDING':
        return {
          ...state,
          ordersLoading: action.loading,
        };
      case 'GET_SINGLE_PRODUCT_STAT_SUCCESS':
        return {
          ...state,
          countItem: action.data,
          ordersLoading: action.loading,
        };
      case 'GET_SINGLE_PRODUCT_STAT_FAILED':
        return {
          ...state,
          ordersLoading: action.loading,
          error: action.error,
        };

    case 'UPDATE_COMPLETE_ORDER_PENDING':
      return {
        ...state,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_COMPLETE_ORDER_SUCCESS':
      return {
        ...state,
        isOrderUpdated: true,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_COMPLETE_ORDER_FAILED':
      return {
        ...state,
        isOrderUpdated: false,
        updateOrderLoading: action.loading,
        error: action.error,
      };
  
    case 'UPDATE_ORDER_SPECIAL_NOTE_PENDING':
      return {
        ...state,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_ORDER_SPECIAL_NOTE_SUCCESS':
      return {
        ...state,
        isOrderUpdated: true,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_ORDER_SPECIAL_NOTE_FAILED':
      return {
        ...state,
        isOrderUpdated: false,
        updateOrderLoading: action.loading,
        error: action.error,
      };
  
      case 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_PENDING':
      return {
        ...state,
        updateSurplusOrderLoading: action.loading,
      };
    case 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_SUCCESS':
      return {
        ...state,
        isOrderUpdated: true,
        updateSurplusOrderLoading: action.loading,
      };
    case 'UPDATE_SURPLUS_STATUS_ORDER_ITEM_FAILED':
      return {
        ...state,
        isOrderUpdated: false,
        updateSurplusOrderLoading: action.loading,
        error: action.error,
      };



    case 'UPDATE_OVEN_COUNT_PENDING':
      return {
        ...state,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_OVEN_COUNT_SUCCESS':
      return {
        ...state,
        isOrderUpdated: true,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_OVEN_COUNT_FAILED':
      return {
        ...state,
        isOrderUpdated: false,
        updateOrderLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
