import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  Text,
  FlatList,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import TextInputComponent from '../../components/TextInputComponent';
import LoaderButtonComponent from '../../components/LoaderButtonComponent';
import ProductSansBold from '../../components/Text/ProductSansBold';
import ProductSans from '../../components/Text/ProductSans';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import {login} from '../../store/actions/users';
import {
  DismissKeyboard,
  dismissLoader,
  emailValidator,
  showLoader,
} from '../../utils/utils';
import {ACTIVE_OPACITY} from '../../utils/Constants';
import {
  deviceHeight,
  deviceWidth,
  fp,
  hp,
  wp,
} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const keyboardHeight = useKeyboardHeight();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {loginError, loading, accessToken} = useSelector(x => x.users);
  //console.log('token is ', accessToken);

  //console.log("error from login", error);

  // const [email, setEmail] = useState('zupa@intelia.io');
  // const [password, setPassword] = useState('Pass#Secret');

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [email, setEmail] = useState('nerojust4@gmail.com');
  const [password, setPassword] = useState('123456');

  // const [email, setEmail] = useState('fredBakim@gmail.com');
  // const [password, setPassword] = useState('123456');

  // const [email, setEmail] = useState('osagie@gmail.com');
  // const [password, setPassword] = useState('123456');

  const passwordRef = useRef(null);
  var loadingButtonRef = useRef();

  const onSubmit = async () => {
    requestAnimationFrame(() => {
      if (!email.toLowerCase().trim()) {
        return alert('Please enter your email');
      }

      if (!emailValidator(email.toLowerCase().trim())) {
        return alert('Invalid email');
      }

      if (!password) {
        return alert('Please enter your password');
      }
      if (password.length < 6) {
        return alert('Invalid password length, must be 6 or more characters');
      }

      handleClose();

      var payload = {
        email: email,
        password,
      };

      dispatch(login(payload));
    });
  };

  const handleEmail = text => {
    setEmail(text);
  };

  const handlePassword = text => {
    setPassword(text);
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
          Sign In
        </Text>
        {/* <LoaderButtonComponent
          buttonRef={submitOrderRef}
          title={'Submit Order'}
          method={handleAddProduct}
        /> */}
      </TouchableOpacity>
    );
  };

  const renderInputFields = () => {
    return (
      <>
        <TextInputComponent
          defaultValue={email}
          handleTextChange={handleEmail}
          placeholder="Email"
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          placeholderTextColor={COLOURS.gray5}
          keyboardType={'email-address'}
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
          defaultValue={password.trim()}
          handleTextChange={handlePassword}
          refValue={passwordRef}
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'done'}
          //keyboardType={'email-address'}
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

  const renderBottomRow = () => {
    return (
      <View
        style={[
          styles.signUpPasswordRowView,
          {
            marginBottom:
              keyboardHeight > 0
                ? Platform.OS == 'ios'
                  ? keyboardHeight - hp(150)
                  : 0
                : 0,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={() => navigation.navigate('SignUp')}>
          <ProductSans style={[styles.signupView]}>Sign up instead</ProductSans>
        </TouchableOpacity>

        {/* <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={() => navigation.navigate('PasswordReset')}>
          <ProductSans style={styles.forgotPasswordView}>
            Forgot Password?
          </ProductSans>
        </TouchableOpacity> */}
      </View>
    );
  };
  const handleClose = () => {
    Keyboard.dismiss();
  };
  return (
    <ViewProviderComponent>
      <BackViewMoreSettings
        backText=""
        style={{width: deviceWidth, borderBottomWidth: 0}}
        shouldDisplayBackArrow={false}
        onClose={() => navigation.goBack()}
      />
      <FlatList
        data={[]}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <DismissKeyboard handleClose={handleClose}>
            <KeyboardObserverComponent>
              <View
                style={{
                  justifyContent: 'center',
                  height: fp(deviceHeight - wp(125)),
                }}>
                <View style={{marginLeft: 25}}>
                  <ProductSansBold style={styles.welcomeTextView}>
                    Sign In
                  </ProductSansBold>

                  <ProductSans style={styles.signInTextView}>
                    Sign in to your account
                  </ProductSans>
                </View>
                {renderInputFields()}

                {displaySubmitButton()}
                {renderBottomRow()}
                <LoaderShimmerComponent isLoading={loading} />
              </View>
            </KeyboardObserverComponent>
          </DismissKeyboard>
        }
        renderItem={null}
        keyExtractor={item => item?.id}
      />
    </ViewProviderComponent>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.zupa_gray_bg,
    flex: 1,
    //alignItems: 'center',
  },

  welcomeTextView: {
    fontSize: fp(30),
    color: COLOURS.text_color,
  },
  signInTextView: {
    fontSize: fp(14),
    color: COLOURS.textInputColor,
    marginTop: 15,
    marginBottom: 30,
  },

  button: {
    marginBottom: hp(40),
    width: deviceWidth / 1.25,
    height: 50,
    justifyContent: 'center',
    right: -5,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLOURS.blue,
  },

  buttonText: {
    color: COLOURS.white,
    fontSize: fp(16),
  },

  signUpPasswordRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 10,
  },
  signupView: {
    fontSize: fp(14),
    color: COLOURS.blue,
  },

  forgotPasswordView: {
    fontSize: fp(14),
    color: COLOURS.labelTextColor,
  },
});
