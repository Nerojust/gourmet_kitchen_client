//import liraries
import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {DismissKeyboard} from '../../utils/utils';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import BreadListItemComponent from '../../components/BreadListItemComponent';
import ProductSans from '../../components/Text/ProductSans';
import {fp} from '../../utils/responsive-screen';
import {getAllOrderedProductsStats} from '../../store/actions/orders';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {orderedProducts, ordersLoading} = useSelector(x => x.orders);
  const {products, productsLoading} = useSelector(x => x.products);
  //console.log('products', orderedProducts.length);

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);
  // useEffect(() => {
  //   fetchAllData();
  // }, []);

  const fetchAllData = () => {
    dispatch(getAllOrderedProductsStats());
  };
  const handleClick = item => {
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

  const openCreateSetPage = () => {};
  const openSettingsMenu = item => {
    // console.log("clicked is ", item);
    if (item == 'manageSets') {
      navigation.navigate('SetList');
    }
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Pending Bread List"
            onClose={() => navigation.goBack()}
            shouldDisplayAdd
            handleClick={openSettingsMenu}
          />

          <FlatList
            data={orderedProducts}
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
                      top: 300,
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

          {/* <LoaderShimmerComponent isLoading={productsLoading} /> */}
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
