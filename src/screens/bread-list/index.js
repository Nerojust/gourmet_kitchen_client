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
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import BreadListItemComponent from '../../components/BreadListItemComponent';
import SearchInputComponent from '../../components/SearchInputComponent';
import ProductSans from '../../components/Text/ProductSans';
import {fp} from '../../utils/responsive-screen';
import {getAllOrderedProductsStats} from '../../store/actions/orders';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {orderedProducts, ordersLoading} = useSelector(x => x.orders);
  // console.log('pending bread list', orderedProducts.length);
  var orderProductsData = Object.assign([], orderedProducts);
  const [filteredOrdersData, setFilteredOrdersData] =
    useState(orderProductsData);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  //console.log('products', orderedProducts);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData();
    });
    fetchAllData();
    return unsubscribe;
  }, [navigation]);

  const fetchAllData = () => {
    dispatch(getAllOrderedProductsStats());
  };
  const handleClick = item => {
    console.log("item",item)
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

  const handleCancelSearch = () => {
    setSearchInputValue('');
    setIsSearchCleared(true);
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Pending Bread List"
            onClose={() => navigation.goBack()}
            shouldDisplaySettingIcon
            performSearch={handleSearch}
            shouldDisplayIcon={orderedProducts.length > 0}
            handleClick={openSettingsMenu}
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
