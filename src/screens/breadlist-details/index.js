//import liraries
import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
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
import {getAllOrderedProducts, updateOrderListProductCount} from '../../store/actions/orders';
import {createSurplus} from '../../store/actions/surplus';

// create a component
const BreadListDetailsScreen = ({navigation, route}) => {
  console.log('bread details', route.params.bread);
  const [ovenCount, setOvenCount] = useState();
  const [pendingCount, setPendingCount] = useState('0');
  const [surplusCount, setSurplusCount] = useState('0');
  const [isOvenCountFocused, setIsOvenCountFocused] = useState(false);
  var {productid, category, productsize, name, sum: count} = route.params.bread;
  const dispatch = useDispatch();
  const ovenCountRef = useRef();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const {isOrderUpdated, updateOrderLoading, selectedOrderStatus} = useSelector(
    x => x.orders,
  );
  console.log('state is ', selectedOrderStatus);

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            TOTAL NEEDED
          </ProductSansBold>

          <Averta style={styles.custName} numberOfLines={5}>
            {count.toString()}
          </Averta>
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
  const handleCreateSurplus = () => {
    if (!surplusCount) {
      alert('Surplus count is required');
      return;
    }
    if (surplusCount.length < 1 || surplusCount == '0') {
      alert('Surplus count must be greater than zero');
      return;
    }
    var payload = {
      count: parseInt(surplusCount),
      productId: productid,
      productName: name,
      productCategory: category,
      productSize: productsize,
    };
    console.log('surplus payload', payload);

    dispatch(createSurplus(payload))
      .then((result, error) => {
        if (result) {
          showSuccessDialog();
          resetFields();
        }
      })
      .catch(error => {
        console.log('updadte error', error);
      });
  };
  const handleSubmit = () => {
    if (!ovenCount) {
      alert('Oven count is required');
      return;
    }
    if (ovenCount.length < 1 || ovenCount == '0') {
      alert('Oven count must be greater than zero');
      return;
    }
    var payload = {
      count: parseInt(ovenCount),
      productid: productid,
    };
    console.log('payload', payload);

    dispatch(updateOrderListProductCount(payload, selectedOrderStatus))
      .then((result, error) => {
        if (result) {
          if (surplusCount > 0) {
            handleCreateSurplus();
          } else {
            showSuccessDialog();
            resetFields();
            dispatch(getAllOrderedProducts('incomplete'))
          }
        }
      })
      .catch(error => {
        console.log('updadte error', error);
      });
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

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.goBack();
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
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
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
            backText={route?.params?.bread?.name || 'Bread List Details'}
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              <>
                {renderDetails()}
                {displaySubmitButton()}
                {renderSuccessModal()}
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={updateOrderLoading} />
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
