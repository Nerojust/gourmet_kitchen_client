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
import DatePicker from 'react-native-date-picker';
import {
  deleteAllOrders,
  getAllOrderedProducts,
  setOrderStatus,
  updateCompleteStatusForOrder,
} from '../../store/actions/orders';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import {getAllProducts, syncZupaProducts} from '../../store/actions/products';
import SearchInputComponent from '../../components/SearchInputComponent';
import SliderTabComponent from '../../components/SliderTabComponent';
import {useIsFocused} from '@react-navigation/native';
import {HeaderComponent} from '../../components/HeaderComponent';
import AsyncStorage from '@react-native-community/async-storage';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    orders,
    deleteAllOrdersLoading,
    error,
    ordersLoading,
    updateOrderLoading,
  } = useSelector(state => state.orders);
  var ordersData = Object.assign([], orders);
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState();
  const [open, setOpen] = useState(false);

  const {loginError, accessToken} = useSelector(x => x.users);
  //console.log("token is redux",accessToken)

  useEffect(() => {
    getAllKeys = async () => {
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
      } catch (e) {
        // read key error
      }

      console.log('All storage keys', keys);
    };
    getAllKeys();



    var date1 = new Date('December 25, 2017 01:30:00');
    var date2 = new Date('June 18, 2016 02:30:00');
    
    //best to use .getTime() to compare dates
    if(date1.getTime() === date2.getTime()){
        //same date
        console.log("same date")
    }
    
    if(date1.getTime() > date2.getTime()){
        //date 1 is newer
        console.log("date 1 is newer")
    }

  }, []);

  useEffect(() => {
    dispatch(getAllOrderedProducts(statusState));
  }, [navigation, statusState, selectedTab]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchAllData(statusState);
  //   });

  //   dispatch(getAllOrderedProducts(statusState));
  //   return unsubscribe;
  // }, [navigation, statusState, selectedTab]);

  const fetchAllData = () => {
    dispatch(getAllOrderedProducts(statusState));
    dispatch(getAllProducts('', 0, 0, null));
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
  const refreshData = () => {
    fetchAllData();
  };

  const handleSettingsClick = item => {
    console.log('clicked item', item);
    if (item == 'delete') {
      handleDeleteOrders();
    }
  };
  const renderDatePicker = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        date={selectedOrderDate||new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          console.log('date result', date);
          setOpen(false);
          setSelectedOrderDate(date);
        }}
        onCancel={() => {
          setOpen(false);
          setSelectedOrderDate("");
        }}
      />
    );
  };

  const toggleDateModal = () => {
    //console.log('opened');
    setOpen(!open);
  };


  return (
    <ViewProviderComponent>
      <HeaderComponent
        name="Orders"
        isDashboard
        displayCalendar
        shouldDisplaySettingIcon
        handleSettingsClick={handleSettingsClick}
        toggleDateModal={toggleDateModal}
        performSearch={handleSearch}
        shouldDisplayIcon={orders.length > 0}
        performRefresh={refreshData}
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
        {renderDatePicker()}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 20,
        }}>
        <ProductSans style={{fontSize: 12, color: COLOURS.labelTextColor}}>
          Total count:
          {searchInputValue.length > 0
            ? filteredOrdersData.length
            : orders.length}
        </ProductSans>
      </View>
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
