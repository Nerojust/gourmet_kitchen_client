import {combineReducers} from 'redux';

import orders from './orders';
import products from './products';
import surplus from './surplus';

export default combineReducers({
  orders,
  products,
  surplus,
});
