//import liraries
import React, {Component, useState, useEffect, useRef} from 'react';
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
  dismissLoader,
  dismissTextInput,
  formatNumberComma,
  showBottomSheet,
  showLoader,
} from '../../utils/utils';
import {BackViewMoreSettings} from '../../components/Header';
import useKeyboardHeight from 'react-native-use-keyboard-height';

import {getAllProducts, getAllZupaProducts} from '../../store/actions/products';
import {BottomSheetProductComponent} from '../../components/BottomSheetComponent';
import QuantityProductComponent from '../../components/QuantityProductComponent';
import {ACTIVE_OPACITY, DIALOG_TIMEOUT} from '../../utils/Constants';
import AvertaBold from '../../components/Text/AvertaBold';
import Averta from '../../components/Text/Averta';
import LoaderButtonComponent from '../../components/LoaderButtonComponent';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {IMAGES} from '../../utils/Images';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {createOrder} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import { createSet, getAllSets } from '../../store/actions/sets';

// create a component
const NewSetScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [setName, setSetName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [issetNameFieldFocused, setIssetNameFieldFocused] = useState(false);
  const [isAddressFieldFocused, setAddressFieldFocused] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const productSheetRef = useRef();
  const submitOrderRef = useRef();
  const phoneNumberRef = useRef();
  const addressRef = useRef();
  const setNameRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState({});
  const {products, productsLoading} = useSelector(state => state.products);
  var productsData = Object.assign([], products);
  const [quantity, setQuantity] = useState(1);
  const keyboardHeight = useKeyboardHeight();
  const [filteredProductData, setFilteredProductsData] = useState(productsData);
  const [productInputValue, setProductInputValue] = useState('');
  const [isProductSelected, setIsProductSelected] = useState(false);
  var basketArray = [];
  const [newBasketArray, setNewBasketArray] = useState(basketArray);
  const {createSetsLoading} = useSelector(x => x.sets);

  useEffect(() => {
    dispatch(getAllProducts('', 0, 0, null));
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
        if (selectedProduct?.id === order?.selectedProduct?.id) {
          isProductExisting = true;
          alert(
            'You already have this in your cart',
          );
          setIsProductSelected(false);
          return;
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

  const handleSingleItemPress = async item => {
    console.log('clicked item is ', item);
    setSelectedProduct(item);
    setIsProductSelected(true);
    setProductInputValue('');
    dismissBottomSheetDialog(productSheetRef);
  };

  const handleRefreshIncaseOfNetworkFailure = () => {
    dispatch(getAllProducts('', 0, 0, null));
  };

  const renderProductBottomSheet = () => {
    return (
      <BottomSheetProductComponent
        sheetRef={productSheetRef}
        handleRefresh={handleRefreshIncaseOfNetworkFailure}
        isProductLoading={productsLoading}
        filteredDataSource={filteredProductData}
        dataSource={
          productInputValue.length > 0 ? filteredProductData : products
        }
        closeAction={handleCloseActionProduct}
        handleSingleItemPress={handleSingleItemPress}
        //addProductPress={addProductPress}
        inputValue={productInputValue}
        handleSearchInputSubmit={handleProductSubmitSearchext}
        handleInputSearchText={handleProductInputSearchText}
        // handleAddProduct={createNewProduct}
      />
    );
  };

  const handleCloseActionProduct = () => {
    setProductInputValue('');
    dismissBottomSheetDialog(productSheetRef);
  };
  
  const handleProductSubmitSearchext = text => {
    console.log('submit text', productInputValue);
    //dispatch(ProductActions.searchAllBaseProducts(text, 400, 0));
  };

  const handleProductInputSearchText = text => {
    if (text) {
      products.sort((a, b) => {
        if (b.name > a.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
      });
      const newData = products?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredProductsData(newData);
      setProductInputValue(text);
    } else {
      setFilteredProductsData(products);
      setProductInputValue(text);
    }
  };

  const renderInputFields = () => {
    return (
      <>
        <View style={[styles.actions, {paddingVertical: 13}]}>
          <ProductSansBold style={styles.actiontext}>SET NAME</ProductSansBold>
        </View>

        <TextInputComponent
          placeholder={'Enter Set Name'}
          handleTextChange={text => setSetName(text)}
          defaultValue={setName}
          returnKeyType={'next'}
          keyboardType={'default'}
          secureTextEntry={false}
          refValue={setNameRef}
          capitalize={'sentences'}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          //refValue={setNameRef}
          props={
            issetNameFieldFocused
              ? {borderColor: COLOURS.blue}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => {
            setIssetNameFieldFocused(true);
          }}
          handleBlur={() => {
            setIssetNameFieldFocused(false);
          }}
          onSubmitEditing={event => {}}
        />
        <View style={[styles.actions, {paddingVertical: 13}]}>
          <ProductSansBold style={styles.actiontext}>
            SELECT PRODUCTS
          </ProductSansBold>
        </View>

        <TouchableOpacity
          onPress={handleLoadProductsBottomSheet}
          style={[styles.productView, {marginHorizontal: deviceWidth * 0.065}]}
          activeOpacity={ACTIVE_OPACITY}>
          <AvertaBold style={[styles.productText, {flex: 1}]} numberOfLines={2}>
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

        <View style={[styles.spaceBetweenInputs, {marginTop: 10}]} />

        {/* Auto add selected product to cart */}

        {isProductSelected ? addDetailsToOrderSummary() : null}

        <View style={[styles.spaceBetweenInputs, {marginTop: 10}]} />

        {/* order summary section */}

        {newBasketArray.length > 0 ? (
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
        ) : (
          <>
            <ProductSansBold
              style={[styles.actiontext, {fontSize: 12, marginTop: 10}]}>
              SET SUMMARY
            </ProductSansBold>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('../../assets/images/noproduct.png')}
              />
              <Averta style={styles.imageText}>
                Set List is empty, add products to make a set
              </Averta>
            </View>
          </>
        )}

        <View style={[styles.spaceBetweenInputs, {marginTop: 20}]} />
        {displaySubmitButton()}
      </>
    );
  };

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
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          Create Set
        </Text>
      </TouchableOpacity>
    );
  };

  const handleAddProduct = async () => {
    requestAnimationFrame(() => {
      if (!setName) {
        alert('Set name is required');
        return;
      }

      if (!selectedProduct) {
        alert('Please select a product');
        return;
      }

      var productArray = [];
      newBasketArray.map((data, i) => {
        //console.log('dddd', data);
        var item = {
          productid: data?.selectedProduct?.baseProductId,
          productname: data?.selectedProduct?.name.trim(),
          quantity: 1,
          price: data?.selectedProduct?.unitPrice,
          productsize: data?.selectedProduct?.categorySize?.name.trim(),
        };
        productArray.push(item);
      });

      const orderPayload = {
        name: setName,
        products: productArray,
      };

      console.log('order payload', orderPayload);

      dispatch(createSet(orderPayload))
        .then(response => {
          //console.log("inside result", response);
          if (response) {
            showSuccessDialog();
            dispatch(getAllSets());
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
    setSetName('');
    setSelectedProduct({});
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
    setNewBasketArray(
      newBasketArray.filter(
        item => item?.selectedProduct?.id !== order?.selectedProduct?.id,
      ),
    );
  };
  const renderBasket = ({item, index}) => {
    //console.log("render Item is ", item, index);
    //console.log('data is ', newBasketArray);

    return (
      <View style={styles.basketContainer} key={item?.selectedProduct?.id}>
        <TouchableOpacity
          style={styles.productMainView}
          activeOpacity={ACTIVE_OPACITY}>
          <Averta style={styles.productNameText} numberOfLines={4}>
            {item ? item?.selectedProduct?.name.trim() : ''}
          </Averta>

          {/* <QuantityProductComponent
            style={{marginLeft: 15}}
            item={item}
            sendValue={value => handleqty(value, item)}
          /> */}

          <AvertaBold style={styles.unitPriceText}>
            {item
              ? formatNumberComma(
                  item?.selectedProduct?.unitPrice * item?.quantity,
                )
              : ''}
          </AvertaBold>

          <View style={styles.deleteItemBasketView}>
            <DataTable>
              {
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteFromOrderBasket(item)}>
                  {/* <IMAGES.svgCancel width={wp(11)} height={wp(11)} /> */}
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
    dismissTextInput(setNameRef);
    showBottomSheet(productSheetRef);
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Create Set"
            onClose={() => navigation.goBack()}
          />
          {renderSuccessModal()}
          {renderProductBottomSheet()}
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderInputFields()}
            renderItem={null}
            //keyExtractor={item => Date.now()}
          />
          <LoaderShimmerComponent isLoading={createSetsLoading} />
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
    flex: 1,
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
  basketContainer: {
    flexDirection: 'row',
    height: deviceHeight / 13,
    width: deviceWidth,
    backgroundColor: COLOURS.white,
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
export default NewSetScreen;
