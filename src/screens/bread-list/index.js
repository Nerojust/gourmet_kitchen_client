//import liraries
import React, {Component, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {BackViewHeader, BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  dismissBottomSheetDialog,
  DismissKeyboard,
  groupBy,
  showBottomSheet,
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
import {deviceHeight, deviceWidth, fp} from '../../utils/responsive-screen';
import {
  getAllOrderedProductsStats,
  saveOrderDate,
} from '../../store/actions/orders';

import Modal from 'react-native-modal';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';
import {getDateWithoutTime} from '../../utils/DateFilter';
import _, {filter, result, set} from 'lodash';
import BreadListItemComponent1 from '../../components/BreadListItemComponent1';
import {BottomSheetBreadSizeComponent} from '../../components/BottomSheetComponent';
import {getAllSets} from '../../store/actions/sets';
import SliderAnalyticsComponent from '../../components/SliderAnalyticsComponent';

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {orderedProducts, ordersLoading, orderDate} = useSelector(
    x => x.orders,
  );
  //console.log('pending bread list', orderedProducts);
  var orderProductsData = Object.assign([], orderedProducts);
  const [filteredOrdersData, setFilteredOrdersData] =
    useState(orderProductsData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [finalObjectArray, setFinalObjectArray] = useState({});
  const [finalMiniArray, setFinalMiniArray] = useState({});
  const [finalFullLoavesArray, setFinalFullLoavesArray] = useState({});
  const [filteredObjectArray, setFilteredObjectArray] = useState({});
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  var tempObj = {};
  let setArray = [];
  const {createSetsLoading, sets, setsLoading} = useSelector(x => x.sets);
  //console.log('sets', sets);
  const [isModalVisible, setIsModalVisible] = useState(false);
  //console.log('products', orderedProducts);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [keysBreadArray, setKeysBreadArray] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const breadRef = useRef();
  let finalArrayData = [];
  const [fullLoavesArray, setFullLoavesArray] = useState([]);
  const [miniArray, setMiniArray] = useState([]);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchAllData();
  //   });
  //   fetchAllData();
  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    fetchAllData();
  }, [selectedOrderDate, selectedTab]);

  const fetchAllData = () => {
    if (selectedTab == 0) {
      getAllLoavesData();
    } else if (selectedTab == 1) {
      getFullLoavesData();
    } else if (selectedTab == 2) {
      getMinisData();
    }
  };
  // useEffect(() => {
  //   let arraydata = [];
  //   let filteredResult = orderProductsData.map(element => {
  //     if (
  //       !element.productsize.toLowerCase().includes('mini')
  //       ) {
  //       console.log("eee",element.productsize)
  //       arraydata.push(element);
  //     }
  //   });
  //   console.log('filtered', arraydata.length);
  // }, [orderProductsData]);

  const getAllLoavesData = () => {
    setHasLoaded(false);
    dispatch(getAllSets()).then(setResult => {
      if (setResult) {
        dispatch(
          getAllOrderedProductsStats(getDateWithoutTime(selectedOrderDate)),
        ).then((result, i) => {
          if (result) {
            //console.log("result ",result)

            setResult.forEach((oneSet, iset) => {
              result.map((singleItem, i) => {
                if (
                  oneSet.zupasetid.trim() == singleItem?.productid.trim()
                  //singleItem.name.toLowerCase().includes('supreme')
                ) {
                  // console.log('set ' + iset, oneSet.zupasetname);
                  setArray.push(singleItem);
                }
              });
            }),
              // console.log('sets arryay', setArray);
              setArray.map((item, i) => {
                if (item) {
                  //console.log('item', item);
                  setResult.map((oneSet, i) => {
                    if (oneSet) {
                      if (item.productid == oneSet.zupasetid) {
                        // console.log('one set', oneSet);
                        let obj = {};
                        obj = item;
                        obj.set = oneSet;
                        //console.log('obj', obj);
                        finalArrayData.push(obj);
                      }
                    }
                  });
                }
              });

            var difference = _.difference(result, setResult);
            //console.log(difference);

            //console.log("final",finalArrayData)
            setHasLoaded(true);
            handleAllLoavesStructure(difference);
          }
        });
      }
    });
  };

  const getFullLoavesData = () => {
    dispatch(getAllSets()).then(setResult => {
      setHasLoaded(false);
      if (setResult) {
        dispatch(
          getAllOrderedProductsStats(getDateWithoutTime(selectedOrderDate)),
        ).then((result, i) => {
          if (result) {
            //console.log("result ",result)
            let filteredResult = result.filter(
              element => !element.productsize.toLowerCase().includes('mini'),
            );

            setFullLoavesArray(filteredResult);

            setResult.forEach((oneSet, iset) => {
              filteredResult.map((singleItem, i) => {
                if (
                  oneSet.zupasetid.trim() == singleItem?.productid.trim()
                  //singleItem.name.toLowerCase().includes('supreme')
                ) {
                  // console.log('set ' + iset, oneSet.zupasetname);
                  setArray.push(singleItem);
                }
              });
            }),
              // console.log('sets arryay', setArray);
              setArray.map((item, i) => {
                if (item) {
                  //console.log('item', item);
                  setResult.map((oneSet, i) => {
                    if (oneSet) {
                      if (item.productid == oneSet.zupasetid) {
                        // console.log('one set', oneSet);
                        let obj = {};
                        obj = item;
                        obj.set = oneSet;
                        //console.log('obj', obj);
                        finalArrayData.push(obj);
                      }
                    }
                  });
                }
              });

            var difference = _.difference(filteredResult, setResult);
            //console.log(difference);

            //console.log("final",finalArrayData)
            //handleAllLoavesStructure(difference);
            setHasLoaded(true);
            handleFullLoavesStructure(difference);
          }
        });
      }
    });
  };

  const getMinisData = () => {
    setHasLoaded(false);
    dispatch(getAllSets()).then(setResult => {
      if (setResult) {
        dispatch(
          getAllOrderedProductsStats(getDateWithoutTime(selectedOrderDate)),
        ).then((result, i) => {
          if (result) {
            //console.log("result ",result)
            let filteredResult = result.filter(element =>
              element.productsize.toLowerCase().includes('mini'),
            );
            console.log("filetered minis",filteredResult)
            setMiniArray(filteredResult);
            setResult.forEach((oneSet, iset) => {
              filteredResult.map((singleItem, i) => {
                if (
                  oneSet.zupasetid.trim() == singleItem?.productid.trim()
                ) {
                 console.log('set ' + iset, oneSet.zupasetname);
                  setArray.push(singleItem);
                }
              });
            }),
               //console.log('sets arryay', setArray);
              setArray.map((item, i) => {
                if (item) {
                  //console.log('item', item);
                  setResult.map((oneSet, i) => {
                    if (oneSet) {
                      if (item.productid == oneSet.zupasetid) {
                        // console.log('one set', oneSet);
                        let obj = {};
                        obj = item;
                        obj.set = oneSet;
                        //console.log('obj', obj);
                        finalArrayData.push(obj);
                      }
                    }
                  });
                }
              });

            var difference = _.difference(filteredResult, setResult);
            //console.log(difference);

            //console.log("final",finalArrayData)
            setHasLoaded(true);
            handleMinisStructure(difference);
          }
        });
      }
    });
  };

  const handleAllLoavesStructure = results => {
    //console.log('all loaves array size', results);
    if (results) {
      let dataproducts = groupBy(results, 'name');
      //console.log('result', dataproducts);
      if (dataproducts) {
        Object.keys(dataproducts).forEach((item, i) => {
          const data = {};
          dataproducts[item].forEach(element => {
            //console.log('one element', element);
            if (
              element.productsize === 'Mini < 4' ||
              element.productsize === 'Mini > 4'
            ) {
              // console.log('getting here', data['Mini'], element.sum);
              let sumValue;
              if (data['Mini']) {
                sumValue = parseInt(data['Mini'].sum) + parseInt(element.sum);

                data['Mini'].sum = sumValue;
              } else {
                data['Mini'] = element;
              }
            } else {
              //console.log('else block');
              data[element.productsize] = element;
            }
          });
          // console.log('res', data);
          tempObj[item] = data;
        });
        const sortedData = Object.fromEntries(
          Object.keys(tempObj)
            .sort()
            .map(key => [key, tempObj[key]]),
        );

        setFinalObjectArray(sortedData);
      }
    }
  };

  const handleFullLoavesStructure = results => {
    //console.log('full loaves array size', results);

    if (results) {
      let dataproducts = groupBy(results, 'name');
      //console.log('result', dataproducts);
      if (dataproducts) {
        Object.keys(dataproducts).forEach((item, i) => {
          // console.log("mini item",item)
          const data = {};
          dataproducts[item].forEach(element => {
            //console.log('one element', item, element);
            if (
              element.productsize === 'Mini < 4' ||
              element.productsize === 'Mini > 4'
            ) {
              // console.log('getting here', data['Mini'], element.sum);
              let sumValue;
              if (data['Mini']) {
                sumValue = parseInt(data['Mini'].sum) + parseInt(element.sum);

                data['Mini'].sum = sumValue;
              } else {
                data['Mini'] = element;
              }
            } else {
              //console.log('else block');
              data[element.productsize] = element;
            }
          });
          // console.log('res', data);
          tempObj[item] = data;
        });
        const sortedData = Object.fromEntries(
          Object.keys(tempObj)
            .sort()
            .map(key => [key, tempObj[key]]),
        );

        setFinalFullLoavesArray(sortedData);
      }
    }
  };

  const handleMinisStructure = results => {
    //  console.log('mini array size', results);
    if (results) {
      let dataproducts = groupBy(results, 'name');
      //console.log('result', dataproducts);
      if (dataproducts) {
        Object.keys(dataproducts).forEach((item, i) => {
          // console.log("mini item",item)
          const data = {};
          dataproducts[item].forEach(element => {
            //console.log('one element', item, element);
            if (
              element.productsize === 'Mini < 4' ||
              element.productsize === 'Mini > 4'
            ) {
              // console.log('getting here', data['Mini'], element.sum);
              let sumValue;
              if (data['Mini']) {
                sumValue = parseInt(data['Mini'].sum) + parseInt(element.sum);

                data['Mini'].sum = sumValue;
              } else {
                data['Mini'] = element;
              }
            } else {
              //console.log('else block');
              data[element.productsize] = element;
            }
          });
          // console.log('res', data);
          tempObj[item] = data;
        });
        const sortedData = Object.fromEntries(
          Object.keys(tempObj)
            .sort()
            .map(key => [key, tempObj[key]]),
        );

        setFinalMiniArray(sortedData);
      }
    }
  };

  const handleClick = item => {
     //console.log('clicked', item);
    Object.entries(item).map(([key, value]) => {
      //console.log('itemmmmm', value.name);
      setSelectedItemName(value?.name);
    });
    setSelectedItem(item);
    showBottomSheet(breadRef);
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
  //deliberately deactivated this
  const handleSearch = () => {
    // setIsSearchClicked(!isSearchClicked);
    // handleCancelSearch();
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
          dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          //setSelectedOrderDate('');
        }}
      />
    );
  };

  const displayAllBreadListView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        {Object.entries(finalObjectArray).length > 0 ? (
          Object.entries(finalObjectArray).map(([key, value], i) => {
            // console.log(`${key} ${value}`);
            // console.log('iii', i);
            return (
              <View key={key + i}>
                <BreadListItemComponent1
                  indexKey={i}
                  keyItem={key}
                  keyValue={value}
                  onClick={handleClick}
                />
              </View>
            );
          })
        ) : (
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
        )}
      </ScrollView>
    );
  };

  const displayFullLoavesView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        {Object.entries(finalFullLoavesArray).length > 0 ? (
          Object.entries(finalFullLoavesArray).map(([key, value], i) => {
            // console.log(`${key} ${value}`);
            // console.log('iii', i);
            return (
              <View key={key + i}>
                <BreadListItemComponent1
                  indexKey={i}
                  keyItem={key}
                  keyValue={value}
                  onClick={handleClick}
                />
              </View>
            );
          })
        ) : (
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
        )}
      </ScrollView>
    );
  };

  const displayMinisView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        {Object.entries(finalMiniArray).length > 0 ? (
          Object.entries(finalMiniArray).map(([key, value], i) => {
            // console.log(`${key} ${value}`);
            // console.log('iii', i);
            return (
              <View key={key + i}>
                <BreadListItemComponent1
                  indexKey={i}
                  keyItem={key}
                  keyValue={value}
                  onClick={handleClick}
                />
              </View>
            );
          })
        ) : (
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
        )}
      </ScrollView>
    );
  };

  const handleSingleItemPress = (key, value) => {
    // console.log('inside key', key, 'value', value);
    dismissBottomSheetDialog(breadRef);
    navigation.navigate('BreadListDetails', {
      bread: value,
      date: selectedOrderDate,
    });
  };
  const renderBottomSheet = () => {
    return (
      <BottomSheetBreadSizeComponent
        sheetRef={breadRef}
        dataSource={selectedItem}
        closeAction={handleClose}
        itemName={selectedItemName}
        handleSingleItemPress={handleSingleItemPress}
      />
    );
  };
  const handleClose = () => {
    dismissBottomSheetDialog(breadRef);
  };

  const handleAllTab = () => {
    //console.log('Tab 1');
    selectTab(0);
  };
  const handleFullLoavesTab = () => {
    //console.log('Tab 2');
    selectTab(1);
  };
  const handleMinisTab = () => {
    //console.log('Tab 3');
    selectTab(2);
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
          <BackViewHeader
            backText={'Bread List: ' + moment(selectedOrderDate).format('LL')}
            onClose={() => navigation.goBack()}
            toggleDateModal={toggleDateModal}
            shouldDisplaySettingIcon
            displayCalendar
            shouldDisplayBackArrow={true}
            performSearch={handleSearch}
            breadStyle={{flex: 0.33}}
            //shouldDisplayIcon={orderedProducts.length > 0}
            handleClick={openSettingsMenu}
            performRefresh={() => fetchAllData()}
          />
          {/* {isSearchClicked ? (
            <SearchInputComponent
              shouldDisplaySearchView
              searchPlaceholder={'Search by bread name'}
              searchChange={handleSearchChange}
              inputValue={searchInputValue}
              cancelPress={handleCancelSearch}
            />
          ) : null} */}
          <SliderAnalyticsComponent
            isTabClicked={isTabClicked}
            name1={'All'}
            name2={'Full Loaves'}
            name3={'Minis'}
            selectedTab={selectedTab}
            onPress1={handleAllTab}
            onPress2={handleFullLoavesTab}
            onPress3={handleMinisTab}
          />

          {renderDatePicker()}

          {hasLoaded && !ordersLoading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: 20,
              }}>
              <ProductSans
                style={{fontSize: 12, color: COLOURS.labelTextColor}}>
                Total count:
                {/* {searchInputValue.length > 0
                ? filteredOrdersData.length
                : sortArrayByDate(orderedProducts, 'name').length} */}
                {selectedTab == 0
                  ? sortArrayByDate(orderedProducts, 'name').length
                  : null}
                {selectedTab == 1
                  ? sortArrayByDate(fullLoavesArray, 'name').length
                  : null}
                {selectedTab == 2
                  ? sortArrayByDate(miniArray, 'name').length
                  : null}
              </ProductSans>
              {/* <ProductSans style={{fontSize: 12, color: COLOURS.labelTextColor}}>
              Total count:
              {searchInputValue.length > 0
                ? filteredOrdersData.length
                : sortArrayByDate(orderedProducts, 'name').length}
            </ProductSans> */}
            </View>
          ) : null}

          {renderBottomSheet()}

          {selectedTab == 0 && !ordersLoading
            ? displayAllBreadListView()
            : null}
          {selectedTab == 1 && !ordersLoading ? displayFullLoavesView() : null}
          {selectedTab == 2 && !ordersLoading ? displayMinisView() : null}

          {/* <FlatList
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
          /> */}

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
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  content: {
    width: '95%',
    height: '50%',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  modalStyle: {
    backgroundColor: COLOURS.white,
    marginVertical: deviceHeight * 0.15,
    marginHorizontal: deviceWidth * 0.12,
    borderRadius: 20,
    alignItems: 'center',
  },
});

//make this component available to the app
export default BreadListScreen;
