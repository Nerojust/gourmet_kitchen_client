//import liraries
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {DismissKeyboard, displayDialog} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import {deviceWidth, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import ProductSansBold from '../../components/Text/ProductSansBold';
import TextInputComponent from '../../components/TextInputComponent';
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';
import {updateOrderListProductCount} from '../../store/actions/orders';
import {
  createSurplus,
  deductSurplusCount,
  deleteSurplusById,
  updateSurplusById,
} from '../../store/actions/surplus';

// create a component
const StoreSalesDetailsScreen = ({navigation, route}) => {
  const [surplusCount, setSurplusCount] = useState('0');
  const [surplusCountDeduct, setSurplusCountDeduct] = useState('0');
  const [isSurplusFocused, setIsSurplusFocused] = useState(false);
  var {
    productid,
    productname,
    productcategory,
    productsize,
    id,
    issurplus,
    count,
  } = route?.params?.surplus;
  var edit = route.params.edit;
  //console.log('Edit', edit);
  //console.log(route?.params?.surplus);
  const dispatch = useDispatch();
  const surplusRef = useRef();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [remainingCount, setRemainingCount] = useState('0');
  const {updateSurplusLoading, deleteSurplusLoading, deductSurplusLoading} =
    useSelector(x => x.surplus);
  const [inputSurplusCount, setinputSurplusCount] = useState();
  const [inputSurplusCountDeduct, setInputSurplusCountDeduct] = useState();
  const [remainingSurplusCount, setRemaningSurplusCount] = useState('0');
  const [remainingSurplusCountDeduct, setRemaningSurplusCountDeduct] =
    useState('0');

  const handleSurplusChange = text => {
    if (text) {
      // if (parseInt(text) > count) {
      //   setRemaningSurplusCount('0');
      //   setinputSurplusCount('');
      //   alert('Number must be less than or equal to ' + count);
      //   return;
      // }
      setinputSurplusCount(text);
      setRemaningSurplusCount(count - text);
      if (count - text < 0) {
        console.log('surplus is ', text - count);
        setSurplusCount(text - count);
      } else {
        setSurplusCount('0');
      }
    } else {
      setRemaningSurplusCount('0');
      setinputSurplusCount('');
      setSurplusCount('');
    }
  };
  const handleSurplusChangeDeduct = text => {
    if (text) {
      if (parseInt(text) > count) {
        setRemaningSurplusCount('0');
        setinputSurplusCount('');
        alert('Number must be less than or equal to ' + count);
        return;
      }
      setinputSurplusCount(text);
      setRemaningSurplusCount(count - text);
      if (count - text < 0) {
        console.log('surplus is ', text - count);
        setSurplusCount(text - count);
      } else {
        setSurplusCount('0');
      }
    } else {
      setRemaningSurplusCount('0');
      setinputSurplusCount('');
      setSurplusCount('');
    }
  };

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            TOTAL SURPLUS
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {count.toString()}
          </Averta>
        </View>

        {/* <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            REMAINING SURPLUS
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {parseInt(remainingSurplusCount) < 0
              ? '0'
              : parseInt(remainingSurplusCount)}
          </Averta>
        </View> */}
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            SURPLUS COUNT
          </ProductSansBold>

          <TextInputComponent
            placeholder={'Enter new surplus count'}
            handleTextChange={handleSurplusChange}
            defaultValue={inputSurplusCount}
            returnKeyType={'next'}
            keyboardType={'default'}
            secureTextEntry={false}
            capitalize={'sentences'}
            heightfigure={50}
            widthFigure={deviceWidth / 1.15}
            refValue={surplusRef}
            props={
              isSurplusFocused
                ? {borderColor: COLOURS.blue}
                : {borderColor: COLOURS.zupa_gray_bg}
            }
            handleTextInputFocus={() => {
              setIsSurplusFocused(true);
            }}
            handleBlur={() => {
              setIsSurplusFocused(false);
            }}
            onSubmitEditing={event => {}}
          />
        </View>
      </View>
    );
  };
  const renderDeductDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            TOTAL SURPLUS
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {count.toString()}
          </Averta>
        </View>

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            REMAINING SURPLUS
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {parseInt(remainingSurplusCount) < 0
              ? '0'
              : parseInt(remainingSurplusCount)}
          </Averta>
        </View>
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            SURPLUS COUNT
          </ProductSansBold>

          <TextInputComponent
            placeholder={'Enter number to deduct from surplus'}
            handleTextChange={handleSurplusChangeDeduct}
            defaultValue={inputSurplusCountDeduct}
            returnKeyType={'next'}
            keyboardType={'default'}
            secureTextEntry={false}
            capitalize={'sentences'}
            heightfigure={50}
            widthFigure={deviceWidth / 1.15}
            refValue={surplusRef}
            props={
              isSurplusFocused
                ? {borderColor: COLOURS.blue}
                : {borderColor: COLOURS.zupa_gray_bg}
            }
            handleTextInputFocus={() => {
              setIsSurplusFocused(true);
            }}
            handleBlur={() => {
              setIsSurplusFocused(false);
            }}
            onSubmitEditing={event => {}}
          />
        </View>
      </View>
    );
  };

  const handleSubmitUpdateSurplus = () => {
    if (!inputSurplusCount) {
      alert('Enter the number to deduct');
      return;
    }
    console.log('input', inputSurplusCount);
    if (inputSurplusCount.length < 1) {
      alert('Surplus count must be greater than zero');
      return;
    }
    var payload = {
      count: parseInt(inputSurplusCount),
      productCategory: productcategory,
      productSize: productsize,
      productName: productname,
      productId: productid,
    };

    console.log('surplus payload', payload);

    dispatch(updateSurplusById(id, payload))
      .then((result, error) => {
        if (result) {
          //if (isSurplusUpdated) {
          showSuccessDialog();
          resetFields();
          //}
        }
      })
      .catch(error => {
        console.log('updated error', error);
      });
  };

  const handleSubmitDeductSurplus = () => {
    if (!inputSurplusCount) {
      alert('Surplus count is required');
      return;
    }
    console.log('input', inputSurplusCount);
    if (inputSurplusCount.length < 1) {
      alert('Surplus count must be greater than zero');
      return;
    }
    var payload = {
      count: parseInt(inputSurplusCount),
      productCategory: productcategory,
      productSize: productsize,
      productName: productname,
      productId: productid,
    };
    console.log('surplus payload', payload);

    dispatch(deductSurplusCount(payload))
      .then((result, error) => {
        if (result) {
          //if (isSurplusUpdated) {
          showSuccessDialog();
          resetFields();
          //}
        }
      })
      .catch(error => {
        console.log('updadte error', error);
      });
  };

  const handleValidation = () => {
    if (inputSurplusCount) {
      Alert.alert(
        'Alert',
        'Do you want to update this surplus count for this item?',
        [
          {
            text: 'No',
            onPress: () => {
              console.log('cancel Pressed');
            },
          },
          {
            text: 'Yes',
            onPress: () => handleSubmitUpdateSurplus(),
          },
        ],
        {cancelable: true},
      );
    } else {
      alert('Enter the new surplus count');
    }
  };

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={edit ? handleValidation : handleSubmitDeductSurplus}
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
          {edit ? 'Change Surplus Count' : 'Deduct From Surplus Count'}
        </Text>
      </TouchableOpacity>
    );
  };

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.goBack();
    }, DIALOG_TIMEOUT);
  };

  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Surplus Updated Successfully'}
    />
  );

  const resetFields = () => {
    setSurplusCount('');
  };
  const handleDeleteSurplus = () => {
    console.log('delete surplus clicked');

    Alert.alert(
      'Alert',
      'Do you want to delete this surplus?',
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
            dispatch(deleteSurplusById(route.params.surplus.id)).then(
              result => {
                if (result) {
                  showSuccessDialog();
                }
              },
            ),
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText={
              route?.params?.surplus?.productname || 'Store Sales Details'
            }
            onClose={() => navigation.goBack()}
            displayDelete
            performDelete={handleDeleteSurplus}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              <>
                {edit ? renderDetails() : renderDeductDetails()}
                {displaySubmitButton()}
                {renderSuccessModal()}
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={deductSurplusLoading} />
          <LoaderShimmerComponent isLoading={updateSurplusLoading} />
          <LoaderShimmerComponent isLoading={deleteSurplusLoading} />
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
    backgroundColor: '#2c3e50',
  },
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
export default StoreSalesDetailsScreen;
