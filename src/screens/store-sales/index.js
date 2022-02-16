//import liraries
import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {DismissKeyboard} from '../../utils/utils';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import ProductSans from '../../components/Text/ProductSans';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSurplus} from '../../store/actions/surplus';
import SurplusListItemComponent from '../../components/SurplusListItemComponent';

// create a component
const StoreSalesScreen = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {surplus, surplusLoading, updateSurplusLoading, createSurplusLoading} =
    useSelector(x => x.surplus);

  //console.log('redux surplus', surplus);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllSurplus());
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   dispatch(getAllSurplus());
  // }, []);

  const renderItems = ({item, index}) => {
    return (
      <SurplusListItemComponent
        item={item}
        handleEditClick={handleChangeSurplusClick}
        handleNormalClick={handleNormalClick}
      />
    );
  };

  const handleChangeSurplusClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: true,
    });
  };
  const handleNormalClick = item => {
    navigation.navigate('StoreSalesDetails', {
      surplus: item,
      edit: false,
    });
  };
  const onRefresh = () => {
    // console.log('refreshed');
    dispatch(getAllSurplus());
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Store Sales"
            onClose={() => navigation.goBack()}
          />

          <FlatList
            data={surplus}
            renderItem={renderItems}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View>
                {!surplusLoading ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      top: 300,
                    }}>
                    <ProductSans
                      style={{fontSize: 16, color: COLOURS.textInputColor}}>
                      No record found
                    </ProductSans>
                  </View>
                ) : null}
              </View>
            }
          />

          <LoaderShimmerComponent isLoading={surplusLoading} />
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
export default StoreSalesScreen;
