//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {
  BackViewMoreSettings,
  BackViewWithLogout,
} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  DismissKeyboard,
  sortArrayByDate,
  sortArrayByDateDesc,
} from '../../utils/utils';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import ProductSans from '../../components/Text/ProductSans';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSurplus} from '../../store/actions/surplus';
import SurplusListItemComponent from '../../components/SurplusListItemComponent';
import SearchInputComponent from '../../components/SearchInputComponent';
import {logoutUser} from '../../store/actions/users';
import { wp } from '../../utils/responsive-screen';

// create a component
const AnalyticsScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {surplus, surplusLoading, updateSurplusLoading, createSurplusLoading} =
    useSelector(x => x.surplus);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  var surplusData = Object.assign([], surplus);
  const [filteredSurplusData, setFilteredSurplusData] = useState(surplusData);
  const [searchInputValue, setSearchInputValue] = useState('');
  //console.log('redux surplus', surplus);
  const dispatch = useDispatch();
  const [isSearchCleared, setIsSearchCleared] = useState(false);

  const showDialog = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'destructive',
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewWithLogout
            backText="Analytics"
            shouldDisplayLogoutIcon
            navigation={navigation}
            style={{right: wp(20)}}
            handleLogout={showDialog}
            onClose={() => navigation.navigate('OrdersStack')}
          />
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
    backgroundColor: COLOURS.zupa_gray_bg,
  },
});

//make this component available to the app
export default AnalyticsScreen;
