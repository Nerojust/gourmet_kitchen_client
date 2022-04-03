//import liraries
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import TextInputComponent from '../../components/TextInputComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import ProductSansBold from '../../components/Text/ProductSansBold';

import {COLOURS} from '../../utils/Colours';
import {DataTable} from 'react-native-paper';
import {
  deviceHeight,
  deviceWidth,
  fp,
  hp,
  wp,
} from '../../utils/responsive-screen';
import {
  dismissBottomSheetDialog,
  DismissKeyboard,
  dismissTextInput,
  formatNumberComma,
  removeDuplicatesFromArray,
  showBottomSheet,
  validateNumber,
} from '../../utils/utils';
import {BackViewMoreSettings} from '../../components/Header';
import useKeyboardHeight from 'react-native-use-keyboard-height';

import {getAllProducts, syncZupaProducts} from '../../store/actions/products';
import {
  BottomSheetDeliveryTypesComponent,
  BottomSheetProductComponent,
  BottomSheetZupaAssociateProductComponent,
} from '../../components/BottomSheetComponent';
import QuantityProductComponent from '../../components/QuantityProductComponent';
import {ACTIVE_OPACITY, DIALOG_TIMEOUT, NAIRA} from '../../utils/Constants';
import AvertaBold from '../../components/Text/AvertaBold';
import Averta from '../../components/Text/Averta';
import {useDispatch,useSelector} from 'react-redux';
import {IMAGES} from '../../utils/Images';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {createOrder, createZupaOrder} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import GoogleSearchComponent from '../../components/GoogleSearchComponent';
import BlinkingTextComponent from '../../components/BlinkingTextComponent';
import {getAllSets} from '../../store/actions/sets';
import {
  getAllDeliveryTypes,
  getDeliveryStates,
} from '../../store/actions/delivery-types';
import ProductSans from '../../components/Text/ProductSans';

