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

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('osagie@gmail.com');
  const keyboardHeight = useKeyboardHeight();
  const [password, setPassword] = useState('123456');
  const [firstName, setFirstName] = useState('Osagie');
  const [phoneNumber, setPhoneNumber] = useState('08011111111');
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [radioButtonState, setRadioButtonState] = useState('');
  const [roleRadioButtonState, setRoleRadioButtonState] = useState('');
  const [lastName, setLastName] = useState('Uwa');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPhoneNumberFieldFocused, setIsPhoneNumberFieldFocused] =
    useState(false);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const phoneNumberRef = useRef(null);
  const lastnameRef = useRef();
  const passwordRef = useRef();
  const loadingButtonRef = useRef();
  const {loading, registerError} = useSelector(x => x.users);
  const {rolesLoading, role, roles} = useSelector(x => x.roles);
  //console.log('roles redux', roles);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [whichRole, setWhichRole] = useState();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    dispatch(getAllRoles());
  };

  const onSubmit = async () => {
    requestAnimationFrame(() => {
      if (!firstName.toLowerCase().trim()) {
        return alert('Please enter in your first name');
      }
      if (firstName.length < 2) {
        return alert('First name is too short');
      }
      if (!lastName.toLowerCase().trim()) {
        return alert('Please enter in your last name');
      }
      if (lastName.length < 2) {
        return alert('Last name is too short');
      }

      if (radioButtonState != 'Male' && radioButtonState != 'Female') {
        return alert('Gender is required');
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
      if (!password) {
        return alert('Please enter in your password');
      }
      if (password.length < 6) {
        return alert('Password must be 6 or more characters');
      }

      if (!whichRole) {
        return alert('Your role is required');
      }

      var payload = {
        email,
        password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        genderId: radioButtonState == 'Male' ? 1 : 2,
        roleId: whichRole?.id,
      };

      setIsLoading(true);
       console.log('payload', payload);
      dispatch(register(payload)).then(result => {
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
          marginHorizontal: 20,
          alignItems: 'center',
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          Sign Up
        </Text>
        {/* <LoaderButtonComponent
          buttonRef={submitOrderRef}
          title={'Submit Order'}
          method={handleAddProduct}
        /> */}
      </TouchableOpacity>
    );
  };

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
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
        message={
          'Registration successful, please login with your new credentials'
        }
        // onPressButton={showSuccessDialog}
      />
    );
  };
  const handleEmail = text => {
    setEmail(text);
  };
  const handleFirstName = text => {
    setFirstName(text);
  };
  const handleLastName = text => {
    setLastName(text);
  };
  const handlePassword = text => {
    setPassword(text);
  };

  const renderButton = () => {
    return (
      <>
        <View
          style={{
            marginTop: 5,
          }}
        />
        <LoaderButtonComponent
          buttonRef={loadingButtonRef}
          title={'Sign Up'}
          method={onSubmit}
        />
      </>
    );
  };
  const renderSignInView = () => {
    return (
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          marginTop: 25,
          marginBottom: 25,
          bottom:
            keyboardHeight > 0
              ? Platform.OS == 'ios'
                ? keyboardHeight - hp(50)
                : 0
              : 0,
        }}
        activeOpacity={ACTIVE_OPACITY}
        onPress={() => navigation.goBack()}>
        <ProductSans
          style={[styles.signupView, {color: COLOURS.textInputColor}]}>
          Already have an account?{' '}
          <ProductSans style={[styles.signupView]}>Sign In</ProductSans>
        </ProductSans>
      </TouchableOpacity>
    );
  };

  const handleRadioButtons = state => {
    //console.log("state is ", state);
    setRadioButtonState(state);
  };

  const handleRoleRadioButtons = state => {
    //console.log('state is ', state);
    setRoleRadioButtonState(state);
  };
  const renderInputFields = () => {
    return (
      <>
        <TextInputComponent
          defaultValue={firstName}
          handleTextChange={handleFirstName}
          placeholder="First Name"
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          refValue={firstNameRef}
          capitalize={'sentences'}
          placeholderTextColor={COLOURS.gray5}
          props={
            isFirstNameFocused
              ? {borderColor: COLOURS.blue, color: COLOURS.textInputColor}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsFirstNameFocused(true)}
          handleBlur={() => setIsFirstNameFocused(false)}
          onSubmitEditing={() => lastnameRef.current.focus()}
        />
        <View style={{marginVertical: 10}} />

        <TextInputComponent
          defaultValue={lastName}
          handleTextChange={handleLastName}
          placeholder="Last Name"
          capitalize={'sentences'}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          refValue={lastnameRef}
          placeholderTextColor={COLOURS.gray5}
          props={
            isLastNameFocused
              ? {borderColor: COLOURS.blue, color: COLOURS.textInputColor}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsLastNameFocused(true)}
          handleBlur={() => setIsLastNameFocused(false)}
          onSubmitEditing={() => emailRef.current.focus()}
        />

        <View style={{marginVertical: 10}} />
        <View style={{marginLeft: wp(30), paddingBottom: 0}}>
          <RadioButtonComponent
            button1Name={'Male'}
            button2Name={'Female'}
            onClicked={handleRadioButtons}
            radioButtonState={radioButtonState}
          />
        </View>

        <View style={{marginVertical: 5}} />
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

        <TextInputComponent
          defaultValue={password}
          handleTextChange={handlePassword}
          refValue={passwordRef}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'done'}
          placeholder="Password"
          placeholderTextColor={COLOURS.gray5}
          secureTextEntry
          props={
            isPasswordFocused
              ? {borderColor: COLOURS.blue, color: COLOURS.textInputColor}
              : {borderColor: COLOURS.zupa_gray_bg}
          }
          handleTextInputFocus={() => setIsPasswordFocused(true)}
          handleBlur={() => setIsPasswordFocused(false)}
          onSubmitEditing={onSubmit}
        />
        <View style={{marginVertical: 5}} />

        <View style={[styles.actions, {paddingVertical: 5}]}>
          <ProductSansBold style={styles.actiontext}>
            WHAT IS YOUR ROLE?
          </ProductSansBold>
        </View>
        <FlatList
          data={roles}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          renderItem={renderRoles}
          keyExtractor={item => item?.id}
        />

        <View style={{marginVertical: 10}} />
      </>
    );
  };

  const renderRoles = ({item}) => {
    return (
      <SingleRadioComponent
        item={item}
        onClicked={getRole}
        radioButtonName={whichRole?.name}
      />
    );
  };

  const getRole = role => {
    //console.log('role clicked is ', role);
    setWhichRole(role);
  };
  const handleClose = () => {
    Keyboard.dismiss();
    setSearchInputValue('');
  };

  return (
    <ViewProviderComponent>
      <BackViewMoreSettings
        backText=""
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
                <View style={{marginLeft: fp(30), marginVertical: 20}}>
                  <ProductSansBold style={styles.welcomeTextView}>
                    Sign Up
                  </ProductSansBold>
                </View>
                {renderInputFields()}
                {displaySubmitButton()}
                {renderSignInView()}
                {renderSuccessModal()}

                <View style={{paddingVertical: 20}} />
              </>
            </KeyboardObserverComponent>
          </DismissKeyboard>
        }
        renderItem={null}
        keyExtractor={item => item?.id}
      />
      <LoaderShimmerComponent isLoading={loading} />
    </ViewProviderComponent>
  );
};

export default SignUpScreen;

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
