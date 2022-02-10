import {combineReducers} from 'redux';

import orders from './orders';
import products from './products';
import surplus from './surplus';
import sets from './sets'

export default combineReducers({
  orders,
  products,
  surplus,
  sets
});
