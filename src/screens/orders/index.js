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
  const {orders, error, ordersLoading} = useSelector(state => state.orders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completedOrdersArray, setCompletedOrdersArray] = useState([]);
  const [inCompleteOrdersArray, setIncompleteOrdersArray] = useState([]);
  const [pendingOrdersArray, setPendingOrdersArray] = useState([]);
  //console.log('redux orders', orders.length);
  const [orderState, setOrderState] = useState('pending');
  let pendingArray = [];
  let completeArray = [];
  let incompleteArray = [];

  useEffect(() => {
    fetchAllData('pending');
  }, []);

  // useEffect(() => {
  //   let count = 0;
  //   let unfulfilledCount = 0;
  //   orders.forEach((item, i) => {
  //     item.products.map((product, i) => {
  //       //console.log('item', product);
  //       if (product.isfulfilled) {
  //         count++;
  //       } else {
  //         unfulfilledCount++;
  //       }
  //       if (count == item.products.length) {
  //         completeArray.push(item);
  //       }
  //       if (unfulfilledCount == item.products.length) {
  //         pendingArray.push(item);
  //       } else {
  //         incompleteArray.push(item);
  //       }
  //     });
  //     setPendingOrdersArray(pendingArray);
  //     setCompletedOrdersArray(completeArray);
  //     setIncompleteOrdersArray(incompleteArray);
  //     pendingArray.length = 0;
  //     completeArray.length = 0;
  //     incompleteArray.length = 0;
  //   });
  // }, [orders, orderState]);

  const fetchAllData = status => {
    dispatch(getAllOrderedProducts(status));
  };
  const onRefresh = async () => {
    fetchAllData('pending');
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
    fetchAllData(state);
    // setPendingOrdersArray([]);
    // setCompletedOrdersArray([]);
    // setIncompleteOrdersArray([]);
    // setOrderState(state);
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
        // data={
        //   orderState == 'pending'
        //     ? pendingOrdersArray
        //     : orderState == 'completed'
        //     ? completedOrdersArray
        //     : inCompleteOrdersArray
        // }
        renderItem={renderItems}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View>
            {!ordersLoading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  top: 300,
                }}>
                <ProductSans
                  style={{fontSize: 16, color: COLOURS.textInputColor}}>
                  No record found
                </ProductSans>
              </View>
            ) : null}
          </View>
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
