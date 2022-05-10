import {getDateWithoutTime} from '../../utils/DateFilter';

const initialState = {
  phoneArray: [],
  orders: [],
  analytics: [],
  orderedProductsStats: [],
  orderedProducts: [],
  riderAnalytics: [],
  order: {},
  countItem: {},
  selectedOrderStatus: '',
  ordersLoading: false,
  deleteAllOrdersLoading: false,
  analyticsLoading: false,
  createOrderLoading: false,
  updateSurplusOrderLoading: false,
  isOrderProductUpdated:false,
  updateOrderLoading: false,
  isOrderUpdated: false,
  salesAverage:{},
  getSalesLoading:false,
  error: '',
  orderDate: getDateWithoutTime(new Date()),
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
    case 'SAVE_ORDER_DATE':
      return {
        ...state,
        orderDate: action.orderDate,
      };
    case 'SELECTED_ORDER_STATUS':
      return {
        ...state,
        selectedOrderStatus: action.status,
      };

    case 'DELETE_SINGLE_ORDERS_PENDING':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
      };
    case 'DELETE_SINGLE_ORDERS_SUCCESS':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
      };
    case 'DELETE_SINGLE_ORDERS_FAILED':
      return {
        ...state,
        deleteAllOrdersLoading: action.loading,
        error: action.error,
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

    case 'GET_SALES_AVERAGE_PENDING':
      return {
        ...state,
        getSalesLoading: action.loading,
      };
    case 'GET_SALES_AVERAGE_SUCCESS':
      return {
        ...state,
        salesAverage: action.data,
        getSalesLoading: action.loading,
      };
    case 'GET_SALES_AVERAGE_FAILED':
      return {
        ...state,
        getSalesLoading: action.loading,
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
    case 'UPDATE_ORDER_PRODUCT_PENDING':
      return {
        ...state,
        isOrderProductUpdated: false,
        ordersLoading: action.loading,
      };
    case 'UPDATE_ORDER_PRODUCT_SUCCESS':
      return {
        ...state,
        isOrderProductUpdated: true,
        ordersLoading: action.loading,
      };
    case 'UPDATE_ORDER_PRODUCT_FAILED':
      return {
        ...state,
        isOrderProductUpdated: false,
        ordersLoading: action.loading,
        error: action.error,
      };
    case 'UPDATE_ORDER_DISPATCH_PENDING':
      return {
        ...state,
        isOrderPatched: false,
        ordersLoading: action.loading,
      };
    case 'UPDATE_ORDER_DISPATCH_SUCCESS':
      return {
        ...state,
        isOrderPatched: true,
        ordersLoading: action.loading,
      };
    case 'UPDATE_ORDER_DISPATCH_FAILED':
      return {
        ...state,
        isOrderPatched: false,
        ordersLoading: action.loading,
        error: action.error,
      };

    case 'GET_RIDER_ANALYTICS_PENDING':
      return {
        ...state,
        analyticsLoading: action.loading,
      };
    case 'GET_RIDER_ANALYTICS_SUCCESS':
      return {
        ...state,
        riderAnalytics: action.data,
        analyticsLoading: action.loading,
      };
    case 'GET_RIDER_ANALYTICS_FAILED':
      return {
        ...state,
        analyticsLoading: action.loading,
        error: action.error,
      };
    case 'GET_ANALYTICS_PENDING':
      return {
        ...state,
        analyticsLoading: action.loading,
      };
    case 'GET_ANALYTICS_SUCCESS':
      return {
        ...state,
        analytics: action.data,
        analyticsLoading: action.loading,
      };
    case 'GET_ANALYTICS_FAILED':
      return {
        ...state,
        analyticsLoading: action.loading,
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

    case 'UPDATE_SINGLE_ORDER_PENDING':
      return {
        ...state,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_SINGLE_ORDER_SUCCESS':
      return {
        ...state,
        isOrderUpdated: true,
        updateOrderLoading: action.loading,
      };
    case 'UPDATE_SINGLE_ORDER_FAILED':
      return {
        ...state,
        isOrderUpdated: false,
        updateOrderLoading: action.loading,
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
