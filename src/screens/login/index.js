import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList
} from 'react-native';
import {
  wp,
  hp,
  deviceWidth,
  deviceHeight,
  fp
} from '../../shared/utils/responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import * as UserActions from '../../shared/store/redux/actions/users';
import Loader from '../../components/Loader';
import { emailValidator } from '../../shared/utils/validation';
import {
  DismissKeyboard,
  dismissLoader,
  showLoader
} from '../../shared/utils/utitlity';
import { COLOURS } from '../../shared/Themes/Colors';
import { IMAGES } from '../../shared/Themes/Images';
import TextInputComponent from '../../components/TextInputComponent';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import LoaderButtonComponent from '../../components/LoaderButtonComponent';
import ProductSansBold from '../../components/Text/ProductSansBold';
import ImageBgComponent from '../../components/ImageBgComponent';
import ProductSans from '../../components/Text/ProductSans';
import {
  clearDashboardOrdersToPrint,
  clearOrdersArray,
  clearOrdersStatusArray,
  clearPrinterConnectionState
} from '../../shared/store/redux/actions/orders';
import { clearProductsArray } from '../../shared/store/redux/actions/products';
import { clearCategoriesArray } from '../../shared/store/redux/actions/categories';
import { clearCustomersArray } from '../../shared/store/redux/actions/customers';
import { clearDeliveryTypesArray } from '../../shared/store/redux/actions/delivery-types';
import { clearCouponArray } from '../../shared/store/redux/actions/coupons';
import { BackViewMoreSettings } from '../../components/Header';
import { KeyboardObserverComponent } from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import { ACTIVE_OPACITY } from '../../shared/utils/Constants';
import useKeyboardHeight from 'react-native-use-keyboard-height';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const keyboardHeight = useKeyboardHeight();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { loginError } = useSelector((x) => x.users);
  //console.log("error from login", error);

  // const [email, setEmail] = useState('zupa@intelia.io');
  // const [password, setPassword] = useState('Pass#Secret');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const [email, setEmail] = useState('nerojust4@gmail.com');
  // const [password, setPassword] = useState('123456');

  // const [email, setEmail] = useState('Udoka@hoppr.ai')
  // const [password, setPassword] = useState('pass1881');

  // const [email, setEmail] = useState('billytest@test.com');
  // const [password, setPassword] = useState('123456');

  // const [email, setEmail] = useState("samuel@test.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("fortune@test.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("blessing@test.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("boist@test.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("magicmike@test.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("bolatest@email.com");
  // const [password, setPassword] = useState("123456");

  // const [email, setEmail] = useState("nerojust3@gmail.com");
  // const [password, setPassword] = useState("1234567");

  //const [email, setEmail] = useState('testemail@test12.com');
  //const [password, setPassword] = useState('123456');

  // const [email, setEmail] = useState("user@example.com")
  // const [password, setPassword] = useState("password")

  const passwordRef = useRef(null);
  var loadingButtonRef = useRef();

  useEffect(() => {
    dispatch(UserActions.clearStatsArray());
    dispatch(clearOrdersArray());
    dispatch(clearProductsArray());
    dispatch(clearCategoriesArray());
    dispatch(clearCustomersArray());
    dispatch(clearOrdersStatusArray());
    dispatch(clearCouponArray());
    dispatch(clearDeliveryTypesArray());
    dispatch(clearDashboardOrdersToPrint());
    dispatch(clearPrinterConnectionState());
  }, []);

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
      showLoader(loadingButtonRef);

      var payload = {
        email: email.toLowerCase(),
        password
      };

      dispatch(UserActions.login(payload)).then((result) => {
        //console.log("result", result)
        if (result && result?.jwt) {
          //console.log("result login", result);
          dismissLoader(loadingButtonRef);
        }
        dismissLoader(loadingButtonRef);
      });

      if (loginError) {
        console.log('login error', loginError);
        //alert(loginError);
        dismissLoader(loadingButtonRef);
        return;
      }
      dismissLoader(loadingButtonRef);
    });
  };

  const handleEmail = (text) => {
    setEmail(text);
  };

  const handlePassword = (text) => {
    setPassword(text);
  };

  const renderButton = () => {
    return (
      <>
        <LoaderButtonComponent
          buttonRef={loadingButtonRef}
          title={'Sign In'}
          method={onSubmit}
        />

        <View style={{ marginBottom: 20 }} />
      </>
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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsEmailFocused(true)}
          handleBlur={() => setIsEmailFocused(false)}
          onSubmitEditing={() => passwordRef.current.focus()}
        />

        <View style={{ marginVertical: 10 }} />

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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsPasswordFocused(true)}
          handleBlur={() => setIsPasswordFocused(false)}
          onSubmitEditing={onSubmit}
        />
        <View style={{ marginVertical: 10 }} />
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
                : 0
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={() => navigation.navigate('SignUp')}
        >
          <ProductSans style={[styles.signupView]}>Sign up instead</ProductSans>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={() => navigation.navigate('PasswordReset')}
        >
          <ProductSans style={styles.forgotPasswordView}>
            Forgot Password?
          </ProductSans>
        </TouchableOpacity>
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
        style={{ width: deviceWidth, borderBottomWidth: 0 }}
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
                  height: fp(deviceHeight - wp(125))
                }}
              >
                <View style={{ marginLeft: 25 }}>
                  <ProductSansBold style={styles.welcomeTextView}>
                    Sign In
                  </ProductSansBold>

                  <ProductSans style={styles.signInTextView}>
                    Sign in to your account
                  </ProductSans>
                </View>
                {renderInputFields()}

                {renderButton()}
                {renderBottomRow()}
              </View>
            </KeyboardObserverComponent>
          </DismissKeyboard>
        }
        renderItem={null}
        keyExtractor={(item) => item?.id}
      />
    </ViewProviderComponent>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.zupa_gray_bg,
    flex: 1
    //alignItems: 'center',
  },

  welcomeTextView: {
    fontSize: fp(30),
    color: COLOURS.text_color
  },
  signInTextView: {
    fontSize: fp(14),
    color: COLOURS.textInputColor,
    marginTop: 15,
    marginBottom: 30
  },

  button: {
    marginBottom: hp(40),
    width: deviceWidth / 1.25,
    height: 50,
    justifyContent: 'center',
    right: -5,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLOURS.blue
  },

  buttonText: {
    color: COLOURS.white,
    fontSize: fp(16)
  },

  signUpPasswordRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 10
  },
  signupView: {
    fontSize: fp(14),
    color: COLOURS.blue
  },

  forgotPasswordView: {
    fontSize: fp(14),
    color: COLOURS.labelTextColor
  }
});
