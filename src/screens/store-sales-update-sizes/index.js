//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import TextInputComponent from '../../components/TextInputComponent';
import {useDispatch, useSelector} from 'react-redux';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';
import {createSurplusProduct} from '../../store/actions/surplus';
import ProductSans from '../../components/Text/ProductSans';

// create a component
const StoreSalesUpdateSizesScreen = ({navigation, route}) => {
  var dataSource = route?.params?.surplusData;
  const dispatch = useDispatch();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const {createSurplusLoading} = useSelector(x => x.surplus);
  const orderDate = route?.params?.date;
  const offset = route?.params?.offset;
  const selectedTab = route?.params?.tab;
  //console.log("offset is ",offset)
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    // console.log('sizes are ', sizes);
    let data = dataSource?.map((oneItem, index) => {
      return {
        name: oneItem?.name,
        productSize: oneItem?.categorysize,
        productId: oneItem?.productid,
        position: index,
        count: oneItem?.surplus?.count.toString() || '',
        startDate: orderDate + ' 00:00:01',
        endDate: orderDate + ' 23:59:59',
      };
    });
    setSizes(data);
  }, []);

  const renderDetails = () => {
    return (
      <ScrollView>
        {dataSource.map((oneItem, i) => {
          //console.log('item detail', ` ${oneItem.categorysize}`);
          return (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                //paddingHorizontal: 15,
                paddingVertical: 2,
                backgroundColor: COLOURS.lightGray1,
                borderRadius: 10,
                marginVertical: 5,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              key={Math.random()}
              // onPress={() => handleSingleItemPress(key, value)}
            >
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    //paddingBottom: value?.products ? 20 : 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <ProductSans
                    style={[
                      styles.productName,
                      {
                        flex: 0.5,
                      },
                    ]}>
                    {oneItem.categorysize}
                  </ProductSans>
                  <TextInputComponent
                    placeholder={'Insert number only'}
                    handleTextChange={text => handleSizeChange(i, text)}
                    defaultValue={dataSource[i]?.surplus?.count.toString()}
                    returnKeyType={'go'}
                    keyboardType={'default'}
                    secureTextEntry={false}
                    capitalize={'sentences'}
                    //refValue={surplusCountRef}
                    heightfigure={50}
                    //widthFigure={deviceWidth / 1.15}
                    props={{borderColor: COLOURS.lightGray3, flex: 0.35}}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={handleSubmitUpdateSurplus1}
          activeOpacity={0.6}
          style={{
            marginTop: 25,
            justifyContent: 'center',
            backgroundColor: COLOURS.zupaBlue,
            height: 50,
            borderRadius: 10,
            marginHorizontal: 25,
            alignItems: 'center',
          }}>
          <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const handleSizeChange = (index, text) => {
    sizes.map((size, i) => {
      // console.log('index : ' + index + ' sub index: ' + i);
      if (index == i) {
        //console.log('found', size, ' count is ', text);
        size.count = text;
      }
    });
  };

  const handleSubmitUpdateSurplus1 = () => {
    console.log('payload', sizes);
    let payload = {
      products: sizes,
    };
    dispatch(createSurplusProduct(payload, orderDate, offset,selectedTab)).then(result => {
      if (result) {
        showSuccessDialog();
      }
    });
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

  return (
    <ViewProviderComponent>
      <KeyboardObserverComponent>
        <BackViewMoreSettings
          backText={dataSource[0]?.name}
          onClose={() => navigation.goBack()}
          shouldDisplayBackArrow={true}
          displayDelete={false}
        />
        {renderDetails()}
        {renderSuccessModal()}
        <LoaderShimmerComponent isLoading={createSurplusLoading} />
      </KeyboardObserverComponent>
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
  productName: {
    fontSize: fp(16),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
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
export default StoreSalesUpdateSizesScreen;
