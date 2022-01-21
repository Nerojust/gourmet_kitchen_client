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
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import {fp} from '../../utils/responsive-screen';

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
  const handleStateDispatch = state => {
    dispatch(getAllOrderedProducts(state));
  };
  const renderHeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <TouchableOpacity onPress={() => handleStateDispatch('pending')}>
          <ProductSans
            style={{fontSize: fp(15), color: COLOURS.gray, fontWeight: '700'}}>
            Pending
          </ProductSans>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStateDispatch('incomplete')}>
          <ProductSans
            style={{fontSize: fp(15), color: COLOURS.red, fontWeight: '700'}}>
            Incomplete
          </ProductSans>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleStateDispatch('complete')}>
          <ProductSans
            style={{
              fontSize: fp(15),
              color: COLOURS.green3,
              fontWeight: '700',
            }}>
            Complete
          </ProductSans>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ViewProviderComponent>
      <HeaderComponent name="Orders" isDashboard />
      {renderHeaderView()}
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
