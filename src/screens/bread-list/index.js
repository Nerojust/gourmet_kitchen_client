//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  DismissKeyboard,
  sortArrayByDate,
  sortArrayByName,
  sortArrayData,
} from '../../utils/utils';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import BreadListItemComponent from '../../components/BreadListItemComponent';
import SearchInputComponent from '../../components/SearchInputComponent';
import ProductSans from '../../components/Text/ProductSans';
import {fp} from '../../utils/responsive-screen';
import {getAllOrderedProductsStats, saveOrderDate} from '../../store/actions/orders';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {orderedProducts, ordersLoading,orderDate} = useSelector(x => x.orders);
  // console.log('pending bread list', orderedProducts.length);
  var orderProductsData = Object.assign([], orderedProducts);
  const [filteredOrdersData, setFilteredOrdersData] =
    useState(orderProductsData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());

  //console.log('products', orderedProducts);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchAllData();
  //   });
  //   fetchAllData();
  //   return unsubscribe;
  // }, [navigation]);
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    dispatch(getAllOrderedProductsStats());
  };
  const handleClick = item => {
    console.log('item', item);
    navigation.navigate('BreadListDetails', {
      bread: item,
    });
  };
  const renderDetails = ({item}) => (
    <BreadListItemComponent item={item} onClick={handleClick} />
  );

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const openSettingsMenu = item => {
    // console.log("clicked is ", item);
    if (item == 'manageSets') {
      navigation.navigate('SetList');
    }
  };
  const handleSearch = () => {
    setIsSearchClicked(!isSearchClicked);
    handleCancelSearch();
  };
  const handleSearchChange = text => {
    if (text) {
      sortArrayByDate(orderedProducts, 'name').sort((a, b) => {
        // console.log('dddd', a);
        if (b.name > a.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
      });
      const newData = sortArrayByDate(orderedProducts, 'name')?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredOrdersData(newData);
      setSearchInputValue(text);
    } else {
      setFilteredOrdersData(orderedProducts);
      setSearchInputValue(text);
    }
  };
  const toggleDateModal = () => {
    //console.log('opened');
    setOpen(!open);
  };
  const handleCancelSearch = () => {
    setSearchInputValue('');
    setIsSearchCleared(true);
  };
  const renderDatePicker = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        title={'Select order date range'}
        theme={'auto'}
        date={selectedOrderDate || new Date()}
        //minimumDate={subtractOneDayFromTime(new Date(), 1)}
        onConfirm={date => {
          console.log('date result', date);
          setOpen(false);
          setSelectedOrderDate(date);
          //dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          setSelectedOrderDate('');
        }}
      />
    );
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText={
              'Bread List for ' +
              moment(orderDate ? orderDate : selectedOrderDate).format('LL')
            }
            onClose={() => navigation.goBack()}
            toggleDateModal={toggleDateModal}
            shouldDisplaySettingIcon
            displayCalendar
            shouldDisplayBackArrow={true}
            performSearch={handleSearch}
            breadStyle={{flex: 0.4}}
            shouldDisplayIcon={orderedProducts.length > 0}
            handleClick={openSettingsMenu}
            performRefresh={() => fetchAllData()}
          />
          {isSearchClicked ? (
            <SearchInputComponent
              shouldDisplaySearchView
              searchPlaceholder={'Search by bread name'}
              searchChange={handleSearchChange}
              inputValue={searchInputValue}
              cancelPress={handleCancelSearch}
            />
          ) : null}
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
                : sortArrayByDate(orderedProducts, 'name').length}
            </ProductSans>
          </View>
          <FlatList
            // data={sortArrayData(orderedProducts, 'name')}
            data={
              searchInputValue.length > 0
                ? filteredOrdersData
                : sortArrayByDate(orderedProducts, 'name')
            }
            keyboardShouldPersistTaps={'handled'}
            renderItem={renderDetails}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            keyExtractor={item => Math.random()}
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

          <LoaderShimmerComponent isLoading={ordersLoading} />
        </KeyboardObserverComponent>
      </DismissKeyboard>
    </ViewProviderComponent>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.zupa_gray_bg,
  },
  pendingBreadListText: {
    color: COLOURS.labelTextColor,
    fontSize: fp(17),
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingTop: 20,
  },
});

//make this component available to the app
export default BreadListScreen;
