//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import OrderProductComponent from '../../components/OrderProductComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  deleteAllOrders,
  getAllOrderedProducts,
  setOrderStatus,
} from '../../store/actions/orders';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import {getAllProducts, syncZupaProducts} from '../../store/actions/products';
import SliderTabComponent from '../../components/SliderTabComponent';
import {useIsFocused} from '@react-navigation/native';
import { HeaderComponent } from '../../components/HeaderComponent';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders, deleteAllOrdersLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData(statusState);
    });
    dispatch(getAllOrderedProducts(statusState));
    return unsubscribe;
  }, [navigation, statusState, selectedTab]);

  const fetchAllData = () => {
    dispatch(getAllOrderedProducts(statusState));
    dispatch(getAllProducts('', 0, 0, null));
    dispatch(syncZupaProducts());
  };

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const handleClick = item => {
    //console.log("order item",item)
    navigation.navigate('OrderDetails', {
      id: item.id,
    });
  };

  const renderItems = ({item, index}) => {
    return <OrderProductComponent item={item} handleClick={handleClick} />;
  };

  const handleAllOrders = () => {
    selectTab(0);
    setStatusState('');
    dispatch(setOrderStatus(''));
  };
  const handleIncompleteOrders = () => {
    selectTab(1);
    setStatusState('incomplete');
    dispatch(setOrderStatus('incomplete'));
  };
  const handleCompleteOrders = () => {
    selectTab(2);
    setStatusState('completed');
    dispatch(setOrderStatus('completed'));
  };

  const selectTab = tabIndex => {
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

  const handleNewOrder = () => {
    navigation.navigate('NewOrder');
  };
  const handleDeleteOrders = () => {
    console.log('delete clicked');

    Alert.alert(
      'Alert',
      'Do you want to delete all order records?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () => dispatch(deleteAllOrders()),
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <ViewProviderComponent>
      <HeaderComponent
        name="Orders"
        isDashboard
        performDelete={handleDeleteOrders}
        shouldDisplayMoreIcon
      />

      <SliderTabComponent
        isTabClicked={isTabClicked}
        name1={'All'}
        name2={'Incomplete'}
        name3={'Complete'}
        selectedTab={selectedTab}
        onPress1={handleAllOrders}
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
      <AddComponent goto={handleNewOrder} />
      <LoaderShimmerComponent isLoading={deleteAllOrdersLoading} />
      <LoaderShimmerComponent isLoading={ordersLoading} />
    </ViewProviderComponent>
  );
};

//make this component available to the app
export default OrdersScreen;
