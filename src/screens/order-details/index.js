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
  FlatList,
  Platform,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  capitalizeWord,
  dismissBottomSheetDialog,
  DismissKeyboard,
  dismissTextInput,
  formatNumberComma,
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
import {ACTIVE_OPACITY, NAIRA_} from '../../utils/Constants';
import GoogleSearchComponent from '../../components/GoogleSearchComponent';
import BlinkingTextComponent from '../../components/BlinkingTextComponent';
import {
  BottomSheetDeliveryTypesComponent,
  BottomSheetProductComponent,
} from '../../components/BottomSheetComponent';
import {getAllDeliveryTypes} from '../../store/actions/delivery-types';
import {getAllProducts} from '../../store/actions/products';
import OrderListItem from '../../components/OrderListItem';
import OrdersHelper from '../../components/OrdersHelper';
import {DataTable} from 'react-native-paper';

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
  const zupaProductAssociateSheetRef = useRef();
  const submitOrderRef = useRef();

  const fullNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const deliverySheetRef = useRef();
  const addressRef = useRef(null);
  const additionalAddressDescriptionRef = useRef(null);
  const specialNoteRef = useRef(null);

  const [isPhoneNumberFieldFocused, setIsPhoneNumberFieldFocused] =
    useState(false);
  const [additionalAddressDescription, setAdditionalAddressDescription] =
    useState('');
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedDelivery, setSelectedDelivery] = useState({});

  const {products, productsLoading} = useSelector(state => state.products);
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
  const {createOrderLoading} = useSelector(x => x.orders);
  const {sets} = useSelector(x => x.sets);
  const [mergedArrayProducts, setMergedArrayProducts] = useState(products);
  //console.log("sets",sets)
  const [mainDeliveryArray, setmainDeliveryArray] = useState([]);
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const {deliveryTypes, deliveryTypesLoading, deliveryStates} = useSelector(
    state => state.deliveryTypes,
  );
  let additionalArray = [];
  var finalDeliveryArray = [];

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
    if (id) {
      fetchAllData();
    }
  }, [id, hasAddedNewNote]);

  useEffect(() => {
    dispatch(getAllDeliveryTypes(''));
  }, []);

  const fetchAllData = () => {
    dispatch(getOrder(route?.params?.id)).then((result, error) => {
      if (result) {
        //console.log('data', result);
        setHasDataLoaded(true);
        setData(result);

        if (result) {
          setOrderItems(result?.products);
          setSelectedDeliveryType(result.delivery[0]);

          setFullName(result?.customer?.name);
          setAddress(result?.customer?.address);
          setAdditionalAddressDescription(result?.customer?.addressdescription);
          setPhoneNumber(result?.customer?.phonenumber);
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
              <TouchableOpacity onPress={null}>
                <Averta style={styles.address}>
                  {phoneNumber ? capitalizeWord(phoneNumber.trim()) : 'None'}
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
                ORDER DATE
              </ProductSansBold>
              <Averta style={styles.address}>
                {order?.createdat
                  ? moment(order?.createdat).format('LLL')
                  : 'None'}
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
              {order?.products &&
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
                  style={[
                    styles.grandTotalText,
                    {
                      color: COLOURS.labelTextColor,
                      fontWeight: '500',
                      flex: 1.06,
                    },
                  ]}>
                  {order?.delivery.length > 0
                    ? 'Delivery to:\n' + order.delivery[0]?.locationname
                    : 'Delivery Type: Walk-In'}
                </AvertaBold>

                <AvertaBold
                  style={[styles.calculatedAmountText, {right: 0, flex: 0.38}]}>
                  {order.delivery[0]?.price
                    ? NAIRA_ + formatNumberComma(order.delivery[0]?.price)
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

            <View
              style={[styles.customerNameView, {top: -20, marginBottom: 20}]}>
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
          onSubmitEditing={event => {}}
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
        orderItems?.map((order, i) => {
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
        const results = orderItems.concat({
          productId: productid,
          product: selectedProduct,
          quantity: 1,
        });
        setOrderItems(results);
        console.log('res', results);
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
    var updatedOrderItems = orderItems.filter(item => item.id !== order.id);
    setOrderItems(updatedOrderItems);
  };

  const updateItemQuantity = (qty, item) => {
    const updatedOrders = orderItems.map(obj =>
      obj.id === item.id ? {...obj, quantity: qty} : obj,
    );
    setOrderItems(updatedOrders);
  };
  const renderCheckout = () => {
    var grandTotalAmount = 0;
    if (isEditMode) {
      var _data = Object.assign({}, data);
      _data.products = orderItems;
      if (_data?.delivery) {
        _data.delivery[0].price = selectedDeliveryType?.price;
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
              {renderBottomSheets()}

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
                  {isEditMode ? (
                    <ProductSans
                      style={[styles.productText, {flex: 1}]}
                      numberOfLines={1}>
                      {selectedDeliveryType?.name ||
                      selectedDeliveryType?.locationname
                        ? selectedDeliveryType?.name ||
                          selectedDeliveryType?.locationname
                        : 'Select a delivery type'}
                    </ProductSans>
                  ) : (
                    <ProductSans
                      style={[styles.productText, {flex: 1}]}
                      numberOfLines={1}>
                      {selectedDeliveryType?.locationname
                        ? selectedDeliveryType?.locationname
                        : 'Select a delivery type'}
                    </ProductSans>
                  )}
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

  const handleSingleItemPress = async (item, isProduct, isDelivery) => {
    console.log('clicked item is ', item);
    if (isProduct) {
      setSelectedProduct(item);
      setIsProductSelected(true);
      setProductInputValue('');
      dismissBottomSheetDialog(productSheetRef);
    }
    if (isDelivery) {
      setSelectedDeliveryType(item);
      setDeliveryInputValue('');
      dismissBottomSheetDialog(deliverySheetRef);
    }
  };

  const handleRefreshIncaseOfNetworkFailure = (isProduct, isDelivery) => {
    if (isProduct) {
      dispatch(getAllProducts('', 0, 0));
    }
    if (isDelivery) {
      dispatch(getAllDeliveryTypes(''));
    }
  };
  const handleCloseActionDelivery = () => {
    setDeliveryInputValue('');
    dismissBottomSheetDialog(deliverySheetRef);
  };

  const handleAddressInputText = text => {
    //console.log("inside text is", text);
    //newAddress = text;
    setAddress(text);
  };
  const handleSearchResult = (data, details, input) => {
    console.log(details?.formatted_address, details?.geometry?.location);
    setAddress(details?.formatted_address);
    //newAddress = input;
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
    } else {
      result = amount;
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

  const handleProductSubmitSearchext = text => {
    console.log('submit text', productInputValue);
    //dispatch(ProductActions.searchAllBaseProducts(text, 400, 0));
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

  const handleEditOrder = () => {
    console.log('submit order clicked');
    setIsEditMode(!isEditMode);
    setFullName(fullName);
    setPhoneNumber(phoneNumber);
    setAddress(address);
    setAdditionalAddressDescription(additionalAddressDescription);
    setSpecialNote(specialNote);
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
      const orderId = data?.id;
      const {id} = data?.customer;
      var customerId = id;

      const customerPayload = {
        name: customerName,
        phoneNumber: phoneNumber,
        address: address,
        addressdescription: additionalAddressDescription,
      };
      //console.log("customer payload is", customerPayload);
      const orderPayload = {
        specialNote,
        order_items: {
          set: orderItems?.map(({productid, quantity}, i) => {
            return {
              productid,
              quantity,
              orderId,
            };
          }),
        },
      };
      if (selectedDeliveryType) {
        orderPayload['deliveryTypeId'] = selectedDeliveryType?.id;
      }

      if (orderItems.length > 0) {
        showLoader(loadingButtonRef);

        dispatch(
          patchOrder(
            orderId,
            customerId,
            customerPayload,
            orderPayload,
            false,
            periodType,
          ),
        ).then(result => {
          if (result) {
            // console.log("outside received", result)
            showSuccessDialog();
            setData(result);
            set_Data(result);
            setOrderItems(orderItems);
            setIsLoading(false);
            setIsEditClicked(false);

            dispatch(
              OrderActions.getAllOrders('', periodType, LIMIT_FIGURE, 0),
            );
            dispatch(OrderActions.getAllDashboardOrders('', periodType, 5, 0));
            dispatch(UserActions.getDashboardStats(periodType));
            dispatch(UserActions.getTopItemsAnalytics(periodType));
          }
        });
        dismissLoader(loadingButtonRef);
      }
    });
  };
  const displaySubmitButton = () => {
    return (
      <>
        {isEditMode ? (
          <TouchableOpacity
            onPress={handleEditOrder}
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
    console.log('item clicked is ', item);
    // if (item == 'edit') {
    //   setIsEditMode(!isEditMode);
    // }
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Order Details"
            shouldDisplayDelete
            onClose={() =>
              isEditMode ? setIsEditMode(false) : navigation.goBack()
            }
            handleClick={handleClickEvent}
          />

          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              hasDataLoaded ? (
                <>
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
    fontSize: 12,
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
    fontSize: 12,
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