// create a component
const NewOrderScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isFullNameFieldFocused, setIsFullNameFieldFocused] = useState(false);
  const [isAddressFieldFocused, setAddressFieldFocused] = useState(false);
  const [
    isAddressDescriptionFieldFocused,
    setIsAddressDescriptionFieldFocused,
  ] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const productSheetRef = useRef();
  const zupaProductAssociateSheetRef = useRef();
  const submitOrderRef = useRef();

  const fullNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const deliverySheetRef = useRef();
  const addressRef = useRef(null);
  const additionalAddressDescriptionRef = useRef(null);
  const specialNoteRef = useRef(null);
  const [specialNote, setSpecialNote] = useState('');

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
  const keyboardHeight = useKeyboardHeight();
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

  useEffect(() => {
    dispatch(getAllSets());
    dispatch(getAllProducts('', 0, 0));
  }, []);

  useEffect(() => {
    dispatch(getAllDeliveryTypes('')).then(result => {
      if (result.data) {
        //console.log('delivery==', result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (sets && sets.length > 0) {
      sets.forEach(async (item, i) => {
        let newObject = {};
        item.type = 'custom';
        // console.log('item', item.name);

        newObject.name = item.name;
        newObject.products = [item];

        if (newObject) {
          additionalArray.push(newObject);
        }
      });
      // console.log('new object', additionalArray);
      setMergedArrayProducts([...additionalArray, ...products]);
      setFilteredProductsData([...additionalArray, ...products]);
    } else {
      setMergedArrayProducts(products);
    }
  }, [sets]);

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

  var deliveryTypesData = Object.assign([], mainDeliveryArray);
  const [filteredDeliveryTypesData, setFilteredDeliveryTypesData] =
    useState(deliveryTypesData);

  useEffect(() => {
    dispatch(getDeliveryStates(''));
  }, []);

  const addDetailsToOrderSummary = () => {
    if (selectedProduct?.name != null) {
      //console.log("selected", selectedProduct);
      var object = {
        selectedProduct,
        quantity,
      };
      //console.log("product found", object);
      let isProductExisting = false;
      //console.log("basket", basketArray, newBasketArray.length);
      newBasketArray.map(order => {
        //"orderid", order;
        if (selectedProduct.type != 'custom') {
          if (selectedProduct?.id === order?.selectedProduct?.id) {
            isProductExisting = true;
            alert(
              'You already have this in your cart, please update the quantity',
            );
            setIsProductSelected(false);
            return;
          }
        } else {
          if (selectedProduct?.name === order?.selectedProduct?.name) {
            isProductExisting = true;
            alert('You already have this in your cart');
            setIsProductSelected(false);
            return;
          }
        }
      });
      if (!isProductExisting) {
        basketArray.push(object);
        setNewBasketArray([...newBasketArray, ...basketArray]);
        setIsProductSelected(false);
      }
    } else {
      console.log('no product found', selectedProduct);
      setIsProductSelected(false);
      alert('Please select a product');
    }
    setQuantity(1);
    setSelectedProduct({});
    setIsProductSelected(false);
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
      setSelectedDelivery(item);
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

  const handleLoadDeliveryBottomSheet = () => {
    dismissTextInput(fullNameRef);
    dismissTextInput(phoneNumberRef);
    dismissTextInput(specialNoteRef);
    dismissTextInput(additionalAddressDescriptionRef);
    showBottomSheet(deliverySheetRef);

    // dispatch(getAllDeliveryTypes());
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleDeliveryModal = () => {
    setIsDeliveryModalVisible(!isDeliveryModalVisible);
  };
  const handleCloseActionProduct = () => {
    setProductInputValue('');
    setFilteredProductsData([]);
    dismissBottomSheetDialog(productSheetRef);
    dismissBottomSheetDialog(zupaProductAssociateSheetRef);
  };
  const handleProductSubmitSearchext = text => {
    console.log('submit text', productInputValue);
    //dispatch(ProductActions.searchAllBaseProducts(text, 400, 0));
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
        <View style={styles.spaceBetweenInputs} />

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
        />
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

        {newBasketArray.length > 0 ? (
          <>
            <View style={{flexDirection: 'row'}}>
              <DataTable>
                <DataTable.Header>
                  <View style={styles.basketView}>
                    <ProductSansBold style={styles.basketCountView}>
                      {newBasketArray && newBasketArray.length > 1
                        ? newBasketArray.length + ' ITEMS'
                        : newBasketArray.length + ' ITEM'}
                    </ProductSansBold>
                  </View>
                </DataTable.Header>

                <FlatList
                  data={newBasketArray}
                  keyExtractor={item => item?.selectedProduct?.id}
                  renderItem={renderBasket}
                  //extraData={isProductSelected}
                />
              </DataTable>
            </View>

            {/* line divider */}
            <View style={styles.dividerLine} />

            {/* delivery view section */}
            <TouchableOpacity
              style={[styles.deliverySheetview]}
              activeOpacity={1}
              onPress={handleLoadDeliveryBottomSheet}>
              
              <TouchableOpacity
                onPress={handleLoadDeliveryBottomSheet}
                style={[
                  styles.productView,
                  {
                    width: deviceWidth / 2.7,
                    flex: 0.7,
                    marginLeft: 5,
                  },
                ]}
                activeOpacity={ACTIVE_OPACITY}>
                <ProductSans
                  style={[styles.productText, {flex: 1}]}
                  numberOfLines={1}>
                  {selectedDelivery?.name
                    ? selectedDelivery?.name
                    : 'Select delivery'}
                </ProductSans>
                <FontAwesome
                  name="angle-down"
                  size={hp(20)}
                  color={COLOURS.gray}
                  style={{marginRight: 15, flex: 0.1}}
                />
              </TouchableOpacity>

        
                <AvertaBold style={styles.deliveryPrice}>
                  {selectedDelivery?.price
                    ? formatNumberComma(selectedDelivery?.price)
                    : null}
                </AvertaBold>
         
            </TouchableOpacity>

            {newBasketArray[0]?.selectedProduct?.type != 'custom' ? (
              <View style={[styles.grandTotalview]}>
                <AvertaBold style={[styles.grandTotalText, {flex: 2}]}>
                  Grand Total
                </AvertaBold>

                <AvertaBold
                  style={[styles.calculatedAmountText, {flex: 0.9, right: 0}]}>
                  {NAIRA + calculateAmount()}
                </AvertaBold>
              </View>
            ) : null}
          </>
        ) : (
          <>
            <ProductSansBold
              style={[styles.actiontext, {fontSize: 12, marginTop: 10}]}>
              ORDER SUMMARY
            </ProductSansBold>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('../../assets/images/noproduct.png')}
              />
              <Averta style={styles.imageText}>
                Cart is empty, add products now
              </Averta>
            </View>
          </>
        )}

        <View style={[styles.spaceBetweenInputs, {marginTop: 20}]} />
        {displaySubmitButton()}
      </>
    );
  };

  const calculateAmount = useCallback(() => {
    var amount = 0;

    for (let i = 0; i < newBasketArray.length; i++) {
      const item = newBasketArray[i];
      amount = amount + item?.selectedProduct?.unitPrice * item?.quantity;
    } //console.log("Total order amount is ", amount);

    var result = 0;

    if (selectedDelivery && selectedDelivery?.price) {
      result = amount + selectedDelivery?.price;
    } else {
      result = amount;
    }

    return formatNumberComma(result);
  });

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={handleAddProduct}
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
        <Text style={{color: COLOURS.white, fontSize: 14,fontWeight: '700'}}>
          Submit
        </Text>
        {/* <LoaderButtonComponent
          buttonRef={submitOrderRef}
          title={'Submit Order'}
          method={handleAddProduct}
        /> */}
      </TouchableOpacity>
    );
  };

  const handleAddProduct = async () => {
    requestAnimationFrame(() => {
      if (!fullName) {
        alert('Customer name is required');
        return;
      }
      if (!phoneNumber) {
        alert('Phone number is required');
        return;
      }
      if (!validateNumber(phoneNumber)) {
        alert('Enter a valid phone number');
        return;
      }
      if (!address) {
        alert('Address is required');
        return;
      }
      if (!selectedProduct) {
        alert('Please select a product');
        return;
      }
      if (!quantity) {
        alert('Quantity is required');
        return;
      }
      if (newBasketArray.length == 0) {
        alert('Please select a product');
        return;
      }

      if (!selectedDelivery.id) {
        alert('Please select a delivery type');
        //setIsDeliveryModalVisible(true)
        return;
      }
      //prepare zupa payload
      const customerPayload = {
        name: fullName,
        phoneNumber: phoneNumber,
        address,
        addressDescription: additionalAddressDescription,
      };

      const orderPayload = {
        customerId: null,
        deliveryTypeId: selectedDelivery?.id,
        deliveryLocation: {
          address: address,
          latitude: '6.430118879280349',
          longitude: '3.4881381695005618',
        },
        discountType: 'amount',
        discountValue: null,
        order_items: {
          add: newBasketArray.map((data, i) => {
            //console.log("map", i, data);
            return {
              productId:
                data?.selectedProduct?.type != 'custom'
                  ? data?.selectedProduct?.id
                  : data?.selectedProduct?.zupasetid,
              quantity: data?.quantity,
            };
          }),
        },
        specialNote,
      };

      //prepare zupa payload

      //prepare kitchen payload
      let kitchen_payload = {};
      let productArray = [];
      newBasketArray.map((data, i) => {
        //console.log('dddd', data);
        if (data?.selectedProduct?.type != 'custom') {
          var item = {
            id: data?.selectedProduct?.id,
            quantity: data?.quantity,
            price: data?.selectedProduct?.unitPrice,
            size: data?.selectedProduct?.categorySize?.name,
          };
          productArray.push(item);
          kitchen_payload = {
            customer: {
              name: fullName,
              phoneNumber: phoneNumber,
              address,
              addressDescription: additionalAddressDescription,
              specialNote,
            },
            delivery: {
              deliveryTypeId: selectedDelivery?.id,
              price: selectedDelivery?.price,
              state: selectedDelivery?.state,
              name: selectedDelivery?.name,
            },
            products: productArray,
          };
        } else {
          var item = {
            id: data?.selectedProduct?.id,
            quantity: data?.quantity,
            type: 'custom',
            zupasetid: data?.selectedProduct.zupasetid,
          };
          productArray.push(item);
          kitchen_payload = {
            customer: {
              name: fullName,
              phoneNumber: phoneNumber,
              address,
              addressDescription: additionalAddressDescription,
              specialNote,
            },
            type: 'custom',
            delivery: {
              deliveryTypeId: selectedDelivery?.id,
              price: selectedDelivery?.price,
              state: selectedDelivery?.state,
              name: selectedDelivery?.name,
            },
            products: productArray,
          };
        }
      });
      //console.log('customer payload', customerPayload);
      console.log('order payload', orderPayload);
      console.log('order items', orderPayload.order_items);
      console.log('kitchen payload', kitchen_payload);

      dispatch(createOrder(kitchen_payload, customerPayload, orderPayload))
        .then(response => {
          //console.log("inside result", response);
          if (response) {
            showSuccessDialog();
            resetFields();
          }
        })
        .catch(() => {
          console.log('error creating order');
        });
    });
  };
  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Order created successfully'}
      //onPressButton={() => navigation.goBack()}
    />
  );
  const resetFields = () => {
    setFullName('');
    setSpecialNote('');
    setPhoneNumber('');
    setAdditionalAddressDescription('');
    setNewBasketArray([]);
    setSelectedProduct({});
    setSelectedDelivery({});
  };

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.goBack();
    }, DIALOG_TIMEOUT);
  };

  const handleqty = (qty, item) => {
    const updatedOrders = newBasketArray.map(obj =>
      // console.log("obj",obj)
      obj?.selectedProduct?.id === item?.selectedProduct?.id
        ? {...obj, quantity: qty}
        : obj,
    );
    setNewBasketArray(updatedOrders);
    //console.log("cal", updatedOrders);
  };

  const deleteFromOrderBasket = order => {
    if (order.selectedProduct.type == 'custom') {
      let array = newBasketArray.filter(
        item => item?.selectedProduct?.id !== order?.selectedProduct?.id,
      );
      setNewBasketArray(array);
      //clear the already selected delivery type if basket is equal to zero
      if (array.length == 0) {
        setSelectedDelivery({});
      }
    } else {
      let array = newBasketArray.filter(
        item => item?.selectedProduct?.name !== order?.selectedProduct?.name,
      );
      setNewBasketArray(array);

      if (array.length == 0) {
        setSelectedDelivery({});
      }
    }
  };
  const renderBasket = ({item, index}) => {
    //console.log('render Item is ', item, index);
    //console.log('data is ', newBasketArray);

    return (
      <View style={styles.basketContainer} key={item?.selectedProduct?.id}>
        <TouchableOpacity
          style={styles.productMainView}
          activeOpacity={ACTIVE_OPACITY}>
          <Averta style={styles.productNameText} numberOfLines={4}>
            {item ? item?.selectedProduct?.name.trim() : ''}
          </Averta>
          <>
            <QuantityProductComponent
              style={{marginLeft: 15}}
              item={item}
              sendValue={value => handleqty(value, item)}
            />

            {item?.selectedProduct?.type != 'custom' ? (
              <AvertaBold style={styles.unitPriceText}>
                {item
                  ? formatNumberComma(
                      item?.selectedProduct?.unitPrice * item?.quantity,
                    )
                  : ''}
              </AvertaBold>
            ) : (
              <View style={{flex: 0.5}} />
            )}
          </>

          <View style={styles.deleteItemBasketView}>
            <DataTable>
              {
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteFromOrderBasket(item)}>
                  <Image
                    source={IMAGES.cancel}
                    style={{width: 11, height: 11}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              }
            </DataTable>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const handleLoadProductsBottomSheet = () => {
    dismissTextInput(fullNameRef);
    showBottomSheet(productSheetRef);
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="New Order"
            onClose={() => navigation.goBack()}
          />
          {renderSuccessModal()}
          {renderBottomSheets()}
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderInputFields()}
            renderItem={null}
          />
          <LoaderShimmerComponent isLoading={createOrderLoading} />
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
    backgroundColor: COLOURS.zupa_gray_bg,
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
  deliverySheetview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignContent: 'center',
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
  quantityView: {
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  imageContainer: {
    width: deviceWidth,
    height: deviceHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLOURS.white,
    top: -10,
  },
  productNameText: {
    color: COLOURS.text_color,
    alignSelf: 'center',
    flex: 0.5,
    fontSize: fp(14),
    marginLeft: 5,
  },
  calculatedAmountText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14,
    color: COLOURS.textInputColor,
    right: deviceWidth * 0.108,
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
    paddingHorizontal: 23,
    borderTopWidth: 0.4,
    borderTopColor: COLOURS.lightGray,
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
    paddingVertical: 20,
  },
  basketContainer: {
    flexDirection: 'row',
    height: deviceHeight * 0.11,
    width: deviceWidth,
    backgroundColor: COLOURS.white,
  },
  grandTotalText: {
    color: COLOURS.textInputColor,
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  unitPriceText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    flex: 0.5,
    fontSize: fp(15),
    left: wp(25),
    color: COLOURS.textInputColor,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    left: -16,
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
  productMainView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //width: deviceWidth,
    alignItems: 'center',
    marginLeft: wp(18),
    height: '100%',
    flex: 1,
  },
  deleteItemBasketView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 0.3,
  },
  productText: {
    fontSize: fp(15),
    alignSelf: 'center',
    paddingLeft: 16,
    color: COLOURS.textInputColor,
  },
});

//make this component available to the app
export default NewOrderScreen;
