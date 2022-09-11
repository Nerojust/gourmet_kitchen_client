//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {BackViewSurplus} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';

import Clipboard from '@react-native-clipboard/clipboard';

import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  DismissKeyboard,
  sortArrayByDate,
  groupBy,
  sortArrayData,
  sortArrayByDateDesc,
} from '../../utils/utils';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import ProductSans from '../../components/Text/ProductSans';
import {useSelector, useDispatch} from 'react-redux';
import {
  clearSurplusData,
  getAllSurplus,
  getAllSurplusProducts,
  updateSurplusProductData,
} from '../../store/actions/surplus';
import SearchInputComponent from '../../components/SearchInputComponent';
import {getDateWithoutTime} from '../../utils/DateFilter';
import {saveOrderDate} from '../../store/actions/orders';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import SurplusProductItemComponent from '../../components/SurplusProductItemComponent';
import {LIMIT_FIGURE} from '../../utils/Constants';
import SliderAnalyticsComponent from '../../components/SliderAnalyticsComponent';
var _ = require('lodash');
// create a component
const StoreSalesScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    surplus,
    surplusProducts,
    activeSurplusProducts,
    inactiveSurplusProducts,
    totalCount,
    surplusLoading,
  } = useSelector(x => x.surplus);
  //console.log('totalCount redux', totalCount);
  // console.log('surplus pdts redux', surplusProducts.length);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  var surplusData = Object.assign([], surplus);
  const [filteredSurplusData, setFilteredSurplusData] = useState(surplusData);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState('');
  //console.log('redux surplus', surplus);
  const dispatch = useDispatch();
  const [isSearchCleared, setIsSearchCleared] = useState(false);

  const [isTabClicked, setIsTabClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [offset, setOffset] = useState(0);
  let dataproducts;
  const [status, setStatus] = useState('all');

  useEffect(() => {
    // if (selectedOrderDate) {
    fetchAllData();
    //}
  }, [selectedOrderDate, offset, selectedTab]);

  const fetchAllData = () => {
    if (selectedTab == 0) {
      getAllTheSurplusProducts();
    } else if (selectedTab == 1) {
      getOnlyActiveSurplusProducts();
    } else if (selectedTab == 2) {
      getOnlyInActiveSurplusProducts();
    }
  };
  const getAllTheSurplusProducts = () => {
    // dispatch(clearSurplusData());
    dispatch(
      getAllSurplusProducts(
        getDateWithoutTime(selectedOrderDate),
        LIMIT_FIGURE,
        offset,
        status,
      ),
    );
  };
  const getOnlyActiveSurplusProducts = () => {
    // dispatch(clearSurplusData());
    dispatch(
      getAllSurplusProducts(
        getDateWithoutTime(selectedOrderDate),
        LIMIT_FIGURE,
        offset,
        status,
      ),
    );
  };
  const getOnlyInActiveSurplusProducts = () => {
    // dispatch(clearSurplusData());
    dispatch(
      getAllSurplusProducts(
        getDateWithoutTime(selectedOrderDate),
        LIMIT_FIGURE,
        offset,
        status,
      ),
    );
  };
  const displaySurplusProductsListView = () => {
    dataproducts = groupBy(
      status == 'all'
        ? surplusProducts
        : status == 'active'
        ? sortArrayByDateDesc(activeSurplusProducts)
        : status == 'inactive'
        ? sortArrayData(inactiveSurplusProducts, 'name')
        : null,
      'name',
    );
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        removeClippedSubviews={true} // Unmount components when outside of window
      >
        {Object.entries(dataproducts ? dataproducts : {}).length > 0 ? (
          Object.entries(dataproducts ? dataproducts : {}).map(
            ([key, value], i) => {
              //console.log(`${key} ${value}`);
              // console.log('iii', i);
              return (
                <View key={key + i}>
                  <SurplusProductItemComponent
                    indexKey={i}
                    keyItem={key}
                    keyValue={value}
                    onClick={handleClick}
                  />
                </View>
              );
            },
          )
        ) : (
          <View>
            {!surplusLoading ? (
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
        )}
      </ScrollView>
    );
  };

  const handleClick = item => {
    setOffset(0);
    navigation.navigate('UpdateSizeSale', {
      surplusData: item,
      date: getDateWithoutTime(selectedOrderDate),
      offset: 0,
      tab: selectedTab,
    });
  };

  const handlePage = () => {
    //console.log('offset before ', offset);
    setOffset(offset + LIMIT_FIGURE);
    //console.log('offset after ', offset);
  };
  const displayLoadMoreButton = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePage}
          //On Click of button calling getData function to load more data
          style={styles.loadMoreBtn}>
          {surplusLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 0}} />
          ) : (
            <Text style={styles.btnText}>Load more</Text>
          )}
        </TouchableOpacity>
      </View>
    );
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
          //set offset back to zero
          setOffset(0);
          setSelectedOrderDate(date);
          dispatch(saveOrderDate(getDateWithoutTime(date)));
          //clear the redux array
          dispatch(clearSurplusData());
          // console.log('offset after date is ', offset);
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

  const onRefresh = () => {
    dispatch(clearSurplusData());
    dispatch(
      getAllSurplusProducts(
        getDateWithoutTime(selectedOrderDate),
        LIMIT_FIGURE,
        0,
        status,
      ),
    );
  };

  const handleSearch = () => {
    setIsSearchClicked(!isSearchClicked);
    handleCancelSearch();
  };

  const handleSearchChange = text => {
    if (text) {
      sortArrayByDate(surplus, 'productname').sort((a, b) => {
        // console.log('dddd', a);
        if (b.productname > a.productname) return -1;
        if (b.productname < a.productname) return 1;
        return 0;
      });
      const newData = sortArrayByDate(surplus, 'productname')?.filter(item => {
        const itemData = item?.productname
          ? item?.productname.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredSurplusData(newData);
      setSearchInputValue(text);
    } else {
      setFilteredSurplusData(surplus);
      setSearchInputValue(text);
    }
  };

  const handleCancelSearch = () => {
    setSearchInputValue('');
    setIsSearchCleared(true);
  };

  const handleDeleteOrders = () => {
    //console.log('delete clicked');

    Alert.alert(
      'Alert',
      'Do you want to delete all surplus records?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          //onPress: () => dispatch(deleteAllOrders()),
        },
      ],
      {cancelable: true},
    );
  };

  const handleCopyClick = item => {
    var stringData = 'Available Bread List \n';

    let dataproducts = groupBy(surplus, 'productsize');
    // console.log('finalllll array', dataproducts);

    Object.keys(dataproducts).forEach((parentKey, i) => {
      //console.log('iii', parentKey);
      stringData =
        stringData +
        '\n' +
        parentKey +
        '\n------------------------------------------------------\n';
      dataproducts[parentKey].forEach((singlePdt, ii) => {
        //console.log(`${singlePdt} ${ii}`);
        if (singlePdt) {
          //console.log('pdt', item.productname, 'size', item.productsize);
          stringData =
            stringData +
            singlePdt.productname.trim() +
            ' | ' +
            singlePdt.count +
            (singlePdt?.count > 1 ? ' pcs' : ' pc') +
            '\n';
        }
      });
      stringData =
        stringData + '------------------------------------------------------\n';
    });

    Clipboard.setString(stringData);
    alert('Surplus copied to clipboard');
  };
  const handleAllTab = () => {
    //console.log('Tab 1');
    dispatch(clearSurplusData());
    setOffset(0);
    selectTab(0);
    setStatus('all');
  };
  const handleActiveTab = () => {
    //console.log('Tab 2');
    dispatch(clearSurplusData());
    setOffset(0);
    selectTab(1);
    setStatus('active');
  };
  const handleInActiveTab = () => {
    //console.log('Tab 3');
    dispatch(clearSurplusData());
    setOffset(0);
    selectTab(2);
    setStatus('inactive');
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
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewSurplus
            backText={'Store Sales: ' + moment(selectedOrderDate).format('LL')}
            onClose={() => navigation.goBack()}
            shouldDisplayIcon={surplusProducts && surplusProducts.length > 0}
            shouldDisplaySettingIcon
            performSearch={handleSearch}
            shouldDisplayBackArrow={true}
            displayCalendar
            handleClick={handleCopyClick}
            toggleDateModal={toggleDateModal}
            displayDelete={false}
            performDelete={handleDeleteOrders}
          />

          {isSearchClicked ? (
            <SearchInputComponent
              shouldDisplaySearchView
              searchPlaceholder={'Search by product name'}
              searchChange={handleSearchChange}
              inputValue={searchInputValue}
              cancelPress={handleCancelSearch}
            />
          ) : null}

          <SliderAnalyticsComponent
            isTabClicked={isTabClicked}
            name1={'All'}
            name2={'Active'}
            name3={'Inactive'}
            selectedTab={selectedTab}
            onPress1={handleAllTab}
            onPress2={handleActiveTab}
            onPress3={handleInActiveTab}
          />

          {renderDatePicker()}
          {!surplusLoading ? (
            <>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingRight: 20,
                }}>
                <ProductSans
                  style={{fontSize: 12, color: COLOURS.labelTextColor}}>
                  Total count:
                  {searchInputValue.length > 0
                    ? filteredSurplusData.length
                    : Object.entries(
                        groupBy(
                          status == 'all'
                            ? surplusProducts
                            : status == 'active'
                            ? activeSurplusProducts
                            : status == 'inactive'
                            ? inactiveSurplusProducts
                            : null,
                          'name',
                        ),
                      ).length}
                </ProductSans>
              </View>

              {displaySurplusProductsListView()}

              {totalCount != surplusProducts.length && selectedTab == 0
                ? displayLoadMoreButton()
                : null}
            </>
          ) : null}

          <LoaderShimmerComponent isLoading={surplusLoading} />
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
  footer: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: COLOURS.zupaBlue,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});

//make this component available to the app
export default StoreSalesScreen;
