import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Text,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductSansBold from '../../components/Text/ProductSansBold';
import ProductSans from '../../components/Text/ProductSans';
import {
  DismissKeyboard,
  dismissLoader,
  emailValidator,
  showLoader,
  validateNumber,
} from '../../utils/utils';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import TextInputComponent from '../../components/TextInputComponent';
import LoaderButtonComponent from '../../components/LoaderButtonComponent';
import {BackViewMoreSettings} from '../../components/Header';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {register} from '../../store/actions/users';
import {ACTIVE_OPACITY, DIALOG_TIMEOUT} from '../../utils/Constants';
import {deviceWidth, hp, wp, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import RadioButtonComponent from '../../components/RadioButtonComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import {getAllRoles} from '../../store/actions/roles';
import SingleRadioComponent from '../../components/SingleRadioComponent';
import { createRider } from '../../store/actions/riders';

const AddRiderScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const keyboardHeight = useKeyboardHeight();
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [radioButtonState, setRadioButtonState] = useState('');
  const [roleRadioButtonState, setRoleRadioButtonState] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPhoneNumberFieldFocused, setIsPhoneNumberFieldFocused] =
    useState(false);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const phoneNumberRef = useRef(null);
  const lastnameRef = useRef();
  const passwordRef = useRef();
  const loadingButtonRef = useRef();
  const {ridersLoading} = useSelector(x => x.riders);
  //console.log('roles redux', roles);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [whichRole, setWhichRole] = useState();
  const {user, usersLoading, users} = useSelector(state => state.users);
  //console.log('user is ', user);
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    dispatch(getAllRoles());
  };

  const onSubmit = async () => {
    requestAnimationFrame(() => {
      if (!fullName.toLowerCase().trim()) {
        return alert('Please enter in your first name');
      }
      if (!phoneNumber) {
        alert('Phone number is required');
        return;
      }
      if (!validateNumber(phoneNumber)) {
        alert('Enter a valid phone number');
        return;
      }

      if (!email.toLowerCase().trim()) {
        return alert('Please enter in your email');
      }
      if (!emailValidator(email.trim())) {
        return alert('Invalid email entered, it shoud contain "@" and "."');
      }

      var payload = {
        email,
        fullName: fullName,
        phoneNumber: phoneNumber,
        userId: user?.id,
      };

      setIsLoading(true);
      console.log('payload', payload);
      dispatch(createRider(payload)).then(result => {
        //console.log("result", result)
        if (result) {
          setIsLoading(false);
          resetFields();
          showSuccessDialog();
        }
      });
      setIsLoading(false);
    });
    //display error if available
    // if (registerError) {
    //   return alert(registerError);
    // }
  };

  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={onSubmit}
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
          Add Rider
        </Text>
      </TouchableOpacity>
    );
  };

  const resetFields = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
  };
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      navigation.goBack();
      //setIsSuccessModalVisible(false);
    }, DIALOG_TIMEOUT);
  };

  const renderSuccessModal = () => {
    return (
      <CustomSuccessModal
        isModalVisible={isSuccessModalVisible}
        dismissModal={showSuccessDialog}
        message={'Rider Created successfully'}
        // onPressButton={showSuccessDialog}
      />
    );
  };
  const handleEmail = text => {
    setEmail(text);
  };
  const handleFullName = text => {
    setFullName(text);
  };

  const renderInputFields = () => {
    return (
      <>
        <TextInputComponent
          defaultValue={fullName}
          handleTextChange={handleFullName}
          placeholder="FullName"
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          refValue={firstNameRef}
          capitalize={'sentences'}
          placeholderTextColor={COLOURS.gray5}
          props={
            isFullNameFocused
              ? {borderColor: COLOURS.blue, color: COLOURS.textInputColor}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsFullNameFocused(true)}
          handleBlur={() => setIsFullNameFocused(false)}
          onSubmitEditing={() => phoneNumberRef.current.focus()}
        />
        <View style={{marginVertical: 10}} />

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
            emailRef.current.focus();
          }}
        />

        <View style={{marginVertical: 10}} />

        <TextInputComponent
          defaultValue={email}
          handleTextChange={handleEmail}
          placeholder="Email"
          heightfigure={50}
          refValue={emailRef}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          placeholderTextColor={COLOURS.gray5}
          props={
            isEmailFocused
              ? {borderColor: COLOURS.blue, color: COLOURS.textInputColor}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsEmailFocused(true)}
          handleBlur={() => setIsEmailFocused(false)}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <View style={{marginVertical: 10}} />
      </>
    );
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setSearchInputValue('');
  };

  return (
    <ViewProviderComponent>
      <BackViewMoreSettings
        backText="Add Rider"
        style={{width: deviceWidth, borderBottomWidth: 0}}
        shouldDisplayBackArrow={true}
        onClose={() => navigation.goBack()}
      />
      <FlatList
        data={[]}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <DismissKeyboard handleClose={handleClose}>
            <KeyboardObserverComponent>
              <>
                <View style={{paddingTop: 20}} />
                {renderInputFields()}
                {displaySubmitButton()}
                {renderSuccessModal()}

                <View style={{paddingVertical: 20}} />
              </>
            </KeyboardObserverComponent>
          </DismissKeyboard>
        }
        renderItem={null}
        keyExtractor={item => item?.id}
      />
      <LoaderShimmerComponent isLoading={ridersLoading} />
    </ViewProviderComponent>
  );
};

export default AddRiderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.zupa_gray_bg,
    //justifyContent: "center",
    //alignItems: 'center'
  },
  actiontext: {
    fontSize: 12,
    //lineHeight: hp(19),
    color: COLOURS.labelTextColor,
    fontWeight: 'bold',
    left: deviceWidth * 0.07,
  },
  actions: {
    justifyContent: 'center',
    //height: hp(65),
    alignItems: 'flex-start',
  },
  welcomeTextView: {
    fontSize: 30,
    color: COLOURS.text_color,
    alignSelf: 'flex-start',
    //marginLeft: 0,
    marginTop: 5,
  },
  labelText: {
    fontSize: 12,
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
  detailsTextview: {
    fontSize: 14,
    color: COLOURS.textInputColor,
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'flex-start',
  },

  button: {
    //marginBottom: hp(40),
    width: deviceWidth - wp(64),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLOURS.blue,
  },

  buttonText: {
    color: COLOURS.white,
    fontSize: 12,
    //fontWeight: "bold",
  },

  signUpPasswordRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: deviceWidth / 1.22,
  },
  signupView: {
    fontSize: hp(14),
    color: COLOURS.blue,
  },
  productView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    height: 50,
    //width:deviceWidth*1.15,
    backgroundColor: COLOURS.lightGray5,
    // top: -10,
    borderColor: COLOURS.lightGray2,
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 25,
  },
  productText: {
    fontSize: 14,
    alignSelf: 'center',
    paddingLeft: 16,
    color: COLOURS.textInputColor,
  },
});
