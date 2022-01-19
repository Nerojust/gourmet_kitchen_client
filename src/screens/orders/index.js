//import liraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OrderProductComponent from '../../components/OrderProductComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {getAllOrderedProducts} from '../../store/actions/orders';
import {COLOURS} from '../../utils/Colours';

// create a component
const OrdersScreen = () => {
  const dispatch = useDispatch();
  const {orders} = useSelector(state => state.orders);
  //console.log('redux orders', orders);

  useEffect(() => {
    dispatch(getAllOrderedProducts());
  }, []);

  const renderItems = ({item, index}) => {

    return <OrderProductComponent item={item}  />;
  };

  return (
    <ViewProviderComponent style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItems}
        keyExtractor={item => item.customerid}
      />
    </ViewProviderComponent>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
  },
});

//make this component available to the app
export default OrdersScreen;
