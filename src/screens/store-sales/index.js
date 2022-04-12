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
import {BackViewMoreSettings} from '../../components/Header';
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
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllSurplus());
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

  const renderItems = ({item, index}) => {
    return (
      <SurplusListItemComponent
        item={item}
        handleEditClick={handleChangeSurplusClick}
        handleNormalClick={handleNormalClick}
      />
    );
  };

  const handleChangeSurplusClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: true,
    });
  };
  const handleNormalClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: false,
    });
  };
  const onRefresh = () => {
    // console.log('refreshed');
    dispatch(getAllSurplus());
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
    console.log('delete clicked');

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
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Store Sales"
            onClose={() => navigation.goBack()}
            shouldDisplayIcon={surplus && surplus.length > 0}
            performSearch={handleSearch}
            shouldDisplayBackArrow={true}
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
          <AddComponent goto={() => navigation.navigate('AddStoreSale')} />
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
