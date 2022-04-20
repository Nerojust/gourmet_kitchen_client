//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {
  BackViewMoreSettings,
  BackViewWithLogout,
} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  DismissKeyboard,
  sortArrayByDate,
  sortArrayByDateDesc,
} from '../../utils/utils';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import ProductSans from '../../components/Text/ProductSans';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSurplus} from '../../store/actions/surplus';
import SurplusListItemComponent from '../../components/SurplusListItemComponent';
import SearchInputComponent from '../../components/SearchInputComponent';
import {logoutUser} from '../../store/actions/users';
import {wp} from '../../utils/responsive-screen';
import {getAllAnalytics, saveOrderDate} from '../../store/actions/orders';
import AnalyticsItemComponent from '../../components/AnalyticsItemComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {getDateWithoutTime} from '../../utils/DateFilter';

// create a component
const AnalyticsScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {analytics, analyticsLoading} = useSelector(state => state.orders);
  //console.log('analytics redux', analytics);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  var analyticsData = Object.assign([], analytics);
  const [filteredAnalyticsData, setFilteredAnalyticsData] =
    useState(analyticsData);
  const [searchInputValue, setSearchInputValue] = useState('');
  //console.log('redux surplus', surplus);
  const dispatch = useDispatch();
  const {
    orders,
    deleteAllOrdersLoading,
    error,
    ordersLoading,
    updateOrderLoading,
    orderDate,
  } = useSelector(state => state.orders);
  const [open, setOpen] = useState(false);
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());

  useEffect(() => {
    fetchAllData();
  }, [selectedOrderDate]);

  const fetchAllData = () => {
    dispatch(getAllAnalytics(getDateWithoutTime(orderDate)));
  };

  const showDialog = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'destructive',
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ],
      {cancelable: false},
    );
  };
  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };
  const handleClick = item => {
    //console.log('clicked', item);
  };

  const renderItems = ({item, index}) => {
    return <AnalyticsItemComponent item={item} handleClick={handleClick} />;
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
          dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          setSelectedOrderDate('');
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
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewWithLogout
            backText={
              'Analytics for ' +
              moment(orderDate ? orderDate : selectedOrderDate).format('LL')
            }
            shouldDisplayLogoutIcon
            navigation={navigation}
            displayCalendar
            toggleDateModal={toggleDateModal}
            handleLogout={showDialog}
            onClose={() => navigation.goBack()}
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
                ? filteredAnalyticsData.length
                : analytics.length}
            </ProductSans>
          </View>
          <FlatList
            data={
              searchInputValue.length > 0 ? filteredAnalyticsData : analytics
            }
            renderItem={renderItems}
            keyExtractor={item => item?.createdbyuserid}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View>
                {!analyticsLoading ? (
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
          <LoaderShimmerComponent isLoading={analyticsLoading} />
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
});

//make this component available to the app
export default AnalyticsScreen;
