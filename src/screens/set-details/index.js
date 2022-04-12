//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {capitalizeWord, DismissKeyboard} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import AvertaBold from '../../components/Text/AvertaBold';
import {fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import SetListItemComponent from '../../components/SetListItemComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import {useSelector, useDispatch} from 'react-redux';
import {deleteById, deleteSetById} from '../../store/actions/sets';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';

// create a component
const SetDetailsScreen = ({navigation, route}) => {
  const {deleteSetLoading, hasDeletedSet} = useSelector(x => x.sets);
  const dispatch = useDispatch();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  console.log('set details', route.params.set);
  var setItems = route?.params?.set?.products;
  var {
    name,
    id,
    status,
    createdat,
    zupasetname,
    zupasetcategorysize,
    isfulfilled,
  } = route?.params?.set;

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.labelText, {left: 0}]}>
            SET NAME
          </ProductSansBold>
          <TouchableOpacity onPress={null}>
            <AvertaBold style={styles.custName}>
              {name ? capitalizeWord(name.trim()) : 'None'}
            </AvertaBold>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            DATE CREATED
          </ProductSansBold>
          <Averta style={styles.address}>
            {createdat ? moment(createdat).format('LLL') : 'None'}
          </Averta>
        </View>

        <View
          style={[
            styles.customerNameView,
            {paddingTop: 5, marginRight: 10, marginBottom: 30},
          ]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            SET PRODUCTS
          </ProductSansBold>

          {setItems.length > 0 &&
            setItems.map((item, index) => {
              return (
                <View key={index}>
                  {/* order items list */}
                  <SetListItemComponent item={item} index={index} />
                </View>
              );
            })}
        </View>

        <View
          style={[
            styles.customerNameView,
            {marginRight: 10, top: -10, marginBottom: 30},
          ]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 8, left: 0}]}>
            ZUPA ASSOCIATED SET NAME
          </ProductSansBold>
          <Averta style={[styles.address, {color: COLOURS.textInputColor}]}>
            {zupasetname ? zupasetname.trim() : 'None'}
          </Averta>
          <Averta style={[styles.address, {color: COLOURS.gray}]}>
            Size: {zupasetcategorysize ? zupasetcategorysize.trim() : 'None'}
          </Averta>
        </View>
      </View>
    );
  };
  const handleDelete = item => {
    console.log('item', item);
    if (item == 'delete') {
      handleDeleteSet();
    }
  };
  const handleDeleteSet = () => {
    console.log('delete clicked');

    Alert.alert(
      'Alert',
      'Do you want to delete this set?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteSetById(id));
            showSuccessDialog();
          },
        },
      ],
      {cancelable: true},
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
      message={'Set deleted successfully'}
    />
  );
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText={route.params.set.name + ' Details'}
            onClose={() => navigation.goBack()}
            shouldDisplayDelete
            shouldDisplayBackArrow={true}
            handleClick={handleDelete}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
              <>
                {renderSuccessModal()}
                {renderDetails()}
                
              </>
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={deleteSetLoading} />
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
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
});

//make this component available to the app
export default SetDetailsScreen;
