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
import DatePicker from 'react-native-date-picker';
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
  capitalizeWord,
  dismissBottomSheetDialog,
  DismissKeyboard,
  dismissTextInput,
  formatNumberCommaNaira,
  removeDuplicatesFromArray,
  showBottomSheet,
  validateNumber,
} from '../../utils/utils';
import {BackViewMoreSettings} from '../../components/Header';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import dateFormat, {masks} from 'dateformat';
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
import {
  createOrder,
  createZupaOrder,
  saveOrderDate,
} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import GoogleSearchComponent from '../../components/GoogleSearchComponent';
import BlinkingTextComponent from '../../components/BlinkingTextComponent';
import {getAllSets} from '../../store/actions/sets';
import {
  getAllDeliveryTypes,
  getDeliveryStates,
} from '../../store/actions/delivery-types';
import ProductSans from '../../components/Text/ProductSans';
import {getAllUsers} from '../../store/actions/users';
import {sin} from 'react-native/Libraries/Animated/Easing';
import {getDateWithoutTime} from '../../utils/DateFilter';
import moment from 'moment';
import {getAllMessages, updateMessageById} from '../../store/actions/messages';
import {result} from 'lodash';

// create a component
const DispatchMessageScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const specialNoteRef = useRef(null);

  const {messageArray, messagesLoading, updateMessagesLoading} = useSelector(
    state => state.messages,
  );
  const [enteredMessage, setEnteredMessage] = useState(
    messageArray[0]?.message,
  );
  //console.log('messages', messageArray);

  useEffect(() => {
    dispatch(getAllMessages());
  }, []);

  const renderInputFields = () => {
    return (
      <>
        <View
          style={[
            styles.actions,
            {paddingVertical: 13, paddingHorizontal: 25},
          ]}>
          <ProductSansBold style={styles.actiontext}>
            CURRENT MESSAGE
          </ProductSansBold>

          <Averta style={styles.custName}>
            {messageArray.length > 0 ? messageArray[0]?.message : 'None'}
          </Averta>
        </View>

        <View style={styles.spaceBetweenInputs} />
        <Averta
          style={[
            styles.actiontext,
            {
              fontWeight: '500',
              paddingLeft: 25,
              paddingBottom: 20,
              marginTop: 0,
            },
          ]}>
          Enter your custom message
        </Averta>
        <TextInputComponent
          placeholder={'Enter custom dispatch message'}
          handleTextChange={text => setEnteredMessage(text)}
          defaultValue={enteredMessage}
          returnKeyType={'next'}
          keyboardType={'default'}
          secureTextEntry={false}
          widthFigure={deviceWidth / 1.15}
          heightfigure={145}
          multiline={true}
          capitalize={'sentences'}
          //refValue={specialNoteRef}
          props={{
            borderWidth: 0,
            paddingTop: 12,
            padding: 20,
          }}
        />
        {displaySubmitButton()}
      </>
    );
  };

  const handleUpdateMessageRequest = () => {
    if (!enteredMessage) {
      alert('Please enter a dispatch message');
      return;
    }

    dispatch(
      updateMessageById(messageArray[0]?.id, {message: enteredMessage}),
    ).then(result => {
      if (result) {
        showSuccessDialog();
      }
    });
  };
  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={handleUpdateMessageRequest}
        style={{
          marginTop: 35,
          justifyContent: 'center',
          backgroundColor: COLOURS.blue,
          height: 50,
          borderRadius: 10,
          marginHorizontal: 25,
          alignItems: 'center',
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          Update
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={'Order created successfully'}
      //onPressButton={() => navigation.goBack()}
    />
  );

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.goBack();
    }, 2700);
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Dispatch Message"
            shouldDisplayBackArrow={true}
            displayCalendar={false}
            onClose={() => navigation.goBack()}
          />

          {renderSuccessModal()}
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderInputFields()}
            renderItem={null}
          />
          <LoaderShimmerComponent isLoading={messagesLoading} />
          <LoaderShimmerComponent isLoading={updateMessagesLoading} />
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
    // left: deviceWidth * 0.07,
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
    //justifyContent: 'center',
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
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',

    paddingVertical: 15,
  },
});

//make this component available to the app
export default DispatchMessageScreen;
