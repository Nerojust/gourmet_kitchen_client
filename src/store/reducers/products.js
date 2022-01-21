import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS,
} from '../../utils/utils';

const initialState = {
  product: null,
  products: [],
  productsOrders: [],
  productsInCategoryPage: [],
  error: null,
  loading: false,
  productsLoading: false,
  getProductLoading: false,
  createProductLoading: false,
  patchProductLoading: false,
  deleteProductLoading: false,
  hasCreatedProduct: false,
  hasPatchedProduct: false,
  hasDeletedProduct: false,
  productsOrdersLoading: false,
  meta: {
    total: 0,
    page: 1,
    offset: 0,
    limit: 10,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
  },
  metaProducts: {
    total: 0,
    page: 1,
    offset: 0,
    limit: 10,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
  },
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
        hasDeletedProduct: false,
        meta: {...state.meta, ...action.meta},
        productsLoading: action.loading,
      };
    case 'FETCH_ALL_PRODUCTS_FAILED':
      return {...state, productsLoading: action.loading, error: action.error};

    case 'FETCH_ALL_PRODUCTS_PENDING2':
      return {...state, productsLoading: action.loading};
    case 'FETCH_ALL_PRODUCTS_SUCCESS2':
      return {
        ...state,

        productsInCategoryPage: action.productsInCategoryPage,
        hasCreatedProduct: false,
        hasDeletedProduct: false,

        metaProducts: {...state.metaProducts, ...action.metaProducts},
        productsLoading: action.loading,
      };
    case 'FETCH_ALL_PRODUCTS_FAILED2':
      return {...state, productsLoading: action.loading, error: action.error};

    case 'FETCH_ALL_PRODUCTS_ORDERS_PENDING':
      return {...state, productsOrdersLoading: action.loading};
    case 'FETCH_ALL_PRODUCTS_ORDERS_SUCCESS':
      return {
        ...state,
        metaProducts: {...state.meta, ...action.meta},
        productsOrders: action.orderedProducts,

        productsOrdersLoading: action.loading,
      };
    case 'FETCH_ALL_PRODUCTS_ORDERS_FAILED':
      return {
        ...state,
        productsOrdersLoading: action.loading,
        error: action.error,
      };

    case 'GET_PRODUCT_PENDING':
      return {...state, getProductLoading: action.loading};
    case 'GET_PRODUCT_SUCCESS':
      return {
        ...state,
        product: action.product,
        getProductLoading: action.loading,
      };
    case 'GET_PRODUCT_FAILED':
      return {
        ...state,
        getProductLoading: action.loading,
        error: action.error,
      };

    case 'CREATE_PRODUCT_PENDING':
      return {...state, createProductLoading: action.loading};
    case 'CREATE_PRODUCT_SUCCESS':
      return {
        ...state,
        hasCreatedProduct: true,
        createProductLoading: action.loading,
      };
    case 'CREATE_PRODUCT_FAILED':
      return {
        ...state,
        createProductLoading: action.loading,
        error: action.error,
      };

    case 'PATCH_PRODUCT_PENDING':
      return {...state, patchProductLoading: action.loading};
    case 'PATCH_PRODUCT_SUCCESS':
      return {
        ...state,
        hasPatchedProduct: true,
        patchProductLoading: action.loading,
      };
    case 'PATCH_PRODUCT_FAILED':
      return {
        ...state,
        patchProductLoading: action.loading,
        error: action.error,
      };

    case 'DELETE_PRODUCT_PENDING':
      return {...state, deleteProductLoading: action.loading};
    case 'DELETE_PRODUCT_SUCCESS':
      return {
        ...state,
        hasDeletedProduct: true,
        deleteProductLoading: action.loading,
      };
    case 'DELETE_PRODUCT_FAILED':
      return {
        ...state,
        deleteProductLoading: action.loading,
        error: action.error,
      };

    case 'FETCH_ALL_PERMISSIONS_PENDING':
      return {...state, permissionsLoading: action.loading};
    case 'FETCH_ALL_PERMISSIONS_SUCCESS':
      return {
        ...state,
        permissions: action.permissions,
        permissionsLoading: action.loading,
      };
    case 'FETCH_ALL_PERMISSIONS_FAILED':
      return {
        ...state,
        permissionsLoading: action.loading,
        error: action.error,
      };

    default:
      return state;
  }
};
