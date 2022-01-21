//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddComponent from '../../components/AddComponent';
import HeaderComponent from '../../components/HeaderComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import OrderProductComponent from '../../components/OrderProductComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {getAllOrderedProducts} from '../../store/actions/orders';
import {COLOURS} from '../../utils/Colours';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders, ordersLoading} = useSelector(state => state.orders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //console.log('redux orders', orders);

  useEffect(() => {
    dispatch(getAllOrderedProducts());
  }, []);

  const onRefresh = async () => {
    dispatch(getAllOrderedProducts());
    setIsRefreshing(false);
  };
  const handleClick = item => {
    navigation.navigate('OrderDetails', {
      order: item,
    });
  };
  const renderItems = ({item, index}) => {
    return <OrderProductComponent item={item} handleClick={handleClick} />;
  };

  return (
    <ViewProviderComponent style={styles.container}>
      <HeaderComponent name="Orders" isDashboard />
      <FlatList
        data={orders}
        renderItem={renderItems}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
      <AddComponent goto={() => navigation.navigate('NewOrder')} />
      <LoaderShimmerComponent isLoading={ordersLoading} />
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
