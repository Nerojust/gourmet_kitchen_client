import {combineReducers} from 'redux';

import orders from './orders';
import products from './products';
import surplus from './surplus';
import sets from './sets';
import customers from './customers';
import notes from './notes';
import deliveryTypes from './delivery-types';
import users from './users';

export default combineReducers({
  orders,
  products,
  surplus,
  sets,
  customers,
  notes,
  deliveryTypes,
  users,
});
