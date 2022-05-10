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
import {BackViewMoreSettings, BackViewSurplus} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';

import Clipboard from '@react-native-clipboard/clipboard';

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
import {getDateWithoutTime} from '../../utils/DateFilter';
import {saveOrderDate} from '../../store/actions/orders';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

// create a component
const StoreSalesScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {surplus, surplusLoading, updateSurplusLoading, createSurplusLoading} =
    useSelector(x => x.surplus);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  var surplusData = Object.assign([], surplus);
  const [filteredSurplusData, setFilteredSurplusData] = useState(surplusData);
  const [searchInputValue, setSearchInputValue] = useState('');
  //console.log('redux surplus', surplus);
  const dispatch = useDispatch();
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [open, setOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     dispatch(getAllSurplus(getDateWithoutTime(selectedOrderDate)));
  //     //Put your Data loading function here instead of my loadData()
  //   });

  //   return unsubscribe;
  // }, [navigation, selectedOrderDate]);

  useEffect(() => {
    if(selectedOrderDate){
      dispatch(getAllSurplus(getDateWithoutTime(selectedOrderDate)));
    }
  }, [selectedOrderDate]);

  const renderItems = ({item, index}) => {
    return (
      <SurplusListItemComponent
        item={item}
        handleEditClick={handleChangeSurplusClick}
        handleNormalClick={handleNormalClick}
      />
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

  const handleChangeSurplusClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: true,
      date: getDateWithoutTime(selectedOrderDate),
    });
  };
  const handleNormalClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: false,
      date: getDateWithoutTime(selectedOrderDate),
    });
  };
  const goToNewSurplus = item => {
    navigation.navigate('AddStoreSale', {
      date: getDateWithoutTime(selectedOrderDate),
    });
  };
  const onRefresh = () => {
    // console.log('refreshed');
    dispatch(getAllSurplus(getDateWithoutTime(selectedOrderDate)));
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

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const handleClick = item => {
    console.log('item', item);
    var stringData = '';
    //map through the list
    surplus.map((item, i) => {
      if (item) {
        // console.log('pdt', item.productname, 'size', item.productsize);
        stringData =
          stringData +
          '\n' +
          (i + 1) +
          '. ) ' +
          item.productname +
          ' => Size: (' +
          item.productsize +
          ')';
      }
    });

    Clipboard.setString(stringData);
    alert('Copied to clipboard');
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewSurplus
            backText={
              'Store Sales: ' + moment(selectedOrderDate).format('LL')
            }
            onClose={() => navigation.goBack()}
            shouldDisplayIcon={surplus && surplus.length > 0}
            shouldDisplaySettingIcon
            performSearch={handleSearch}
            shouldDisplayBackArrow={true}
            displayCalendar
            handleClick={handleClick}
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
                ? filteredSurplusData.length
                : surplus && sortArrayByDate(surplus, 'productname').length}
            </ProductSans>
          </View>
          <FlatList
            data={
              searchInputValue.length > 0
                ? filteredSurplusData
                : surplus && sortArrayByDate(surplus, 'productname')
            }
            renderItem={renderItems}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
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
            }
          />

          <LoaderShimmerComponent isLoading={surplusLoading} />
          <AddComponent goto={goToNewSurplus} />
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
export default StoreSalesScreen;
