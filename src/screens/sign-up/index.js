import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProductSansBold from '../../components/Text/ProductSansBold';
import ProductSans from '../../components/Text/ProductSans';
import {
  dismissBottomSheetDialog,
  DismissKeyboard,
  dismissLoader,
  dismissTextInput,
  removeSpaceFromInput,
  showBottomSheet,
  showLoader
} from '../../shared/utils/utitlity';
import useKeyboardHeight from 'react-native-use-keyboard-height';

import TextInputComponent from '../../components/TextInputComponent';
import { emailValidator } from '../../shared/utils/validation';
import LoaderButtonComponent from '../../components/LoaderButtonComponent';
import { BackViewMoreSettings } from '../../components/Header';
import AvertaBold from '../../components/Text/AvertaBold';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomSheetStatesComponent } from '../../components/BottomSheetComponent';
import { KeyboardObserverComponent } from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import { register } from '../../store/actions/users';
import { ACTIVE_OPACITY, DIALOG_TIMEOUT } from '../../utils/Constants';
import { deviceWidth, hp, wp } from '../../utils/responsive-screen';
import { COLOURS } from '../../utils/Colours';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const keyboardHeight = useKeyboardHeight();
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isStoreNameFocused, setIsStoreNameFocused] = useState(false);
  const [isStoreUrlFocused, setIsStoreUrlFocused] = useState(false);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastnameRef = useRef();
  const passwordRef = useRef();
  const storeUrlRef = useRef();
  const loadingButtonRef = useRef();
  const { deliveryStates } = useSelector((x) => x.deliveryTypes);
  const { patchStoreLoading, getStoreLoading, storeAndWallet, storeUrlStatus } =
    useSelector((x) => x.users);
  const [urlAvailableMessage, setUrlAvailableMessage] =
    useState(storeUrlStatus);
  //console.log("user redux", user, loading);
  //const { signIn } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllKeys = async () => {
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
      } catch (e) {
        // read key error
      }

      console.log('All storage keys', keys);
    };
    getAllKeys();
  }, []);

  useEffect(() => {
    dispatch(
      UserActions.checkUrlAvailability(storeUrl.toLowerCase(), true)
    ).then((result) => {
      if (result) {
        //console.log("url result outside is ", result);
        setUrlAvailableMessage(result.status);
      }
    });
  }, [storeUrl, storeUrlStatus]);

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
      if (!storeUrl.toLowerCase().trim()) {
        return alert('Please enter in your store url');
      }
      if (storeUrl.length < 2) {
        return alert('Please enter a store url greater than 2 characters');
      }
      if (!selectedState) {
        return alert('Please select a state');
      }
      var payload = {
        email,
        password,
        firstName: firstName,
        lastName: lastName,
        customUrl: storeUrl,
        state: selectedState
      };

      showLoader(loadingButtonRef);
      console.log('payload', payload);
      dispatch(register(payload)).then((result) => {
        //console.log("result", result)
        if (result && result?.isNew && result?.user) {
          //dispatch(UserActions.getStoreWithWallet());
          dismissLoader(loadingButtonRef);
          resetFields();
          showSuccessDialog();
          //signIn(result);
        }
      });
      dismissLoader(loadingButtonRef);
    });
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
        message={'Registration successful, please set up your store'}
        // onPressButton={showSuccessDialog}
      />
    );
  };
  const handleEmail = (text) => {
    setEmail(text);
  };
  const handleFirstName = (text) => {
    setFirstName(text);
  };
  const handleLastName = (text) => {
    setLastName(text);
  };
  const handleStoreUrl = (text) => {
    setStoreUrl(removeSpaceFromInput(text));
  };

  const handlePassword = (text) => {
    setPassword(text);
  };

  const renderButton = () => {
    return (
      <>
        <View
          style={{
            marginTop: 5
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
              : 0
        }}
        activeOpacity={ACTIVE_OPACITY}
        onPress={() => navigation.goBack()}
      >
        <ProductSans
          style={[styles.signupView, { color: COLOURS.textInputColor }]}
        >
          Already have an account?{' '}
          <ProductSans style={[styles.signupView]}>Sign In</ProductSans>
        </ProductSans>
      </TouchableOpacity>
    );
  };
  const handleDisplayState = () => {
    dismissTextInput(storeUrlRef);
    showBottomSheet(statesRef);
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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsFirstNameFocused(true)}
          handleBlur={() => setIsFirstNameFocused(false)}
          onSubmitEditing={() => lastnameRef.current.focus()}
        />
        <View style={{ marginVertical: 10 }} />

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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsLastNameFocused(true)}
          handleBlur={() => setIsLastNameFocused(false)}
          onSubmitEditing={() => emailRef.current.focus()}
        />

        <View style={{ marginVertical: 10 }} />

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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsEmailFocused(true)}
          handleBlur={() => setIsEmailFocused(false)}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <View style={{ marginVertical: 10 }} />

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
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsPasswordFocused(true)}
          handleBlur={() => setIsPasswordFocused(false)}
          onSubmitEditing={() => storeUrlRef.current.focus()}
        />
        <View style={{ marginVertical: 10 }} />
        <TextInputComponent
          defaultValue={storeUrl}
          handleTextChange={handleStoreUrl}
          placeholder="Preferred Online Store URL"
          heightfigure={50}
          widthFigure={deviceWidth / 1.15}
          returnKeyType={'next'}
          refValue={storeUrlRef}
          placeholderTextColor={COLOURS.gray5}
          props={
            isStoreUrlFocused
              ? { borderColor: COLOURS.blue, color: COLOURS.textInputColor }
              : { borderColor: COLOURS.zupa_gray_bg }
          }
          handleTextInputFocus={() => setIsStoreUrlFocused(true)}
          handleBlur={() => setIsStoreUrlFocused(false)}
          onSubmitEditing={onSubmit}
        />

      
      </>
    );
  };
  const statesRef = useRef();
  const [selectedState, setSelectedState] = useState();
  const [searchInputValue, setSearchInputValue] = useState('');
  const [stateFilter, setStateFilter] = useState([]);
  const handleInputSearchText = (text) => {
    if (text) {
      const newData = statesng.filter((item) => {
        const itemData = item.state.name
          ? item.state.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      //console.log("new data", newData);
      setStateFilter(newData);
      setSearchInputValue(text);
    } else {
      setStateFilter(statesng);
      setSearchInputValue(text);
    }
  };
  const handleSingleItemPress = (item) => {
    console.log('state clicked is ', item.state.name);
    setSelectedState(item.state.name);
    dismissBottomSheetDialog(statesRef);
  };
  const handleClose = () => {
    Keyboard.dismiss();
    setSearchInputValue('');
    dismissBottomSheetDialog(statesRef);
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheetStatesComponent
        dataSource={searchInputValue.length > 0 ? stateFilter : statesng}
        sheetRef={statesRef}
        inputValue={searchInputValue}
        handleInputSearchText={handleInputSearchText}
        closeAction={handleClose}
        handleSingleItemPress={handleSingleItemPress}
      />
    );
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
              <>
                <View style={{ marginLeft: fp(30) }}>
                  <ProductSansBold style={styles.welcomeTextView}>
                    Sign Up
                  </ProductSansBold>

                 
                </View>
                {renderInputFields()}
                {renderButton()}
                {renderSignInView()}
                {renderSuccessModal()}
                {renderBottomSheet()}
                <View style={{ paddingVertical: 20 }} />
              </>
            </KeyboardObserverComponent>
          </DismissKeyboard>
        }
        renderItem={null}
        keyExtractor={(item) => item?.id}
      />
    </ViewProviderComponent>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.zupa_gray_bg
    //justifyContent: "center",
    //alignItems: 'center'
  },
  welcomeTextView: {
    fontSize: 30,
    color: COLOURS.text_color,
    alignSelf: 'flex-start',
    //marginLeft: 0,
    marginTop: 5
  },
  labelText: {
    fontSize: 12,
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12
  },
  detailsTextview: {
    fontSize: 14,
    color: COLOURS.textInputColor,
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'flex-start'
  },

  button: {
    //marginBottom: hp(40),
    width: deviceWidth - wp(64),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLOURS.blue
  },

  buttonText: {
    color: COLOURS.white,
    fontSize: 12
    //fontWeight: "bold",
  },

  signUpPasswordRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: deviceWidth / 1.22
  },
  signupView: {
    fontSize: hp(14),
    color: COLOURS.blue
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
    marginHorizontal: 25
  },
  productText: {
    fontSize: 14,
    alignSelf: 'center',
    paddingLeft: 16,
    color: COLOURS.textInputColor
  }
});
