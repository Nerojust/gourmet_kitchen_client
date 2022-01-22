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
import {
  getAllOrderedProductsStats,
  getAllOrderedProductsStats1,
} from '../../store/actions/orders';

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newListArray, setNewListArray] = useState([]);
  const {orders, orderedProductsStats, orderedProducts, ordersLoading} =
    useSelector(x => x.orders);
  //console.log("products", orderedProducts)
  useEffect(() => {
    dispatch(getAllOrderedProductsStats());
  }, []);
  useEffect(() => {
    dispatch(getAllOrderedProductsStats1());

    if(orderedProducts.length>0){
      orderedProducts.map((item,i)=>{
        //console.log("single ", item.name)
        console.log( orderedProductsStats[0])
       if(item.id ==  orderedProductsStats[0]){
         console.log("here")
       }
      })
    }
  }, []);

  const handleClick = item => {
    navigation.navigate('BreadListDetails', {
      bread: item,
    });
  };
  const renderDetails = ({item}) => (
    <BreadListItemComponent item={item} onClick={handleClick} />
  );
  const onRefresh = async () => {
    dispatch(getAllOrderedProductsStats());
    setIsRefreshing(false);
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Bread List"
            onClose={() => navigation.goBack()}
          />

          <View>
            <ProductSans style={styles.pendingBreadListText}>
              Pending Bread List
            </ProductSans>
          </View>
          <FlatList
            data={orderedProductsStats}
            keyboardShouldPersistTaps={'handled'}
            //ListHeaderComponent={renderDetails()}
            renderItem={renderDetails}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            keyExtractor={item => item.id}
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
