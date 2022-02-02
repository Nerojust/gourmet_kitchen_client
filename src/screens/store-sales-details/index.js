//import liraries
import React, {useState, useRef,useEffect} from 'react';
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
import {updateOrderListProductCount} from '../../store/actions/orders';
import {createSurplus, updateSurplusById} from '../../store/actions/surplus';

// create a component
const StoreSalesDetailsScreen = ({navigation, route}) => {
  const [pendingCount, setPendingCount] = useState('0');
  const [surplusCount, setSurplusCount] = useState('0');
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
  //console.log(route?.params?.surplus);
  const dispatch = useDispatch();
  const surplusRef = useRef();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const {updateSurplusLoading, isSurplusUpdated} = useSelector(x => x.surplus);

  const handleSurplusChange = text => {
    if (text) {
      setSurplusCount(text);
    } else {
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

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            REMAINING SURPLUS
          </ProductSansBold>
          <Averta style={styles.address} numberOfLines={5}>
            {parseInt(surplusCount) < 0 ? '0' : surplusCount}
          </Averta>
        </View>
        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold style={[styles.actiontext, {left: 0}]}>
            SURPLUS COUNT
          </ProductSansBold>

          <TextInputComponent
            placeholder={'Enter number to deduct from surplus'}
            handleTextChange={handleSurplusChange}
            defaultValue={surplusCount}
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

  const handleSubmit = () => {
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
        console.log('updadte error', error);
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
          Update Surplus Count
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

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText={route.params.surplus.productname || 'Store Sales Details'}
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
          <LoaderShimmerComponent isLoading={updateSurplusLoading} />
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
