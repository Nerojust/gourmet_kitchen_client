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
import {
  getAllOrderedProducts,
  getAllOrderedProductsStats,
} from '../../store/actions/orders';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import {fp} from '../../utils/responsive-screen';
import {getAllProducts, getAllZupaProducts} from '../../store/actions/products';
import SliderTabComponent from '../../components/SliderTabComponent';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders, createOrderLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('pending');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);

  useEffect(() => {
    fetchAllData(statusState);
  }, [statusState, selectedTab]);

  const fetchAllData = status => {
    dispatch(getAllOrderedProducts(status));
    dispatch(getAllProducts('', 0, 0, null));
    dispatch(getAllZupaProducts());
  };

  const onRefresh = async () => {
    fetchAllData();
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

  const renderHeaderView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <TouchableOpacity onPress={() => setStatusState('pending')}>
          <ProductSans
            style={{fontSize: fp(15), color: COLOURS.gray, fontWeight: '700'}}>
            Pending
          </ProductSans>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatusState('incomplete')}>
          <ProductSans
            style={{fontSize: fp(15), color: COLOURS.red, fontWeight: '700'}}>
            Incomplete
          </ProductSans>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStatusState('completed')}>
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

  const handlePendingOrders = () => {
    selectTab(0);
    setStatusState("pending")
  };
  const handleIncompleteOrders = () => {
    selectTab(1);
    setStatusState("incompleted")
  };
  const handleCompleteOrders = () => {
    selectTab(2);
    setStatusState("completed")
  };

  const selectTab = tabIndex => {
    //tabRef.current.animateNextTransition();
    if (tabIndex == 0) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    } else if (tabIndex == 1) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    } else if (tabIndex == 2) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    }
  };

  return (
    <ViewProviderComponent>
      <HeaderComponent name="Orders" isDashboard />
      {/* {renderHeaderView()} */}
      <SliderTabComponent
        isTabClicked={isTabClicked}
        name1={'Pending'}
        name2={'Incomplete'}
        name3={'Complete'}
        selectedTab={selectedTab}
        onPress1={handlePendingOrders}
        onPress2={handleIncompleteOrders}
        onPress3={handleCompleteOrders}
      />
      <FlatList
        data={orders}
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

//make this component available to the app
export default OrdersScreen;
