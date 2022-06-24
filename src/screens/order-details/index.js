//import liraries
import React, {
  Component,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SendSMS from 'react-native-sms';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  capitalizeWord,
  dialNumber,
  dismissBottomSheetDialog,
  DismissKeyboard,
  dismissTextInput,
  formatNumberComma,
  getProcessingTime,
  getProcessingTimeString,
  removeDuplicatesFromArray,
  showBottomSheet,
  sortArrayByDate,
} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import AvertaBold from '../../components/Text/AvertaBold';
import {
  deviceHeight,
  deviceWidth,
  fp,
  hp,
  wp,
} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteOrderById,
  getOrder,
  rescheduleOrderDateById,
  updateOrderAllItemsByOrderId,
  updateOrderById,
  updateOrderDispatchByOrderId,
  updateOrderSpecialNoteById,
} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import TextInputComponent from '../../components/TextInputComponent';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import {createNote, updateNoteById} from '../../store/actions/notes';
import {IMAGES} from '../../utils/Images';
import ProductSans from '../../components/Text/ProductSans';
import {ACTIVE_OPACITY, DIALOG_TIMEOUT, NAIRA_} from '../../utils/Constants';
import GoogleSearchComponent from '../../components/GoogleSearchComponent';
import BlinkingTextComponent from '../../components/BlinkingTextComponent';
import {
  BottomSheetDeliveryTypesComponent,
  BottomSheetProductComponent,
  BottomSheetRiderComponent,
} from '../../components/BottomSheetComponent';
import {getAllDeliveryTypes} from '../../store/actions/delivery-types';
import {getAllProducts} from '../../store/actions/products';
import OrderListItem from '../../components/OrderListItem';
import OrdersHelper from '../../components/OrdersHelper';
import {DataTable} from 'react-native-paper';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {getAllRiders} from '../../store/actions/riders';
import DatePicker from 'react-native-date-picker';
import {getDateWithoutTime} from '../../utils/DateFilter';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isFullNameFieldFocused, setIsFullNameFieldFocused] = useState(false);
  const [isAddressFieldFocused, setAddressFieldFocused] = useState(false);
  const [
    isAddressDescriptionFieldFocused,
    setIsAddressDescriptionFieldFocused,
  ] = useState(false);

  const productSheetRef = useRef();
  const ridersSheetRef = useRef();
  const zupaProductAssociateSheetRef = useRef();

  const fullNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const deliverySheetRef = useRef();
  const addressRef = useRef(null);
  const additionalAddressDescriptionRef = useRef(null);
  const specialNoteRef = useRef(null);
  const [isLoadingUpdateAllOrderItems, setIsLoadingUpdateAllOrderItems] =
    useState(false);
  const [isPhoneNumberFieldFocused, setIsPhoneNumberFieldFocused] =
    useState(false);
  const [additionalAddressDescription, setAdditionalAddressDescription] =
    useState('');
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedRider, setSelectedRider] = useState({});

  const {products, productsLoading} = useSelector(state => state.products);
  const {riders, rider, ridersLoading, updateRidersLoading} = useSelector(
    state => state.riders,
  );
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let dateData;
  var ridersData = Object.assign([], riders);
  const [filteredRidersData, setFilteredRidersData] = useState(ridersData);
  const [ridersInputValue, setRidersInputValue] = useState('');

  var productsData = Object.assign([], products);
  //console.log("pdts",productsData)
  const [quantity, setQuantity] = useState(1);
  const [filteredProductData, setFilteredProductsData] = useState(productsData);
  const [productInputValue, setProductInputValue] = useState('');
  const [deliveryInputValue, setDeliveryInputValue] = useState('');
  const [zupaProductInputValue, setZupaProductInputValue] = useState('');
  const [isProductSelected, setIsProductSelected] = useState(false);
  var basketArray = [];
  const [newBasketArray, setNewBasketArray] = useState(basketArray);

  const {sets} = useSelector(x => x.sets);
  const [mergedArrayProducts, setMergedArrayProducts] = useState(products);
  //console.log("sets",sets)
  const [mainDeliveryArray, setmainDeliveryArray] = useState([]);
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const {deliveryTypes, deliveryTypesLoading, deliveryStates} = useSelector(
    state => state.deliveryTypes,
  );
  var finalDeliveryArray = [];
  let deleteArray = [];
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [hasPatchedDispatch, setHasPatchedDispatch] = useState(false);
  const {
    order,
    updateOrderLoading,
    ordersLoading,
    deleteAllOrdersLoading,
    isOrderPatched,
  } = useSelector(state => state.orders);
  const {createNoteLoading, updateNoteLoading} = useSelector(
    state => state.notes,
  );
  const keyboardHeight = useKeyboardHeight();
  const [isAddNewNote, setIsAddNewNote] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  let id = route.params.id;
  let orderDate = route.params.orderDate;
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [specialNoteArray, setSpecialNoteArray] = useState(
    order?.specialnote || [],
  );
  const [selectedSpecialNote, setSelectedSpecialNote] = useState({});
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  var deliveryTypesData = Object.assign([], mainDeliveryArray);
  const [filteredDeliveryTypesData, setFilteredDeliveryTypesData] =
    useState(deliveryTypesData);
  const [orderItems, setOrderItems] = useState([]);
  const [_orderItems, set_orderItems] = useState([]);
  const [hasAddedNewNote, setHasAddedNewNote] = useState(false);
  const [isEditNoteMode, setIsEditNoteMode] = useState(false);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState();

  const [data, setData] = useState();
  //console.log('order details redux ', data);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (id) {
        fetchAllData();
      }
    });
    if (id) {
      fetchAllData();
    }
    return unsubscribe;
  }, [id, hasAddedNewNote, isEditMode, hasPatchedDispatch]);

  // useEffect(() => {
  //   if (id) {
  //     fetchAllData();
  //   }
  // }, [id, hasAddedNewNote, isEditMode, hasPatchedDispatch]);

  useEffect(() => {
    dispatch(getAllDeliveryTypes(''));
    dispatch(getAllRiders());
  }, []);

  const fetchAllData = () => {
    dispatch(getOrder(id)).then(result => {
      if (result) {
        //console.log('data', result);
        setHasDataLoaded(true);
        setData(result);

        if (result) {
          setOrderItems(result?.products);
          setSelectedDeliveryType(result?.delivery);
          setFullName(result?.customer?.name);
          setAddress(result?.customer?.address);
          setAdditionalAddressDescription(result?.customer?.addressdescription);
          setPhoneNumber(result?.customer?.phonenumber);
          setDeletedOrders([]);
          setSelectedRider(result?.rider);
          // setSpecialNote(
          //   result?.specialNote ? result?.specialnote[0]?.specialnote : '',
          // );
        }
      }
    });
  };

  useEffect(() => {
    deliveryTypes.map(type => {
      if (type?.type && type?.type == 'custom' && type?.isActive) {
        //console.log('type data', type.type);
        finalDeliveryArray.push(type);
      }
      if (type?.type && type?.type == 'default' && type?.isActive) {
        //console.log('type data', type.type);
        finalDeliveryArray.push(type);
      }
      //console.log("deliii", type.isActive);
      deliveryStates?.map(state => {
        if (type?.state != null) {
          if (
            type?.state.toLowerCase() ===
            state?.name.toLowerCase().split(' ')[0]
          ) {
            if (state?.isActive) {
              finalDeliveryArray.push(type);
            }
          }
        }
      });
    });
    setmainDeliveryArray(removeDuplicatesFromArray(finalDeliveryArray));
    //console.log("array is ", finalDeliveryArray.length);
  }, [deliveryTypes, deliveryStates]);

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };
  const onClickItem = item => {
    //console.log('clicked item is ', item);
    if (!item.isfulfilled) {
      navigation.push('OrderFulfill', {
        item: item,
        date: orderDate,
      });
    }
  };

  const renderDetails = () => {
    return (
      <>
        {!isEditMode ? (
          <View style={{marginHorizontal: 25, marginTop: 10}}>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                CUSTOMER NAME
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <AvertaBold style={styles.custName}>
                  {fullName ? capitalizeWord(fullName.trim()) : 'None'}
                </AvertaBold>
              </TouchableOpacity>
            </View>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                CUSTOMER ADDRESS
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <Averta style={styles.address}>
                  {address ? capitalizeWord(address.trim()) : 'None'}
                </Averta>
              </TouchableOpacity>
            </View>
            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                CUSTOMER PHONE NUMBER
              </ProductSansBold>
              <TouchableOpacity onPress={() => dialNumber(phoneNumber.trim())}>
                <Averta style={styles.address}>
                  {phoneNumber ? phoneNumber.trim() : 'None'}
                </Averta>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.customerNameView,
                {paddingTop: 5, marginRight: 10},
              ]}>
              <ProductSansBold
                style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
                SCHEDULED ORDER DATE
              </ProductSansBold>
              <AvertaBold style={styles.custName}>
                {order?.createdat
                  ? moment(order?.createdat).format('LLL')
                  : 'None'}
              </AvertaBold>
            </View>
            {order?.originalorderdate ? (
              <View
                style={[
                  styles.customerNameView,
                  {paddingTop: 5, marginRight: 10},
                ]}>
                <ProductSansBold
                  style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
                  ORIGINAL ORDER DATE
                </ProductSansBold>
                <Averta style={styles.custName}>
                  {order?.originalorderdate
                    ? moment(order?.originalorderdate).format('LLL')
                    : 'None'}
                </Averta>
              </View>
            ) : null}

            <View style={styles.customerNameView}>
              <ProductSansBold style={[styles.labelText, {left: 0}]}>
                ORDER CREATED BY
              </ProductSansBold>
              <TouchableOpacity onPress={null}>
                <Averta style={styles.address}>
                  {order?.createdby
                    ? capitalizeWord(
                        order?.createdby?.lastname +
                          ' ' +
                          order?.createdby?.firstname,
                      )
                    : 'None'}
                </Averta>
              </TouchableOpacity>
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
              {order?.isonlineorder ? (
                <ProductSansBold
                  style={[
                    styles.custName,
                    {
                      alignSelf: 'flex-end',
                      fontWeight: '500',
                      color: COLOURS.green2,
                      fontSize: fp(12),
                    },
                  ]}>
                  ONLINE ORDER
                </ProductSansBold>
              ) : null}
              {order?.isset ? (
                <ProductSansBold
                  style={[
                    styles.custName,
                    {alignSelf: 'flex-end', fontWeight: '300'},
                  ]}>
                  {order?.setname}
                </ProductSansBold>
              ) : null}
              {order?.products &&
                order?.products.length > 0 &&
                sortArrayByDate(order?.products).map((item, index) => {
                  return (
                    <View key={index}>
                      {/* order items list */}
                      <OrderListItemComponent
                        item={item}
                        onClickItem={onClickItem}
                      />
                    </View>
                  );
                })}

              <View style={styles.grandTotalview}>
                <AvertaBold
                  style={[
                    styles.grandTotalText,
                    {
                      color: COLOURS.labelTextColor,
                      fontWeight: '500',
                      flex: 1.06,
                    },
                  ]}>
                  {order?.delivery
                    ? 'Delivery to:\n' + order?.delivery?.locationname
                    : 'Delivery Type: Walk-In'}
                </AvertaBold>

                <AvertaBold
                  style={[styles.calculatedAmountText, {right: 0, flex: 0.38}]}>
                  {order.delivery?.price
                    ? NAIRA_ + formatNumberComma(order.delivery?.price)
                    : null}
                </AvertaBold>
              </View>

              <View style={[styles.grandTotalview]}>
                <AvertaBold style={[styles.grandTotalText, {flex: 2}]}>
                  Grand Total
                </AvertaBold>

                <AvertaBold
                  style={[styles.calculatedAmountText, {flex: 0.72, right: 0}]}>
                  {NAIRA_ + calculateAmount()}
                </AvertaBold>
              </View>
            </View>

            {order?.dispatch || order?.status == 'completed' ? (
              <View style={styles.dispatchView}>
                <View style={[styles.customerNameView, {marginTop: 0}]}>
                  <ProductSansBold
                    style={[styles.labelText, {left: 0, paddingTop: 0}]}>
                    DISPATCHED BY
                  </ProductSansBold>
                  <Averta style={{color: COLOURS.textInputColor}}>
                    {selectedRider ? selectedRider?.name : 'No rider assigned'}
                  </Averta>
                  <Averta
                    style={[styles.address, {color: COLOURS.textInputColor}]}>
                    {selectedRider ? selectedRider?.phonenumber : null}
                  </Averta>
                  {order?.dispatch?.updatedat ? (
                    <>
                      <ProductSans
                        style={[styles.noteTimetext, {marginTop: 5}]}>
                        Updated at{' '}
                        {order?.dispatch?.updatedat
                          ? moment(order?.dispatch?.updatedat).format('LT')
                          : 'None'}
                      </ProductSans>

                      <ProductSansBold
                        style={[
                          styles.labelText,
                          {left: 0, paddingTop: 5, paddingBottom: 4},
                        ]}>
                        TIME IN PROCESSING
                      </ProductSansBold>
                      <Averta style={{color: COLOURS.textInputColor}}>
                        {getProcessingTimeString(order?.processingtime)}
                      </Averta>
                    </>
                  ) : null}
                </View>

                <View>
                  <TouchableOpacity
                    onPress={handleLoadRidersBottomSheet}
                    activeOpacity={0.6}
                    style={{
                      height: hp(35),
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      borderWidth: 0.4,
                      borderColor: COLOURS.blue,
                      backgroundColor: COLOURS.green5,
                      alignItems: 'center',
                    }}>
                    <ProductSansBold
                      style={[
                        styles.actiontext,
                        {
                          left: 0,
                          marginTop: 0,
                          color: COLOURS.white,
                        },
                      ]}>
                      {selectedRider ? 'Edit Dispatch' : 'Add dispatch'}
                    </ProductSansBold>
                  </TouchableOpacity>
                  {order.dispatchid ? (
                    <TouchableOpacity
                      onPress={initiateSMS}
                      activeOpacity={0.6}
                      style={styles.sendSmsView}>
                      <ProductSans
                        style={[
                          styles.actiontext,
                          {
                            left: 0,
                            marginTop: 0,
                            color: COLOURS.white,
                          },
                        ]}>
                        Send SMS
                      </ProductSans>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}
            {/* special note section */}
            <View style={[styles.customerNameView, {marginVertical: 20}]}>
              <View>
                <TouchableOpacity
                  style={{
                    alignItems: 'flex-end',
                    marginRight: 20,
                    marginTop: 15,
                  }}
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
                              {
                                left: 0,
                                paddingTop: 0,
                                flex: 2,
                                paddingBottom: 0,
                              },
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
                    {displaySpecialNoteSubmitButton()}
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          renderInputFields()
        )}
      </>
    );
  };
  const renderInputFields = () => {
    return (
      <>
        <View style={[styles.actions, {paddingVertical: 13}]}>
          <ProductSansBold style={styles.actiontext}>
            BASIC DETAILS
          </ProductSansBold>
        </View>

        <TextInputComponent
          placeholder={'Full Name'}
          handleTextChange={text => setFullName(text)}
          defaultValue={fullName}
          returnKeyType={'next'}
          keyboardType={'default'}
          secureTextEntry={false}
          refValue={fullNameRef}
          capitalize={'sentences'}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          //refValue={fullNameRef}
          props={
            isFullNameFieldFocused
              ? {borderColor: COLOURS.blue}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => {
            setIsFullNameFieldFocused(true);
          }}
          handleBlur={() => {
            setIsFullNameFieldFocused(false);
          }}
          onSubmitEditing={() => {}}
        />

        <View style={styles.spaceBetweenInputs} />
        <TextInputComponent
          placeholder={'Phone Number'}
          handleTextChange={text =>
            //setPhoneNumber(addCommaToNumber(text))
            setPhoneNumber(text)
          }
          defaultValue={phoneNumber ? phoneNumber.trim() : ''}
          returnKeyType={'next'}
          keyboardType={'number-pad'}
          secureTextEntry={false}
          heightfigure={50}
          length={11}
          widthFigure={deviceWidth / 1.15}
          refValue={phoneNumberRef}
          props={
            isPhoneNumberFieldFocused
              ? {
                  borderColor: COLOURS.blue,
                }
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsPhoneNumberFieldFocused(true)}
          handleBlur={() => setIsPhoneNumberFieldFocused(false)}
          onSubmitEditing={() => {
            addressRef.current.focus();
          }}
        />
        <View style={styles.spaceBetweenInputs} />
        <GoogleSearchComponent
          address={address}
          addressRef={addressRef}
          getProps={handleAddressInputText}
          handleResult={handleSearchResult}
          //props={{color:COLOURS.red}}
        />

        <BlinkingTextComponent style={{paddingHorizontal: 43}} />

        <View style={styles.spaceBetweenInputs} />
        <TextInputComponent
          placeholder={'Additional Address Description'}
          handleTextChange={text => setAdditionalAddressDescription(text)}
          defaultValue={
            additionalAddressDescription
              ? additionalAddressDescription.trim()
              : ''
          }
          capitalize={'sentences'}
          returnKeyType={'next'}
          keyboardType={'default'}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          secureTextEntry={false}
          refValue={additionalAddressDescriptionRef}
          props={
            isAddressDescriptionFieldFocused
              ? {
                  borderColor: COLOURS.blue,
                }
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsAddressDescriptionFieldFocused(true)}
          handleBlur={() => setIsAddressDescriptionFieldFocused(false)}
          onSubmitEditing={() => {
            specialNoteRef.current.focus();
          }}
        />
        {/* <View style={styles.spaceBetweenInputs} />

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
          capitalize={'sentences'}
          refValue={specialNoteRef}
          props={{
            borderWidth: 0,
            paddingTop: 12,
            padding: 20,
          }}
        /> */}
        {/* product section */}
        <>
          <View style={[styles.actions, {paddingVertical: 13}]}>
            <ProductSansBold style={styles.actiontext}>
              SELECT PRODUCTS
            </ProductSansBold>
          </View>

          <TouchableOpacity
            onPress={handleLoadProductsBottomSheet}
            style={[
              styles.productView,
              {marginHorizontal: deviceWidth * 0.065},
            ]}
            activeOpacity={ACTIVE_OPACITY}>
            <AvertaBold
              style={[styles.productText, {flex: 1}]}
              numberOfLines={2}>
              {selectedProduct && selectedProduct?.categorySize
                ? selectedProduct?.name.trim() +
                  ' (' +
                  selectedProduct?.categorySize?.name.trim() +
                  ')'
                : 'Select a product'}
            </AvertaBold>
            <FontAwesome
              name="angle-down"
              size={hp(20)}
              color={COLOURS.gray}
              style={{marginRight: 10, flex: 0.1}}
            />
          </TouchableOpacity>
        </>

        <View style={[styles.spaceBetweenInputs, {marginTop: 10}]} />

        {/* Auto add selected product to cart */}

        {isProductSelected ? addDetailsToOrderSummary() : null}

        <View style={[styles.spaceBetweenInputs, {marginTop: 15}]} />

        {/* order summary section */}

        <View style={[styles.spaceBetweenInputs, {marginTop: 0}]} />
      </>
    );
  };

  const addDetailsToOrderSummary = () => {
    if (selectedProduct) {
      const {productid} = selectedProduct || [];
      //console.log("selected id", this.state.selectedProduct.id);
      let isProductExisting = false;
      if (productid) {
        orderItems?.map(order => {
          //("orderid", order.product.id);
          if (productid === order?.productid) {
            isProductExisting = true;
            alert(
              'You already have this in your cart, please update the quantity',
            );
            setIsProductSelected(false);
            return;
          }
        });
      }

      if (!isProductExisting) {
        //re-arrange the product object from zupa to be like kitchen product list
        const results = orderItems.concat(selectedProduct);
        setOrderItems(results);
        console.log('total products list now is', results);
      }
      setSelectedProduct(undefined);
    } else {
      setIsProductSelected(false);
      alert('Please select a product');
    }
    setSelectedProduct({});
    setIsProductSelected(false);
  };
  const handleLoadProductsBottomSheet = () => {
    dismissTextInput(fullNameRef);
    showBottomSheet(productSheetRef);
  };
  const handleLoadRidersBottomSheet = () => {
    showBottomSheet(ridersSheetRef);
  };

  const handleProductInputSearchText = text => {
    if (text) {
      mergedArrayProducts.sort((a, b) => {
        if (b.name > a.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
      });
      const newData = mergedArrayProducts?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredProductsData(newData);
      setProductInputValue(text);
    } else {
      setFilteredProductsData(mergedArrayProducts);
      setProductInputValue(text);
    }
  };

  /**
   *
   * @param {text to search for delivery} text
   */
  const handleDeliverySearchText = text => {
    if (text) {
      const newData = mainDeliveryArray?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDeliveryTypesData(newData);
      setDeliveryInputValue(text);
    } else {
      setFilteredDeliveryTypesData(mainDeliveryArray);
      setDeliveryInputValue(text);
    }
  };
  const handleRidersSearchText = text => {
    if (text) {
      const newData = riders?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredRidersData(newData);
      setRidersInputValue(text);
    } else {
      setFilteredRidersData(riders);
      setRidersInputValue(text);
    }
  };
  const handleCloseActionProduct = () => {
    setProductInputValue('');
    setFilteredProductsData([]);
    dismissBottomSheetDialog(productSheetRef);
    dismissBottomSheetDialog(zupaProductAssociateSheetRef);
  };
  const renderBottomSheets = () => {
    return (
      <>
        <BottomSheetProductComponent
          sheetRef={productSheetRef}
          handleRefresh={handleRefreshIncaseOfNetworkFailure}
          isProductLoading={productsLoading}
          filteredDataSource={filteredProductData}
          dataSource={
            productInputValue.length > 0
              ? filteredProductData
              : mergedArrayProducts
          }
          closeAction={handleCloseActionProduct}
          handleSingleItemPress={handleSingleItemPress}
          //addProductPress={addProductPress}
          inputValue={productInputValue}
          handleSearchInputSubmit={handleProductSubmitSearchext}
          handleInputSearchText={handleProductInputSearchText}
          // handleAddProduct={createNewProduct}
        />
        <BottomSheetRiderComponent
          sheetRef={ridersSheetRef}
          handleRefresh={handleRefreshIncaseOfNetworkFailure}
          isRidersLoading={ridersLoading}
          filteredDataSource={filteredRidersData}
          dataSource={ridersInputValue.length > 0 ? filteredRidersData : riders}
          closeAction={handleCloseActionRider}
          handleSingleItemPress={handleSingleItemPress}
          inputValue={ridersInputValue}
          handleSearchInputSubmit={handleProductSubmitSearchext}
          handleInputSearchText={handleRidersSearchText}
        />

        {/* delivery bottom sheet */}
        <BottomSheetDeliveryTypesComponent
          sheetRef={deliverySheetRef}
          closeAction={handleCloseActionDelivery}
          //dataSource={filteredDeliveryTypesData}
          dataSource={
            deliveryInputValue.length > 0
              ? filteredDeliveryTypesData
              : mainDeliveryArray
          }
          isDeliveryLoading={deliveryTypesLoading}
          handleRefresh={handleRefreshIncaseOfNetworkFailure}
          handleSingleItemPress={handleSingleItemPress}
          inputValue={deliveryInputValue}
          handleInputSearchText={handleDeliverySearchText}
          //handleAddDelivery={handleAddDelivery}
        />
      </>
    );
  };

  const deleteFromOrderBasket = order => {
    //console.log('deleted it', order.id);
    setDeletedOrders([...deletedOrders, order.id]);
    //deleteArray.push(order.id)
    let updatedOrderItems = orderItems.filter(item =>
      item?.id > 0
        ? item.id !== order.id
        : item.name !== order.name && item.productsize !== order.productsize,
    );
    setOrderItems(updatedOrderItems);
    console.log('after deleting array', deletedOrders);
  };

  const updateItemQuantity = (qty, item) => {
    let updatedOrders = orderItems.map(obj =>
      obj?.id > 0
        ? obj.id === item?.id
          ? {...obj, quantity: qty}
          : obj
        : obj?.name === item?.name && obj?.productsize === item?.productsize
        ? {...obj, quantity: qty}
        : obj,
    );
    setOrderItems(updatedOrders);
  };
  const renderCheckout = () => {
    var grandTotalAmount = 0;

    if (isEditMode) {
      var _data = Object.assign({}, data);
      _data.products = orderItems;
      if (_data?.delivery) {
        _data.delivery.price = selectedDeliveryType?.price;
      }
      grandTotalAmount = OrdersHelper.resolveAmount(_data).grandTotalAmount;

      return (
        <View style={[styles.cbox, {marginBottom: 10}]}>
          {/* title header */}

          <DataTable>
            <View style={[styles.checkheader, {paddingVertical: 15}]}>
              <ProductSansBold style={styles.citem}>ITEM</ProductSansBold>
              <ProductSansBold
                style={[styles.cothers, {left: deviceWidth * 0.02}]}>
                QTY
              </ProductSansBold>
              <ProductSansBold style={[styles.cothers, {left: -18}]}>
                PRICE({NAIRA_})
              </ProductSansBold>
            </View>

            <View>
              {orderItems.length > 0 &&
                orderItems.map((item, index) => {
                  return (
                    <View key={index}>
                      {/* order items list */}
                      <OrderListItem
                        item={item?.name}
                        size={item?.categorysize}
                        qty={item?.quantity}
                        price={item?.price}
                        total={item?.quantity * item?.price}
                        isEditMode={isEditMode}
                        deleteFromOrderBasket={() =>
                          deleteFromOrderBasket(item)
                        }
                        sendValue={value => updateItemQuantity(value, item)}
                      />
                    </View>
                  );
                })}
            </View>
          </DataTable>

          {/* bottom views */}
          {isEditMode ? (
            <>
              {/* {renderBottomSheets()} */}

              {/* select delivery type view */}
              <TouchableOpacity
                style={[
                  styles.deliverySheetview,
                  {justifyContent: 'space-between'},
                ]}
                activeOpacity={1}
                onPress={handleLoadDeliveryBottomSheet}>
                <TouchableOpacity
                  onPress={handleLoadDeliveryBottomSheet}
                  style={[
                    styles.productView,
                    {
                      width: deviceWidth / 2.7,
                      flex: 0.6,
                    },
                  ]}
                  activeOpacity={ACTIVE_OPACITY}>
                  <ProductSans
                    style={[styles.productText, {flex: 1}]}
                    numberOfLines={1}>
                    {selectedDeliveryType?.locationname
                      ? selectedDeliveryType?.locationname
                      : 'Select a delivery type'}
                  </ProductSans>

                  <FontAwesome
                    name="angle-down"
                    size={hp(20)}
                    color={COLOURS.gray2}
                    style={{marginRight: 10, flex: 0.1}}
                  />
                </TouchableOpacity>

                <AvertaBold style={[styles.deliveryPrice, {flex: 0.281}]}>
                  {selectedDeliveryType?.price
                    ? formatNumberComma(selectedDeliveryType?.price)
                    : 0}
                </AvertaBold>
              </TouchableOpacity>

              {/* grand total view */}
              <View style={[styles.grandTotalview]}>
                <AvertaBold
                  style={[styles.grandTotalText, {flex: 2, left: 15}]}>
                  Grand Total
                </AvertaBold>
                <AvertaBold
                  style={[styles.calculatedAmountText, {flex: 0.9, right: 0}]}>
                  {formatNumberComma(grandTotalAmount)}
                </AvertaBold>
              </View>
            </>
          ) : null}
        </View>
      );
    }
  };
  const handleLoadDeliveryBottomSheet = () => {
    showBottomSheet(deliverySheetRef);
  };

  const handleSingleItemPress = async (
    item,
    isProduct,
    isDelivery,
    isRider,
  ) => {
    console.log('clicked item is ', item);
    if (isProduct) {
      let object = {};
      if (isEditMode) {
        //create a new object to match kitchen product pattern
        object = {
          categoryid: item?.categorySize?.categoryId,
          categorysize: item?.categorySize?.name,
          categorysizeid: item?.categorySize?.id,
          isset: false,
          name: item?.name,
          orderid: id,
          price: item?.unitPrice,
          productid: item?.id,
          productsize: item?.categorySize?.name,
          quantity: 1,
        };
        setSelectedProduct(object);
      } else {
        setSelectedProduct(item);
      }

      setIsProductSelected(true);
      setProductInputValue('');
      dismissBottomSheetDialog(productSheetRef);
    }
    if (isDelivery) {
      if (isEditMode) {
        let object = {
          id: order.delivery.id,
          locationname: item.name,
          state: item.state,
          price: item.price,
          deliveryTypeId: item.id,
        };
        console.log('delivery object', object);
        setSelectedDeliveryType(object);
      }
      setDeliveryInputValue('');
      dismissBottomSheetDialog(deliverySheetRef);
    }
    if (isRider) {
      setSelectedRider(item);
      dismissBottomSheetDialog(ridersSheetRef);

      handlePatchDisptach(item);
    }
  };

  const handleRefreshIncaseOfNetworkFailure = (
    isProduct,
    isDelivery,
    isRider,
  ) => {
    if (isProduct) {
      dispatch(getAllProducts('', 0, 0));
    }
    if (isDelivery) {
      dispatch(getAllDeliveryTypes(''));
    }
    if (isRider) {
      dispatch(getAllRiders());
    }
  };
  const handleCloseActionDelivery = () => {
    setDeliveryInputValue('');
    dismissBottomSheetDialog(deliverySheetRef);
  };
  const handleCloseActionRider = () => {
    setRidersInputValue('');
    dismissBottomSheetDialog(ridersSheetRef);
  };

  const handleAddressInputText = text => {
    //console.log("inside text is", text);
    //newAddress = text;
    setAddress(text);
  };
  const handleSearchResult = (data, details) => {
    // console.log(details?.formatted_address, details?.geometry?.location);
    setAddress(details?.formatted_address);
    //newAddress = input;
  };
  const calculateAmount = useCallback(() => {
    var amount = 0;

    for (let i = 0; i < order.products.length; i++) {
      const item = order.products[i];
      amount = amount + item?.price * item?.quantity;
    }
    //console.log('Total order amount is ', amount);

    var result = 0;

    if (order.delivery && order?.delivery?.price) {
      result = amount + order?.delivery?.price;
    } else {
      result = amount;
    }

    return formatNumberComma(result);
  });

  const handleEditNote = item => {
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

  const handleProductSubmitSearchext = () => {
    console.log('submit text', productInputValue);
    //dispatch(ProductActions.searchAllBaseProducts(text, 400, 0));
  };

  const createSpecialNote = () => {
    if (!specialNote || specialNote.length < 1) {
      alert('Please input a note');
      return;
    }
    dispatch(createNote({note: specialNote, orderid: id})).then(result => {
      if (result) {
        setHasAddedNewNote(!hasAddedNewNote);
        handleCancelNote();
        showSuccessDialog(false);
      }
    });
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
    ).then(result => {
      if (result) {
        setHasAddedNewNote(!hasAddedNewNote);
        handleCancelNote();
        showSuccessDialog(false);
      }
    });
  };

  const sendPatchRequest = async () => {
    requestAnimationFrame(async () => {
      if (!fullName) {
        alert('Customer name is required');
        return;
      }
      if (!phoneNumber) {
        alert('Phone number is required');
        return;
      }
      if (phoneNumber.length < 11) {
        alert('Phone number must be 11 digits');
        return;
      }
      // if(!newAddress){
      //   alert("Address is required")
      //   return
      // }
      if (orderItems.length == 0) {
        alert('Please select at least one product');
        return;
      }

      let kitchen_payload = {};
      let productArray = [];

      orderItems.map(data => {
        //normal single item
        var item = {
          id: data?.id,
          productId: data?.productid,
          productName: data?.name,
          quantity: data?.quantity,
          price: data?.price,
          size: data?.productsize,
        };
        productArray.push(item);
      });

      kitchen_payload = {
        customer: {
          id: order?.customer?.id,
          name: fullName,
          phoneNumber: phoneNumber,
          address,
          addressDescription: additionalAddressDescription,
          specialNote: order?.specialnote,
        },
        delivery: {
          id: order?.delivery?.id,
          deliveryTypeId: selectedDeliveryType?.deliveryTypeId,
          price: selectedDeliveryType?.price,
          state: selectedDeliveryType?.state,
          name: selectedDeliveryType?.locationname,
        },
        createdById: order?.createdbyuserid,
        products: productArray,
        deleteArray: deletedOrders,
      };

      console.log('final kitchen payload is', kitchen_payload);
      dispatch(updateOrderById(id, kitchen_payload, orderDate)).then(result => {
        if (result) {
          setIsEditMode(false);
          showSuccessDialog(false);
          setDeletedOrders([]);
        }
      });
    });
  };
  const displaySubmitButton = () => {
    return (
      <>
        {isEditMode ? (
          <TouchableOpacity
            onPress={sendPatchRequest}
            style={{
              marginTop: 5,
              justifyContent: 'center',
              marginBottom:
                keyboardHeight > 0 ? (Platform.OS == 'ios' ? 270 : 100) : 20,
              backgroundColor: COLOURS.blue,
              height: 50,
              borderRadius: 10,
              marginHorizontal: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
              Submit
            </Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const displaySpecialNoteSubmitButton = () => {
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

  const handleClickEvent = item => {
    // console.log('item clicked is ', item);
    if (item == 'edit') {
      setIsEditMode(!isEditMode);
    } else if (item == 'delete') {
      handleDeleteOrders();
    } else if (item == 'fulfillOrder') {
      displayFulfillAllDialog();
    } else if (item == 'reschedule') {
      if (!order.isfulfilled) {
        toggleDateModal();
      } else {
        alert('Sorry you cannot modify a completed order');
      }
    }
  };
  //const [mobileNumber, setMobileNumber] = useState('');
  //const [bodySMS, setBodySMS] = useState('');

  const initiateSMS = () => {
    let message = `Your order on Gourmet twist has been dispatched by ${selectedRider?.name} (${selectedRider?.phonenumber})`;
    SendSMS.send(
      {
        // Message body
        body: message,
        // Recipients Number
        recipients: [phoneNumber],
        // An array of types
        // "completed" response when using android
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled, error) => {
        if (completed) {
          console.log('SMS Sent Completed');
          alert('SMS sent successfully');
        } else if (cancelled) {
          console.log('SMS Sent Cancelled');
          alert('SMS sending cancelled');
        } else if (error) {
          console.log('Some error occured');
          alert('Unable to send SMS');
        }
      },
    );
  };
  const displayFulfillAllDialog = () => {
    let count = order?.products.length;
    let msg;
    if (count > 1) {
      msg = 'items';
    } else {
      msg = 'item';
    }
    Alert.alert(
      'Alert',
      `Do you want to fulfill ${order?.products.length} ${msg} in this order?`,
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsLoadingUpdateAllOrderItems(true);
            dispatch(updateOrderAllItemsByOrderId(data?.id, orderDate)).then(
              result => {
                if (result) {
                  setIsLoadingUpdateAllOrderItems(false);
                  showSuccessDialog(true);
                }
              },
            );
          },
        },
      ],
      {cancelable: true},
    );
  };

  const displayRescheduleDialog = () => {
    var payload = {
      createdAt: dateData,
      updatedAt: dateData,
      originalDate: order?.createdat,
    };
    Alert.alert(
      'Alert',
      `Do you want to reschedule this order to ${moment(dateData).format(
        'LL',
      )}?`,
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () =>
            dispatch(rescheduleOrderDateById(id, payload)).then(result => {
              if (result) {
                showSuccessDialog(true);
              }
            }),
        },
      ],
      {cancelable: true},
    );
  };

  const renderDatePicker = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        title={'Select a reschedule date for this order'}
        theme={'auto'}
        date={selectedOrderDate || new Date()}
        //minimumDate={subtractOneDayFromTime(new Date(), 1)}
        onConfirm={date => {
          console.log('date result', date);
          setOpen(false);
          dateData = date;
          //setSelectedOrderDate(date);
          displayRescheduleDialog();
        }}
        onCancel={() => {
          setOpen(false);
          //setSelectedOrderDate('');
        }}
      />
    );
  };

  const toggleDateModal = () => {
    //console.log('opened');
    setOpen(!open);
  };
  const handleDeleteOrders = () => {
    // console.log('delete clicked');
    Alert.alert(
      'Alert',
      `Do you want to delete this order?`,
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () =>
            dispatch(deleteOrderById(id, orderDate)).then(result => {
              if (result.isSuccessful) {
                showSuccessDialog(true);
              }
            }),
        },
      ],
      {cancelable: true},
    );
  };

  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Order updated successfully'}
    />
  );

  const showSuccessDialog = (shouldDismiss = false) => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);

      shouldDismiss ? navigation.goBack() : null;
    }, DIALOG_TIMEOUT);
  };

  const handlePatchDisptach = rider => {
    //console.log('Patch dispatch');
    setHasPatchedDispatch(false);
    let payload = {
      riderId: rider?.id,
    };
    console.log('payload dispatch', payload);
    dispatch(updateOrderDispatchByOrderId(order?.id, payload)).then(result => {
      if (result) {
        setHasPatchedDispatch(true);
      }
    });
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Order Details"
            shouldDisplayBackArrow={true}
            shouldDisplayDeleteSettings
            onClose={() =>
              isEditMode ? setIsEditMode(false) : navigation.goBack()
            }
            handleClick={handleClickEvent}
          />
          {renderSuccessModal()}
          {renderBottomSheets()}
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              hasDataLoaded ? (
                <>
                  {renderDatePicker()}
                  {renderDetails()}
                  {renderCheckout()}
                  <View style={{marginBottom: !isEditMode ? 40 : 0}} />
                  {isEditMode ? displaySubmitButton() : null}
                  <View style={{marginTop: isEditMode ? 20 : 0}} />
                </>
              ) : null
            }
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={isLoadingUpdateAllOrderItems} />
          <LoaderShimmerComponent isLoading={updateOrderLoading} />
          <LoaderShimmerComponent isLoading={deleteAllOrdersLoading} />
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
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    //right: deviceWidth * 0.09,
  },
  image: {
    width: wp(116),
    height: wp(116),
  },
  imageText: {
    color: COLOURS.labelTextColor,
    marginTop: 20,
    textAlign: 'center',
    paddingLeft: wp(15),
    paddingRight: wp(15),
    fontSize: 12,
  },
  basketView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: deviceWidth,
    //paddingHorizontal: 30,
  },
  basketCountView: {
    //fontWeight: "bold",
    flex: 1,
    alignSelf: 'center',
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    left: 13,
  },
  imageContainer: {
    width: deviceWidth,
    height: deviceHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLOURS.white,
    top: -10,
  },

  deliverySheetview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignContent: 'center',
  },
  actions: {
    justifyContent: 'center',
    //height: hp(65),
    alignItems: 'flex-start',
  },
  actiontext: {
    fontSize: fp(13),
    //lineHeight: hp(19),
    color: COLOURS.labelTextColor,
    fontWeight: 'bold',
    left: deviceWidth * 0.07,
    marginTop: 10,
  },
  cbox: {
    //minHeight: hp(77),
    marginLeft: deviceWidth * 0.02,
    borderRadius: hp(12),
  },
  checkheader: {
    flexDirection: 'row',
    paddingLeft: deviceWidth * 0.07,
    paddingVertical: 20,
    backgroundColor: COLOURS.white,
    borderBottomColor: COLOURS.lightGray,
    borderTopColor: COLOURS.lightGray,
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
  },

  citem: {
    width: deviceWidth / 2.5,
    fontSize: 12,
    color: COLOURS.labelTextColor,
  },
  cothers: {
    width: deviceWidth / 3.5,
    fontSize: 12,
    color: COLOURS.labelTextColor,
    //lineHeight: hp(15),
  },
  spaceBetweenInputs: {marginTop: 16},
  productView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: 50,
    backgroundColor: COLOURS.lightGray5,
    borderColor: COLOURS.lightGray2,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  productText: {
    fontSize: fp(15),
    alignSelf: 'center',
    paddingLeft: 16,
    color: COLOURS.textInputColor,
  },
  quantityView: {
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    left: -16,
  },
  deleteItemBasketView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 0.3,
  },
  deliveryPrice: {
    fontWeight: 'bold',
    //width: deviceWidth / 4,
    alignSelf: 'center',
    //flex: 0.3,
    fontSize: fp(15),
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
    paddingVertical: 10,
  },
  dispatchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 13,
    //borderBottomWidth: 0.4,
    //borderTopColor: COLOURS.lightGray,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
    paddingBottom: 15,
  },
  grandTotalText: {
    color: COLOURS.textInputColor,
    alignSelf: 'center',
    fontSize: fp(15),

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
  sendSmsView: {
    height: hp(35),
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: COLOURS.lightGray,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: COLOURS.lightShadeBlue,
  },
});

//make this component available to the app
export default OrderDetailsScreen;
