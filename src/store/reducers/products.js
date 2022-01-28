const initialState = {
  product: null,
  products: [],
  productsOrders: [],
  productsLoading:false,
  productsInCategoryPage: [],
  productMessge:"",
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCT_DATA':
      return initialState;

    case 'FETCH_ALL_PRODUCTS_PENDING':
      return {...state, productsLoading: action.loading};
    case 'FETCH_ALL_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.products,
        hasCreatedProduct: false,
        meta: {...state.meta, ...action.meta},
        productsLoading: action.loading,
      };
    case 'FETCH_ALL_PRODUCTS_FAILED':
      return {...state, productsLoading: action.loading, error: action.error};

    case 'GET_ALL_ZUPA_PRODUCTS_PENDING':
      return {...state, productsLoading: action.loading};
    case 'GET_ALL_ZUPA_PRODUCTS_SUCCESS':
      return {
        ...state,
        productsLoading:action.loading,
        productMessge:action.message
      };
    case 'GET_ALL_ZUPA_PRODUCTS_FAILED':
      return {...state, productsLoading: action.loading, error: action.error};

    default:
      return state;
  }
};
