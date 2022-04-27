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
  updateSurplusStatusForOrderItemById,
} from '../../store/actions/orders';
import {
  createSurplus,
  getAllSurplus,
  updateSurplusById,
} from '../../store/actions/surplus';
import {getDateWithoutTime} from '../../utils/DateFilter';

// create a component
const BreadListDetailsScreen = ({navigation, route}) => {
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
    updateSurplusOrderLoading,
    orderDate,
  } = useSelector(x => x.orders);
  //console.log('count item', countItem);
  var {productid} = route.params.bread;
  var selectedOrderDate = route.params.date;
  //console.log("dddd",selectedOrderDate)
  //console.log('route.params.brea item', route.params.bread);
  const [foundSurplus, setFoundSurplus] = useState();
  const [category, setCategory] = useState('');
  const [productsize, setProductsize] = useState('');
  // const [productid, setProductid] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);
  // console.log('state is ', selectedOrderStatus);
  const {surplus, surplusLoading, updateSurplusLoading, createSurplusLoading} =
    useSelector(x => x.surplus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldDismissPage, setShouldDismissPage] = useState(true);
  const [orderProductIdFromPayload, setOrderProductIdFromPayload] = useState();
  //console.log('surplus in breadlist ', surplus.length);

  useEffect(() => {
    if (productid) {
      fetchAllData();
    }
  }, [productid, shouldDismissPage]);

  const fetchAllData = () => {
    dispatch(getAllSurplus(getDateWithoutTime(selectedOrderDate))).then(
      resultData => {
        if (resultData) {
          dispatch(
            getAllOrderedProductsStatsById(
              productid,
              getDateWithoutTime(selectedOrderDate),
            ),
          ).then(result => {
            if (result) {
              //console.log('full bread count profile', result);
              //pick the first object data because they are all the same values except sum
              setCategory(result[0]?.category);
              setProductsize(result[0]?.productsize);
              //setProductid(result[0]?.productid);
              setOrderProductIdFromPayload(result[0]?.id);
              setName(result[0]?.name);
              //calculate all the sum together
              setCount(addAllCounts(result));
              setHasDateLoaded(true);
            }
          });
        }
      },
    );
  };
  useEffect(() => {
    if (surplus) {
      let fSurplus = surplus.find(item => item.productid == productid);
      if (fSurplus) {
        console.log('found the surplus', fSurplus);
      }
      setFoundSurplus(fSurplus);
    }
  }, [surplus, productid, shouldDismissPage]);

  const onRefresh = async () => {
    setHasDateLoaded(false);
    fetchAllData();
    setIsRefreshing(false);
  };

  function addAllCounts(data) {
    let countData = 0;
    data.map((oneItem, i) => {
      if (oneItem.sum) {
        countData = countData + parseInt(oneItem.sum);
      }
    });
    console.log('total sum for this item is ', countData);
    return countData;
  }

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.customerNameView}>
            <ProductSansBold style={[styles.actiontext, {left: 0}]}>
              CATEGORY
            </ProductSansBold>

            <Averta style={styles.custName} numberOfLines={5}>
              {category}
            </Averta>
          </View>
          <View style={[styles.customerNameView, {left: -30}]}>
            <ProductSansBold style={[styles.actiontext, {left: 0}]}>
              SIZE
            </ProductSansBold>

            <Averta style={styles.custName} numberOfLines={5}>
              {productsize}
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
              {count.toString()}
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
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            PENDING
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {parseInt(pendingCount) < 0 ? '0' : parseInt(pendingCount)}
          </Averta>
        </View>

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

  const handleOvenChange = text => {
    if (text) {
      // if (parseInt(text) > count) {
      //   setPendingCount('0');
      //   setOvenCount('');
      //   alert('Number must be less than or equal to ' + count);
      //   return
      // }
      setOvenCount(text);
      setPendingCount(count - text);
      if (count - text < 0) {
        console.log('surplus is ', text - count);
        setSurplusCount(text - count);
      } else {
        setSurplusCount('0');
      }
    } else {
      setPendingCount('0');
      setOvenCount('');
      setSurplusCount('');
    }
  };

  const handleSubmit = (shouldUseSurplusTofulfill = false) => {
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
      if (foundSurplus?.count >= count) {
        remainSurplusCount = foundSurplus?.count - count;
        console.log(
          'SURPLUS IS GREATER THAN REQUIRED COUNT',
          remainSurplusCount,
        );
        countTofulfill = count;
      } else if (foundSurplus.count < count && count > 0) {
        remainSurplusCount = count - foundSurplus?.count;
        console.log(
          'REQUIRED COUNT IS GREATER THAN SURPLUS',
          remainSurplusCount,
        );
        countTofulfill = foundSurplus?.count;
      }
    }
    //==============================================
    var payload = {
      count: parseInt(ovenCount),
      productid: productid,
      surplusCount,
    };

    var surplusPayload = {
      count: countTofulfill,
      productid: productid,
      surplusCount,
      wasFulfilledFromSurplus: shouldUseSurplusTofulfill,
      orderProductIdFromPayload,
    };

    console.log(
      'payload',
      shouldUseSurplusTofulfill ? surplusPayload : payload,
    );

    setIsLoading(true);
    //fulfill the item in breadlist
    dispatch(
      updateOrderListProductCount(
        foundSurplus && shouldUseSurplusTofulfill ? surplusPayload : payload,
        orderDate,
      ),
    )
      .then((result, error) => {
        if (result) {
          if (foundSurplus && shouldUseSurplusTofulfill) {
            console.log(
              'subtracting from found surplus',
              foundSurplus?.count - countTofulfill,
            );

            dispatch(
              updateSurplusById(
                foundSurplus?.id,
                {
                  count: foundSurplus?.count - countTofulfill,
                },
                orderDate,
              ),
            );

            console.log(
              'Before updating order status, surplus count is ',
              countTofulfill,
            );

            //get this page data again
            dispatch(getAllOrderedProductsStatsById(productid, orderDate)).then(
              newResult => {
                //console.log('new result data is ', newResult);

                if (newResult.length > 0) {
                  setIsLoading(false);
                  showSuccessDialog(false);
                  setShouldDismissPage(false);
                } else {
                  showSuccessDialog(true);
                  setShouldDismissPage(true);
                  setIsLoading(false);
                }
              },
            );
          } else {
            showSuccessDialog(true);
            setIsLoading(false);
          }
          //}
          if (isLoading) {
            setIsLoading(false);
          }
          resetFields();
        }
      })
      .catch(error => {
        console.log('update error', error);
        setIsLoading(false);
      });
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
      `Surplus available: ${foundSurplus.count} pieces \nRequired: ${count} pieces`,
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

  const showSuccessDialog = dismiss => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      if (dismiss) {
        console.log('dismiss dialog', dismiss);
        navigation.goBack();
      } else {
        console.log('dont disimiss dialog', dismiss);
      }
    }, DIALOG_TIMEOUT);
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
          Update Order List
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            shouldDisplayBackArrow={true}
            backText={route?.params?.bread?.name || 'Bread List Details'}
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
              <>
                {hasDateLoaded ? (
                  <>
                    {renderDetails()}
                    {!foundSurplus ? displaySubmitButton() : null}
                    {renderSuccessModal()}
                  </>
                ) : null}
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={isLoading} />
          <LoaderShimmerComponent isLoading={surplusLoading} />
          {/* <LoaderShimmerComponent isLoading={ordersLoading} /> */}
          {/* <LoaderShimmerComponent isLoading={updateOrderLoading} />
          <LoaderShimmerComponent isLoading={updateSurplusOrderLoading} /> */}
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
export default BreadListDetailsScreen;
