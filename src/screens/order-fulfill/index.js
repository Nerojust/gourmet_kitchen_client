//import liraries
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {DismissKeyboard} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import {deviceWidth, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import ProductSansBold from '../../components/Text/ProductSansBold';
import TextInputComponent from '../../components/TextInputComponent';
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';
import {
  getAllOrderedProducts,
  getAllOrderedProductsStatsById,
  updateOrderListProductCount,
  updateOrderProductById,
  updateSurplusStatusForOrderItemById,
} from '../../store/actions/orders';
import {
  createSurplus,
  getAllSurplus,
  updateSurplusById,
} from '../../store/actions/surplus';
import {getDateWithoutTime} from '../../utils/DateFilter';

// create a component
const OrderFulfillScreen = ({navigation, route}) => {
  //console.log('bread details', route.params.bread);
  const [ovenCount, setOvenCount] = useState();
  const [pendingCount, setPendingCount] = useState('0');
  const [surplusCount, setSurplusCount] = useState('0');
  const [isOvenCountFocused, setIsOvenCountFocused] = useState(false);
  const [hasDateLoaded, setHasDateLoaded] = useState(false);
  const dispatch = useDispatch();
  const ovenCountRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [fulfillFromSurplus, setFulfillFromSurplus] = useState(false);
  const {
    isOrderUpdated,
    updateOrderLoading,
    selectedOrderStatus,
    ordersLoading,
    isOrderProductUpdated,
    updateSurplusOrderLoading,
    orderDate,
  } = useSelector(x => x.orders);
  //console.log('count item', countItem);
  var orderProduct = route?.params?.item;
  var selectedOrderDate = route.params.date;
  //console.log("dddd",selectedOrderDate)
  //console.log('route.params.brea item', route.params.bread);
  const [foundSurplus, setFoundSurplus] = useState();

  const {surplus, surplusLoading, updateSurplusLoading, createSurplusLoading} =
    useSelector(x => x.surplus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //console.log('surplus in breadlist ', surplus.length);

  useEffect(() => {
    if (orderProduct?.id) {
      fetchAllData();
    }
  }, [orderProduct?.id]);

  const fetchAllData = () => {
    dispatch(getAllSurplus(getDateWithoutTime(selectedOrderDate)));
  };

  useEffect(() => {
    if (surplus) {
      let fSurplus = surplus.find(
        item => item.productid == orderProduct?.productid,
      );
      if (fSurplus) {
        console.log('found the surplus', fSurplus);
      }
      setFoundSurplus(fSurplus);
    }
  }, [surplus]);

  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Order List Updated Successfully'}
    />
  );

  const resetFields = () => {
    setPendingCount('0');
    setOvenCount('');
  };

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.goBack();
    }, DIALOG_TIMEOUT);
  };

  const handleSubmit = (shouldUseSurplusTofulfill = false) => {
    console.log('submit clicked');
    if (!foundSurplus && !ovenCount) {
      alert('Oven count is required');
      return;
    }
    if ((!foundSurplus && ovenCount.length < 1) || ovenCount == '0') {
      alert('Oven count must be greater than zero');
      return;
    }
    //=============If surplus exists===============
    let remainSurplusCount;
    let countTofulfill;
    if (foundSurplus && shouldUseSurplusTofulfill) {
      if (foundSurplus?.count >= orderProduct?.quantity) {
        remainSurplusCount = foundSurplus?.count - orderProduct?.quantity;
        console.log(
          'SURPLUS IS GREATER THAN REQUIRED COUNT',
          remainSurplusCount,
        );
        countTofulfill = orderProduct?.quantity;
      } else if (
        foundSurplus.count < orderProduct?.quantity &&
        orderProduct?.quantity > 0
      ) {
        remainSurplusCount = orderProduct?.quantity - foundSurplus?.count;
        console.log(
          'REQUIRED COUNT IS GREATER THAN SURPLUS',
          remainSurplusCount,
        );
        countTofulfill = foundSurplus?.count;
      }
    }
    var payload = {
      quantityToFulfill: parseInt(ovenCount),
      surplusCount,
    };

    var surplusPayload = {
      quantityToFulfill: countTofulfill,
      surplusCount,
      wasFulfilledFromSurplus: shouldUseSurplusTofulfill,
    };

    dispatch(
      updateOrderProductById(
        orderProduct?.id,
        foundSurplus && shouldUseSurplusTofulfill ? surplusPayload : payload,
        orderProduct.orderid,selectedOrderDate
      ),
    ).then(result => {
      if (result) {
        resetFields();
        showSuccessDialog();
      }
    });
  };

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleSubmit}
        style={{
          marginTop: 5,
          justifyContent: 'center',
          backgroundColor: COLOURS.zupaBlue,
          height: 50,
          borderRadius: 10,
          marginHorizontal: 20,
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text
          style={{color: COLOURS.white, fontSize: fp(15), fontWeight: '700'}}>
          Fullfill Item
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.customerNameView}>
            <ProductSansBold style={[styles.actiontext, {left: 0}]}>
              CATEGORY
            </ProductSansBold>

            <Averta style={styles.custName} numberOfLines={5}>
              {orderProduct?.category}
            </Averta>
          </View>
          <View style={[styles.customerNameView, {left: -30}]}>
            <ProductSansBold style={[styles.actiontext, {left: 0}]}>
              SIZE
            </ProductSansBold>

            <Averta style={styles.custName} numberOfLines={5}>
              {orderProduct?.productsize}
            </Averta>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <View style={[styles.customerNameView, {flex: 1}]}>
            <ProductSansBold style={[styles.actiontext, {left: 0}]}>
              TOTAL NEEDED
            </ProductSansBold>

            <Averta style={styles.custName} numberOfLines={5}>
              {orderProduct?.quantity?.toString()}
            </Averta>
          </View>

          {foundSurplus ? (
            <View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  foundSurplus ? displayChooseDialog() : handleSubmit(false)
                }
                style={{
                  //marginTop: 5,
                  justifyContent: 'center',
                  backgroundColor: COLOURS.zupaBlue,
                  height: 40,
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  alignItems: 'center',
                  flex: 0.6,
                  //left: 50,
                }}>
                <Text
                  style={{
                    color: COLOURS.white,
                    fontSize: fp(12),
                    fontWeight: '700',
                  }}>
                  Fulfill from surplus
                </Text>
              </TouchableOpacity>

              <View style={[styles.customerNameView, {flex: 1}]}>
                <ProductSansBold style={[styles.actiontext, {left: 0}]}>
                  SURPLUS FOUND
                </ProductSansBold>

                <Averta style={styles.custName} numberOfLines={5}>
                  {foundSurplus.count.toString()}
                </Averta>
              </View>
            </View>
          ) : null}
        </View>
        {/* <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            PENDING
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {parseInt(pendingCount) < 0 ? '0' : parseInt(pendingCount)}
          </Averta>
        </View> */}

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            IN OVEN
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {(ovenCount && ovenCount.toString()) || '0'}
          </Averta>
        </View>
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            SURPLUS
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {surplusCount || '0'}
          </Averta>
        </View>
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            OVEN COUNT
          </ProductSansBold>

          <TextInputComponent
            placeholder={'Enter Oven Count'}
            handleTextChange={handleOvenChange}
            defaultValue={ovenCount}
            returnKeyType={'next'}
            editable={!foundSurplus ? true : false}
            keyboardType={'default'}
            secureTextEntry={false}
            capitalize={'sentences'}
            heightfigure={50}
            widthFigure={deviceWidth / 1.15}
            refValue={ovenCountRef}
            props={
              isOvenCountFocused
                ? {borderColor: COLOURS.blue}
                : {borderColor: COLOURS.zupa_gray_bg}
            }
            handleTextInputFocus={() => {
              setIsOvenCountFocused(true);
            }}
            handleBlur={() => {
              setIsOvenCountFocused(false);
            }}
            onSubmitEditing={event => {}}
          />
        </View>
      </View>
    );
  };
  const displayChooseDialog = () => {
    let countTofulfill;

    if (foundSurplus.count >= parseInt(ovenCount)) {
      countTofulfill = parseInt(ovenCount);
    } else if (
      foundSurplus.count < parseInt(ovenCount) &&
      parseInt(ovenCount) > 0
    ) {
      countTofulfill = foundSurplus.count;
    }

    Alert.alert(
      'Alert',
      `Surplus available: ${foundSurplus.count} pieces \nRequired: ${orderProduct?.quantity} pieces`,
      [
        {
          text: `Fulfil`,
          onPress: () => handleSubmit(true),
        },

        {
          text: 'Cancel',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleOvenChange = text => {
    if (text) {
      setOvenCount(text);
      setPendingCount(orderProduct?.quantity - text);
      if (orderProduct?.quantity - text < 0) {
        console.log('surplus is ', text - orderProduct?.quantity);
        setSurplusCount(text - orderProduct?.quantity);
      } else {
        setSurplusCount('0');
      }
    } else {
      setPendingCount('0');
      setOvenCount('');
      setSurplusCount('');
    }
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            shouldDisplayBackArrow={true}
            backText={route?.params?.item?.name || 'Fulfill Item'}
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              <>
                {renderDetails()}
                {!foundSurplus ? displaySubmitButton() : null}
                {renderSuccessModal()}
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={ordersLoading} />
          <LoaderShimmerComponent isLoading={surplusLoading} />
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
    paddingTop: 5,
    paddingBottom: 12,
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
export default OrderFulfillScreen;
