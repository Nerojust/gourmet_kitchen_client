//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
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

// create a component
const BreadListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {orders, ordersLoading} = useSelector(x => x.orders);
  var data = [
    {
      name: 'Banana Bread',
      quantity: 5,
    },
    {
      name: 'Banana Choc',
      quantity: 5,
    },
    {
      name: 'Rice Bread',
      quantity: 5,
    },
    {
      name: 'Green Bread',
      quantity: 5,
    },
    {
      name: 'Chocolate Bread',
      quantity: 5,
    },
  ];
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
          {data.map((item, i) => {
            return <BreadListItemComponent item={item} />;
          })}
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
    color: COLOURS.textInputColor,
    fontSize: fp(17),
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingTop: 20,
  },
});

//make this component available to the app
export default BreadListScreen;
