//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  capitalizeWord,
  DismissKeyboard,
  sortArrayByDate,
} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import AvertaBold from '../../components/Text/AvertaBold';
import {fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import {useDispatch, useSelector} from 'react-redux';
import {getOrder} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  //var orderItems = route?.params?.order?.products;
  const {order, deleteAllOrdersLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  let id = route.params.id;
  //console.log('order details redux ', order);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  const fetchAllData = () => {
    dispatch(getOrder(route.params.id));
  };
  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.labelText, {left: 0}]}>
            CUSTOMER NAME
          </ProductSansBold>
          <TouchableOpacity onPress={null}>
            <AvertaBold style={styles.custName}>
              {order?.name ? capitalizeWord(order?.name.trim()) : 'None'}
            </AvertaBold>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            ORDER DATE
          </ProductSansBold>
          <Averta style={styles.address}>
            {order?.createdat ? moment(order?.createdat).format('LLL') : 'None'}
          </Averta>
        </View>
        {/* {isfulfilled ? (
          <View
            style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
            <ProductSansBold
              style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
              FULFILLED DATE
            </ProductSansBold>
            <Averta style={styles.address}>
              {createdat ? moment(updatedat).format('LLL') : 'None'}
            </Averta>
          </View>
        ) : null} */}

        <View
          style={[
            styles.customerNameView,
            {paddingTop: 5, marginRight: 10, marginBottom: 30},
          ]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            ORDERED PRODUCTS
          </ProductSansBold>
          {order?.isset ? (
            <AvertaBold
              style={[
                styles.custName,
                {alignSelf: 'flex-end', fontWeight: '100'},
              ]}>
              SET PACKAGE
            </AvertaBold>
          ) : null}
          {order?.products.length > 0 &&
            sortArrayByDate(order?.products).map((item, index) => {
              return (
                <View key={index}>
                  {/* order items list */}
                  <OrderListItemComponent item={item} />
                </View>
              );
            })}
        </View>
      </View>
    );
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Order Details"
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={renderDetails()}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={null}
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
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  customerNameView: {
    //width: deviceWidth - 50,
    marginTop: 5,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
});

//make this component available to the app
export default OrderDetailsScreen;
