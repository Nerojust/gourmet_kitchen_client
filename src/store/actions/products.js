import client, {ZupabaseURL} from '../../utils/Api';
import client2 from '../../utils/Api';
import {handleError, LIMIT_FIGURE} from '../../utils/utils';
import {dateFilterParser} from './../../utils/DateFilter';
import {APP_TOKEN} from '../../utils/Constants';
import {getAllOrderedProductsStats} from './orders';
import clientZupa from '../../utils/ApiZupa';

export const clearProductsArray = () => {
  return dispatch => {
    dispatch({
      type: 'PRODUCT_DATA',
    });
    console.log('cleared products redux array');
  };
};

export const syncZupaProducts = status => {
  console.log('About to zupa products');
  return dispatch => {
    dispatch({
      type: 'GET_ALL_ZUPA_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });
    var getUrl = `/productsToday`;
    //console.log("geturl", getUrl);
    return client
      .get(getUrl)
      .then(response => {
        if (response?.data) {
          console.log(
            'ZUPA products gotten successfully',
            response?.data?.message,
          );
          if (response?.data?.isSuccessful) {
            dispatch({
              type: 'GET_ALL_ZUPA_PRODUCTS_SUCCESS',
              loading: false,
              data: response?.data?.results,
              message: response.data?.message,
            });

            //alert(response?.data?.message);
            return response?.data?.results;
          } else {
            dispatch({
              type: 'GET_ALL_ZUPA_PRODUCTS_FAILED',
              loading: false,
              error: response?.data?.message,
            });
          }
        }
      })
      .catch(error => {
        console.log('zupa products getting failed', error);
        handleError(error, dispatch, 'get orders list');
        dispatch({
          type: 'GET_ALL_ZUPA_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
      });
  };
};

export const getAllProducts = (keyword, limit, offset) => {
  console.log('About to get all products');
  if (keyword.split(' ').length > 1) {
    var kk = keyword.split(' ');
    //console.log("kk", kk);
    keyword = kk[0] + '%20' + kk[1];
  } else {
    console.log('keyword is a single word');
  }
  return dispatch => {
    dispatch({
      type: 'FETCH_ALL_PRODUCTS_PENDING',
      loading: true,
      error: null,
    });

    var url = `/base-products?$offset=${offset}&$limit=${limit}&$order=-createdAt&$include=category%2C%20products%2C%20category.sizes%2Cproducts.categorySize&`;

    //add token to zupa client header
    clientZupa.defaults.headers.common['Authorization'] = `Bearer ${APP_TOKEN}`;

    return clientZupa
      .get(url)
      .then(response => {
        if (response.data) {
          console.log(
            'zupa Products gotten successfully. Size is ',
            response.data.data.length,
          );
          const {data, offset, limit, total} = response.data || [];

          dispatch({
            type: 'FETCH_ALL_PRODUCTS_SUCCESS',
            loading: false,
            products: data,
            meta: {
              total,
              limit,
              offset,
              page: 1 + offset / limit,
              pageSize: limit,
              pageTotal: Math.ceil(total / limit),
            },
          });

          return data;
        }
      })
      .catch(error => {
        console.log('Getting products failed', error);
        handleError(error, dispatch, 'get product list');
        dispatch({
          type: 'FETCH_ALL_PRODUCTS_FAILED',
          loading: false,
          error: error.message,
        });
        return error;
      });
  };
};
