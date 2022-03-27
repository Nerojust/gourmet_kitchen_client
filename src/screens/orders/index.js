//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  Keyboard,
  Platform,
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
import SearchInputComponent from '../../components/SearchInputComponent';
import SliderTabComponent from '../../components/SliderTabComponent';
import {useIsFocused} from '@react-navigation/native';
import {HeaderComponent} from '../../components/HeaderComponent';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders, deleteAllOrdersLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  var ordersData = Object.assign([], orders);
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

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
    //dispatch(syncZupaProducts());
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

  const handleSearch = () => {
    setIsSearchClicked(!isSearchClicked);
    handleCancelSearch();
  };

  const handleSearchChange = text => {
    if (text) {
      orders.sort((a, b) => {
        if (b.name > a.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
      });
      const newData = orders?.filter(item => {
        const itemData = item?.customer?.name
          ? item?.customer?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredOrdersData(newData);
      setSearchInputValue(text);
    } else {
      setFilteredOrdersData(orders);
      setSearchInputValue(text);
    }
  };

  const handleCancelSearch = () => {
    setSearchInputValue('');
    setIsSearchCleared(true);
  };

  return (
    <ViewProviderComponent>
      <HeaderComponent
        name="Orders"
        isDashboard
        performDelete={handleDeleteOrders}
        performSearch={handleSearch}
        shouldDisplayIcon={orders.length > 0}
      />
      {isSearchClicked ? (
        <SearchInputComponent
          shouldDisplaySearchView
          searchPlaceholder={'Search by customer name'}
          searchChange={handleSearchChange}
          inputValue={searchInputValue}
          cancelPress={handleCancelSearch}
        />
      ) : null}
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
        data={searchInputValue.length > 0 ? filteredOrdersData : orders}
        renderItem={renderItems}
        keyExtractor={item => item?.id}
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
                  top: Platform.OS == 'ios' ? 300 : 0,
                  marginTop: Platform.OS == 'android' ? 300 : 0,
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
