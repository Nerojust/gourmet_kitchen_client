//import liraries
import React, {Component, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  Image,
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
  formatNumberComma,
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
import {createNote, updateNoteById} from '../../store/actions/notes';
import {IMAGES} from '../../utils/Images';
import ProductSans from '../../components/Text/ProductSans';
import {NAIRA_} from '../../utils/Constants';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {order, updateOrderLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  const {notes, createNoteLoading, updateNoteLoading} = useSelector(
    state => state.notes,
  );
  const keyboardHeight = useKeyboardHeight();
  const [isAddNewNote, setIsAddNewNote] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  let id = route.params.id;
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [specialNoteArray, setSpecialNoteArray] = useState(
    order?.specialnote || [],
  );
  const [selectedSpecialNote, setSelectedSpecialNote] = useState({});
  const [hasAddedNewNote, setHasAddedNewNote] = useState(false);
  const [isEditNoteMode, setIsEditNoteMode] = useState(false);
  //console.log('order details redux ', order);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id, hasAddedNewNote]);

  const fetchAllData = () => {
    dispatch(getOrder(route?.params?.id)).then((result, error) => {
      if (result) {
        // setSpecialNoteArray(result?.specialnote);
        setHasDataLoaded(true);
      }
    });
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
            <ProductSansBold
              style={[
                styles.custName,
                {alignSelf: 'flex-end', fontWeight: '300'},
              ]}>
              {order?.setname}
            </ProductSansBold>
          ) : null}
          {order &&
            order?.products &&
            order?.products.length > 0 &&
            sortArrayByDate(order?.products).map((item, index) => {
              return (
                <View key={index}>
                  {/* order items list */}
                  <OrderListItemComponent item={item} />
                </View>
              );
            })}

          <View style={styles.grandTotalview}>
            <AvertaBold
              style={[styles.grandTotalText, {color: COLOURS.labelTextColor,fontWeight:'500'}]}>
              {'Delivery to:\n' + order?.delivery[0]?.locationname}
            </AvertaBold>

            <AvertaBold style={styles.calculatedAmountText}>
              {order?.delivery[0]?.price
                ? NAIRA_ + formatNumberComma(order?.delivery[0]?.price)
                : null}
            </AvertaBold>
          </View>
          <View style={styles.grandTotalview}>
            <AvertaBold style={styles.grandTotalText}>Grand Total</AvertaBold>

            <AvertaBold style={styles.calculatedAmountText}>
              {NAIRA_ + calculateAmount()}
            </AvertaBold>
          </View>
        </View>

        <View style={[styles.customerNameView, {top: -20, marginBottom: 20}]}>
          <View>
            <TouchableOpacity
              style={{alignItems: 'flex-end', marginRight: 20}}
              onPress={!isAddNewNote ? handleAddNote : handleCancelNote}>
              <ProductSansBold
                style={[
                  styles.labelText,
                  {
                    paddingTop: 0,
                    color: COLOURS.purple,
                    fontWeight: '800',
                    fontSize: fp(14),
                  },
                ]}>
                {!isAddNewNote ? 'Add Note' : 'Cancel'}
              </ProductSansBold>
            </TouchableOpacity>

            {order?.specialnote && order?.specialnote != 'none' ? (
              order?.specialnote?.map((item, i) => {
                return (
                  <View key={i}>
                    <View style={styles.line} />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <ProductSansBold
                        key={i}
                        style={[
                          styles.labelText,
                          {left: 0, paddingTop: 0, flex: 2, paddingBottom: 0},
                        ]}>
                        SPECIAL NOTE {i + 1}
                      </ProductSansBold>

                      <TouchableOpacity
                        style={{marginRight: 20}}
                        onPress={() => handleEditNote(item, i)}>
                        <Image
                          source={IMAGES.editImage}
                          style={{
                            width: 22,
                            height: 22,
                            tintColor: COLOURS.labelTextColor,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <Averta style={[styles.address]}>
                      {item ? item?.note : 'None'}
                    </Averta>

                    <ProductSans style={styles.noteTimetext}>
                      Updated at{' '}
                      {item?.updatedat
                        ? moment(item?.updatedat).format('LT')
                        : 'None'}
                    </ProductSans>
                  </View>
                );
              })
            ) : !isAddNewNote ? (
              <Averta style={{paddingVertical: 10, color: COLOURS.gray}}>
                No special note found
              </Averta>
            ) : null}
            {isAddNewNote || isEditNoteMode ? (
              <View style={{marginTop: 10}}>
                <TextInputComponent
                  placeholder={'Add a special note'}
                  handleTextChange={text => setSpecialNote(text)}
                  defaultValue={specialNote ? specialNote.trim() : ''}
                  returnKeyType={'next'}
                  keyboardType={'default'}
                  secureTextEntry={false}
                  widthFigure={deviceWidth / 1.15}
                  heightfigure={95}
                  multiline={true}
                  capitalize={'sentences'}
                  props={styles.inputTextProps}
                />
                {displaySubmitButton()}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };
  const calculateAmount = useCallback(() => {
    var amount = 0;

    for (let i = 0; i < order.products.length; i++) {
      const item = order.products[i];
      amount = amount + item?.price * item?.quantity;
    } //console.log("Total order amount is ", amount);

    var result = 0;

    if (order.delivery && order?.delivery[0]?.price) {
      result = amount + order?.delivery[0]?.price;
    }

    return formatNumberComma(result);
  });
  const handleEditNote = (item, index) => {
    //console.log('edited is ', item, 'index is ', index);
    setSpecialNote(item?.note);
    setSelectedSpecialNote(item);

    setIsEditNoteMode(!isEditNoteMode);
  };
  const handleAddNote = () => {
    setSpecialNote('');
    setIsAddNewNote(!isAddNewNote);
  };
  const handleCancelNote = () => {
    setSpecialNote('');
    setIsAddNewNote(false);
    setSelectedSpecialNote({});
    setIsEditNoteMode(false);
  };
  const createSpecialNote = () => {
    if (!specialNote || specialNote.length < 1) {
      alert('Please input a note');
      return;
    }
    dispatch(createNote({note: specialNote, orderid: id})).then(
      (result, error) => {
        if (result) {
          setHasAddedNewNote(!hasAddedNewNote);
          handleCancelNote();
        }
      },
    );
  };

  const updateSpecialNote = () => {
    if (!specialNote || specialNote.length < 1) {
      alert('Please input a note to update');
      return;
    }
    dispatch(
      updateNoteById(selectedSpecialNote?.id, {
        note: specialNote,
        orderid: id,
      }),
    ).then((result, error) => {
      if (result) {
        setHasAddedNewNote(!hasAddedNewNote);
        handleCancelNote();
      }
    });
  };

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={isEditNoteMode ? updateSpecialNote : createSpecialNote}
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
            ListHeaderComponent={hasDataLoaded ? renderDetails() : null}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={updateOrderLoading} />
          <LoaderShimmerComponent isLoading={updateNoteLoading} />
          <LoaderShimmerComponent isLoading={ordersLoading} />
          <LoaderShimmerComponent isLoading={createNoteLoading} />
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
  calculatedAmountText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14,
    color: COLOURS.textInputColor,
    right: deviceWidth * 0.09,
  },
  deliveryPrice: {
    fontWeight: 'bold',
    //width: deviceWidth / 4,
    alignSelf: 'center',
    //flex: 0.3,
    fontSize: 14,
    color: COLOURS.textInputColor,
  },
  grandTotalview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 13,
    borderTopWidth: 0.4,
    borderTopColor: COLOURS.lightGray,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
    paddingVertical: 20,
  },
  grandTotalText: {
    color: COLOURS.textInputColor,
    alignSelf: 'center',
    fontSize: 14,

    fontWeight: 'bold',
  },
  inputTextProps: {
    borderWidth: 0,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 12,
  },
  noteTimetext: {
    fontWeight: 'normal',
    fontSize: fp(11),
    color: COLOURS.labelTextColor,
    paddingBottom: 10,
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: COLOURS.lightGray,
    marginVertical: 5,
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
