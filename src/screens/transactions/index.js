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
  saveOrderDate,
  setOrderStatus,
  updateCompleteStatusForOrder,
} from '../../store/actions/orders';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import dateFormat, {masks} from 'dateformat';
import {getAllProducts, syncZupaProducts} from '../../store/actions/products';
import SearchInputComponent from '../../components/SearchInputComponent';
import SliderTabComponent from '../../components/SliderTabComponent';
import {useIsFocused} from '@react-navigation/native';
import {HeaderComponent} from '../../components/HeaderComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getDateWithoutTime,
  subtractOneDayFromTime,
} from '../../utils/DateFilter';
import moment from 'moment';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';
import {getKudaTransactionHistory} from '../../store/actions/kuda';
import kuda from '../../store/reducers/kuda';
import TransactionListComponent from '../../components/TransactionListComponent';
import {addOrSubractDays} from '../../utils/utils';

// create a component
const TransactionsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {kudaArray, kudaLoading} = useSelector(state => state.kuda);
  //console.log('order date is ', orderDate);
  var kudaData = Object.assign([], kudaArray);
  const [filteredKudaData, setFilteredKudaData] = useState(kudaData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const {loginError, accessToken, user} = useSelector(x => x.users);
  //console.log("token is redux",accessToken)

  useEffect(() => {
    fetchAllData();
  }, [selectedOrderDate]);

  const fetchAllData = () => {
    dispatch(
      getKudaTransactionHistory(
        getDateWithoutTime(selectedOrderDate),
        user?.roleid,
      ),
    );
  };

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const handleClick = item => {
    //console.log("order item",item)
    // navigation.navigate('OrderDetails', {
    //   id: item.id,
    //   orderDate: getDateWithoutTime(selectedOrderDate),
    // });
  };

  const renderItems = ({item, index}) => {
    return (
      <TransactionListComponent
        item={item}
        handleClick={handleClick}
        index={index}
      />
    );
  };

  const handleSearch = () => {
    setIsSearchClicked(!isSearchClicked);
    handleCancelSearch();
  };

  const handleSearchChange = text => {
    if (text) {
      if (isNaN) {
        kudaArray.sort((a, b) => {
          if (b.senderName > a.senderName) return -1;
          if (b.senderName < a.senderName) return 1;
          return 0;
        });
        const newData = kudaArray?.filter(item => {
          const itemData = item?.senderName
            ? item?.senderName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredKudaData(newData);
        setSearchInputValue(text);
      } else {
        //its a digit
        kudaArray.sort((a, b) => {
          if (b.amount > a.amount) return -1;
          if (b.amount < a.amount) return 1;
          return 0;
        });
        const newData = kudaArray?.filter(item => {
          const itemData = item?.amount
            ? item?.senderName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredKudaData(newData);
        setSearchInputValue(text);
      }
    } else {
      setFilteredKudaData(kudaArray);
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

  const renderDatePickerNoLimit = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        title={'Select transaction range'}
        theme={'auto'}
        date={selectedOrderDate || new Date()}
        //minimumDate={addOrSubractDays(new Date(), 2, false)}
        //maximumDate={new Date()}
        onConfirm={date => {
          console.log('date result', date);
          setOpen(false);
          setSelectedOrderDate(date);
          dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          //setSelectedOrderDate('');
        }}
      />
    );
  };

  const renderDatePickerLimit = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        title={'Select transaction range'}
        theme={'auto'}
        date={selectedOrderDate || new Date()}
        minimumDate={addOrSubractDays(new Date(), 2, false)}
        maximumDate={new Date()}
        onConfirm={date => {
          console.log('date result', date);
          setOpen(false);
          setSelectedOrderDate(date);
          dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          //setSelectedOrderDate('');
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
        name={'Transactions  ' + moment(selectedOrderDate).format('LL')}
        isDashboard
        displayCalendar
        shouldDisplaySettingIcon={false}
        //handleSettingsClick={handleSettingsClick}
        toggleDateModal={toggleDateModal}
        performSearch={handleSearch}
        shouldDisplayIcon={kudaArray.length > 0}
        performRefresh={refreshData}
      />
      {isSearchClicked ? (
        <SearchInputComponent
          shouldDisplaySearchView
          searchPlaceholder={'Search by sender name'}
          searchChange={handleSearchChange}
          inputValue={searchInputValue}
          cancelPress={handleCancelSearch}
        />
      ) : null}

      {user.roleid == 1 || user.roleid == 2
        ? renderDatePickerNoLimit()
        : renderDatePickerLimit()}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 20,
        }}>
        <ProductSans style={{fontSize: 12, color: COLOURS.labelTextColor}}>
          Total count:
          {searchInputValue.length > 0
            ? filteredKudaData.length
            : kudaArray.length}
        </ProductSans>
      </View>
      <FlatList
        data={searchInputValue.length > 0 ? filteredKudaData : kudaArray}
        renderItem={renderItems}
        keyExtractor={item => item?.referenceNumber}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View>
            {!kudaLoading ? (
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

      <LoaderShimmerComponent isLoading={kudaLoading} />
    </ViewProviderComponent>
  );
};

//make this component available to the app
export default TransactionsScreen;
