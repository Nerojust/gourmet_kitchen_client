//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
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
import {deviceWidth, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOrder,
  updateOrderById,
  updateOrderSpecialNoteById,
} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import TextInputComponent from '../../components/TextInputComponent';
import useKeyboardHeight from 'react-native-use-keyboard-height';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  //var orderItems = route?.params?.order?.products;
  const {order, updateOrderLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  const keyboardHeight = useKeyboardHeight();
  const [isSpecialFieldEditable, setIsSpecialFieldEditable] = useState(false);
  const [specialNote, setSpecialNote] = useState(order.specialnote || '');
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
              {order?.customer?.name
                ? capitalizeWord(order?.customer?.name.trim())
                : 'None'}
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
              {order?.setname}
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

        <View style={[styles.customerNameView, {top: -20}]}>
          <View>
            <View style={{flexDirection: 'row', width: deviceWidth}}>
              <ProductSansBold
                style={[styles.labelText, {left: 0, paddingTop: 0, flex: 2}]}>
                SPECIAL NOTE
              </ProductSansBold>

              {specialNote && specialNote != 'none' ? (
                !isSpecialFieldEditable ? (
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={handleSpecialChange}>
                    <ProductSansBold
                      style={[
                        styles.labelText,
                        {
                          paddingTop: 0,
                          color: COLOURS.purple,
                        },
                      ]}>
                      Edit Note
                    </ProductSansBold>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={handleSpecialChange}>
                    <ProductSansBold
                      style={[
                        styles.labelText,
                        {
                          paddingTop: 0,
                          color: COLOURS.purple,
                        },
                      ]}>
                      Cancel
                    </ProductSansBold>
                  </TouchableOpacity>
                )
              ) : !isSpecialFieldEditable ? (
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={handleSpecialChange}>
                  <ProductSansBold
                    style={[
                      styles.labelText,
                      {
                        paddingTop: 0,
                        color: COLOURS.purple,
                      },
                    ]}>
                    Add Note
                  </ProductSansBold>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={handleSpecialChange}>
                  <ProductSansBold
                    style={[
                      styles.labelText,
                      {
                        paddingTop: 0,
                        color: COLOURS.purple,
                      },
                    ]}>
                    Cancel
                  </ProductSansBold>
                </TouchableOpacity>
              )}
            </View>
            {isSpecialFieldEditable ? (
              <>
                <TextInputComponent
                  placeholder={'Special Note'}
                  handleTextChange={text => setSpecialNote(text)}
                  defaultValue={specialNote ? specialNote.trim() : ''}
                  returnKeyType={'next'}
                  keyboardType={'default'}
                  secureTextEntry={false}
                  widthFigure={deviceWidth / 1.15}
                  heightfigure={95}
                  multiline={true}
                  editable={isSpecialFieldEditable}
                  capitalize={'sentences'}
                  props={{
                    borderWidth: 0,
                    paddingTop: 12,
                    padding: 20,
                  }}
                />

                {displaySubmitButton()}
              </>
            ) : (
              <Averta style={styles.address}>
                {specialNote ? specialNote : 'None'}
              </Averta>
            )}
          </View>
        </View>
      </View>
    );
  };

  const handleSpecialChange = () => {
    setIsSpecialFieldEditable(!isSpecialFieldEditable);
  };
  const updateSpecialNote = () =>
    dispatch(
      updateOrderSpecialNoteById(order?.id, {specialNote: specialNote}),
    ).then((result, error) => {
      if (result) {
        handleSpecialChange();
       
      }
    });
  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={updateSpecialNote}
        activeOpacity={0.6}
        style={{
          marginTop: 5,
          justifyContent: 'center',
          marginBottom:
            keyboardHeight > 0 ? (Platform.OS == 'ios' ? 70 : 100) : 20,
          backgroundColor: COLOURS.blue,
          height: 50,
          borderRadius: 10,
          marginTop: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          {!specialNote ? 'Add Note' : 'Update Note'}
        </Text>
      </TouchableOpacity>
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
          <LoaderShimmerComponent isLoading={updateOrderLoading} />
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
