import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,Text,
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

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const keyboardHeight = useKeyboardHeight();
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastnameRef = useRef();
  const passwordRef = useRef();
  const loadingButtonRef = useRef();
  const {storeUrlStatus} = useSelector(x => x.users);
  const dispatch = useDispatch();

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

      var payload = {
        email,
        password,
        firstName: firstName,
        lastName: lastName,
        gender: 1,
      };

      showLoader(loadingButtonRef);
      console.log('payload', payload);
      dispatch(register(payload)).then(result => {
        //console.log("result", result)
        if (result && result?.isNew && result?.user) {
          dismissLoader(loadingButtonRef);
          resetFields();
          showSuccessDialog();
        }
      });
      dismissLoader(loadingButtonRef);
    });
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
    setPassword('');
  };
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
    }, DIALOG_TIMEOUT);
  };

  const renderSuccessModal = () => {
    return (
      <CustomSuccessModal
        isModalVisible={isSuccessModalVisible}
        dismissModal={showSuccessDialog}
        message={'Registration successful, please login with your new credentials'}
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
          marginTop: 20,
          marginBottom:
            keyboardHeight > 0
              ? Platform.OS == 'ios'
                ? keyboardHeight - hp(60)
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
                <View style={{marginLeft: fp(30),marginBottom:20}}>
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
