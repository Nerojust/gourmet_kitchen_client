//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
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
  getProcessingTimeString,
  removeBrackets,
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
import {fp, wp} from '../../utils/responsive-screen';
import {
  getAllAnalytics,
  getAllSalesAverage,
  getSalesAnalytics,
  saveOrderDate,
} from '../../store/actions/orders';
import AnalyticsItemComponent from '../../components/AnalyticsItemComponent';
import RiderAnalyticsItemComponent from '../../components/RiderAnalyticsItemComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {getDateWithoutTime} from '../../utils/DateFilter';
import SliderTabComponent from '../../components/SliderTabComponent';
import {getRiderAnalytics} from '../../store/actions/dispatch';
import SalesAverageComponent from '../../components/SalesAverageComponent';
import ProductSansBold from '../../components/Text/ProductSansBold';
import AvertaBold from '../../components/Text/AvertaBold';
import SliderAnalyticsComponent from '../../components/SliderAnalyticsComponent';

// create a component
const AnalyticsScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {analytics, analyticsLoading} = useSelector(state => state.orders);
  const {dispatchAnalytics, dispatchLoading} = useSelector(
    state => state.dispatch,
  );
  //console.log('analytics redux', analytics);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  var analyticsData = Object.assign([], analytics);
  const [filteredAnalyticsData, setFilteredAnalyticsData] =
    useState(analyticsData);
  const [searchInputValue, setSearchInputValue] = useState('');
  //console.log('redux surplus', surplus);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const dispatch = useDispatch();
  const {
    orders,
    deleteAllOrdersLoading,
    error,
    ordersLoading,
    updateOrderLoading,
    orderDate,
    salesAverage,
    getSalesLoading,
  } = useSelector(state => state.orders);
  //console.log('average', salesAverage);
  const [open, setOpen] = useState(false);
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());

  useEffect(() => {
    fetchAllData();
  }, [selectedOrderDate, selectedTab]);

  const getAverageData = () => {
    dispatch(getAllSalesAverage(getDateWithoutTime(selectedOrderDate)));
  };

  const getRiderData = () => {
    dispatch(getRiderAnalytics(getDateWithoutTime(selectedOrderDate)));
  };

  const getAllSalesData = () => {
    dispatch(getSalesAnalytics(getDateWithoutTime(selectedOrderDate)));
  };

  const fetchAllData = () => {
    if (selectedTab == 0) {
      getAverageData();
    } else if (selectedTab == 1) {
      getAllSalesData();
    } else if (selectedTab == 2) {
      getRiderData();
    }
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

  const renderRiderItems = ({item, index}) => {
    if (item?.name != null && item?.name != 'null') {
      return (
        <RiderAnalyticsItemComponent item={item} handleClick={handleClick} />
      );
    }
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
          //setSelectedOrderDate('');
        }}
      />
    );
  };

  const toggleDateModal = () => {
    //console.log('opened');
    setOpen(!open);
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

  const handleSalesTab = () => {
    //console.log('Tab 1');
    selectTab(0);
  };
  const handleOrdersTab = () => {
    //console.log('Tab 2');
    selectTab(1);
  };
  const handleDispatchTab = () => {
    //console.log('Tab 3');
    selectTab(2);
  };

  const displayRiderAnalyticsView = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 20,
          }}>
          <ProductSans style={{fontSize: 12, color: COLOURS.labelTextColor}}>
            Total count:
            {dispatchAnalytics.length}
          </ProductSans>
        </View>
        <FlatList
          data={dispatchAnalytics}
          renderItem={renderRiderItems}
          keyExtractor={item => item?.id}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View>
              {!dispatchLoading ? (
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
      </>
    );
  };
  const displayAverageOrdersView = () => {
    return (
      <>
        {salesAverage.length > 0 ? (
          <>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                TOTAL COMPLETED ORDERS
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold
                  style={[
                    styles.custName,
                    {color: COLOURS.green2, fontSize: fp(16)},
                  ]}>
                  {salesAverage
                    ? removeBrackets(salesAverage[0]?.completed_count)
                    : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                TOTAL PENDING ORDERS
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold
                  style={[
                    styles.custName,
                    {color: COLOURS.blue, fontSize: fp(16)},
                  ]}>
                  {salesAverage
                    ? removeBrackets(salesAverage[0]?.pending_count)
                    : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                TOTAL INCOMPLETE ORDERS
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold
                  style={[
                    styles.custName,
                    {color: COLOURS.red, fontSize: fp(16)},
                  ]}>
                  {salesAverage
                    ? removeBrackets(salesAverage[0]?.incomplete_count)
                    : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>

            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                AVERAGE PROCESSING TIME
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold
                  style={[
                    styles.custName,
                    {fontSize: fp(16), color: COLOURS.yellow1},
                  ]}>
                  {salesAverage[0].avg_time
                    ? getProcessingTimeString(salesAverage[0]?.avg_time)
                    : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                TOTAL AVERAGE PROCESSING TIME
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold
                  style={[
                    styles.custName,
                    {fontSize: fp(16), color: COLOURS.text_color},
                  ]}>
                  {salesAverage[0]?.total_average
                    ? getProcessingTimeString(salesAverage[0]?.total_average)
                    : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              //top: Platform.OS == 'ios' ? 300 : 0,
              // marginTop: Platform.OS == 'android' ? 300 : 0,
            }}>
            <ProductSans style={{fontSize: 16, color: COLOURS.textInputColor}}>
              No record found
            </ProductSans>
          </View>
        )}
      </>
    );
  };
  const displaySalesView = () => {
    return (
      <>
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
          data={searchInputValue.length > 0 ? filteredAnalyticsData : analytics}
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
      </>
    );
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewWithLogout
            backText={'Analytics: ' + moment(selectedOrderDate).format('LL')}
            shouldDisplayLogoutIcon
            navigation={navigation}
            displayCalendar
            toggleDateModal={toggleDateModal}
            handleLogout={showDialog}
            onClose={() => navigation.goBack()}
          />
          <SliderAnalyticsComponent
            isTabClicked={isTabClicked}
            name1={'Orders'}
            name2={'Sales'}
            name3={'Dispatch'}
            selectedTab={selectedTab}
            onPress1={handleSalesTab}
            onPress2={handleOrdersTab}
            onPress3={handleDispatchTab}
          />
          {renderDatePicker()}

          {selectedTab == 0 ? displayAverageOrdersView() : null}
          {selectedTab == 1 ? displaySalesView() : null}
          {selectedTab == 2 ? displayRiderAnalyticsView() : null}

          <LoaderShimmerComponent isLoading={getSalesLoading} />
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
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  customerNameView: {
    //width: deviceWidth - 50,
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

//make this component available to the app
export default AnalyticsScreen;
