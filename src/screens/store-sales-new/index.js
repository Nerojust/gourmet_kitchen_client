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
import {useDispatch, useSelector} from 'react-redux';
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
import {createSurplus} from '../../store/actions/surplus';

// create a component
const NewStoreSalesScreen = ({navigation,route}) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [surplusCount, setSurplusCount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isFullNameFieldFocused, setIsFullNameFieldFocused] = useState(false);
  const [isAddressFieldFocused, setAddressFieldFocused] = useState(false);
  const [isSurplusCountFocused, setIsSurplusCountFocused] = useState(false);
  const [
    isAddressDescriptionFieldFocused,
    setIsAddressDescriptionFieldFocused,
  ] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const productSheetRef = useRef();
  const zupaProductAssociateSheetRef = useRef();

  const fullNameRef = useRef(null);
  const surplusCountRef = useRef();
  const deliverySheetRef = useRef();
  const [specialNote, setSpecialNote] = useState('');

  const [isPhoneNumberFieldFocused, setIsPhoneNumberFieldFocused] =
    useState(false);
  const [additionalAddressDescription, setAdditionalAddressDescription] =
    useState('');
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedDelivery, setSelectedDelivery] = useState({});

  const {products, productsLoading} = useSelector(state => state.products);
  const {createSurplusLoading} = useSelector(state => state.surplus);
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
  const {deliveryTypes, deliveryStates} = useSelector(
    state => state.deliveryTypes,
  );
  let additionalArray = [];
  var finalDeliveryArray = [];
  const orderDate = route?.params?.date;
  //console.log('route date', orderDate);

  useEffect(() => {
    dispatch(getAllProducts('', 0, 0));
  }, []);

  const handleSingleItemPress = async (item, isProduct, isDelivery) => {
    //console.log('clicked item is ', item);
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
      </>
    );
  };

  const handleCloseActionProduct = () => {
    setProductInputValue('');
    setFilteredProductsData([]);
    dismissBottomSheetDialog(productSheetRef);
  };
  const handleProductSubmitSearchext = () => {
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

        <View style={[styles.actions, {paddingVertical: 13}]}>
          <ProductSansBold style={styles.actiontext}>COUNT</ProductSansBold>
        </View>
        <TextInputComponent
          placeholder={'Enter surplus count'}
          handleTextChange={text => setSurplusCount(text)}
          defaultValue={surplusCount}
          returnKeyType={'next'}
          keyboardType={'default'}
          secureTextEntry={false}
          capitalize={'sentences'}
          refValue={surplusCountRef}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          props={
            isSurplusCountFocused
              ? {borderColor: COLOURS.blue}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => {
            setIsSurplusCountFocused(true);
          }}
          handleBlur={() => {
            setIsSurplusCountFocused(false);
          }}
          onSubmitEditing={() => {}}
        />
        <View style={{paddingVertical: 13}} />
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
          marginHorizontal: 25,
          alignItems: 'center',
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
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
      if (!selectedProduct) {
        alert('Please select a product');
        return;
      }

      if (!surplusCount) {
        alert('Surplus count is required');
        return;
      }

      var payload = {
        count: parseInt(surplusCount),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        //productCategory: selectedProduct.categorySize.name,
        productSize: selectedProduct.categorySize.name,
      };
      console.log('surplus payload', payload);

      dispatch(createSurplus(payload,orderDate))
        .then((result, error) => {
          if (result) {
            showSuccessDialog(true);
            resetFields();
          }
        })
        .catch(error => {
          console.log('updadte error', error);
        });
    });
  };
  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Surplus created successfully'}
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

  const handleLoadProductsBottomSheet = () => {
    dismissTextInput(surplusCountRef);
    showBottomSheet(productSheetRef);
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="New Surplus"
            shouldDisplayBackArrow={true}
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
          <LoaderShimmerComponent isLoading={createSurplusLoading} />
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
export default NewStoreSalesScreen;
