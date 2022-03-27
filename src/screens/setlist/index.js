//import liraries
import React, {useEffect, useState} from 'react';
import {View, FlatList, RefreshControl, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import {BackViewMoreSettings} from '../../components/Header';
import {getAllSets} from '../../store/actions/sets';
import SetItemComponent from '../../components/SetItemComponent';

// create a component
const SetListScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const {createSetsLoading, sets, setsLoading} = useSelector(x => x.sets);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    dispatch(getAllSets());
  };

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const handleClick = item => {
    navigation.navigate('SetDetails', {
      set: item,
    });
  };

  const renderItems = ({item, index}) => {
    return <SetItemComponent item={item} handleClick={handleClick} />;
  };

  const handleNewSet = () => {
    navigation.navigate('AddSet');
  };

  return (
    <ViewProviderComponent>
      <BackViewMoreSettings
        backText="Custom Set List"
        onClose={() => navigation.goBack()}
      />

      <FlatList
        data={sets}
        renderItem={renderItems}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View>
            {!setsLoading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  top: Platform.OS == 'ios' ? 300 : 0,
                  marginTop: Platform.OS == 'android' ? 300 : 0,
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
      <AddComponent goto={handleNewSet} />
      <LoaderShimmerComponent isLoading={setsLoading} />
    </ViewProviderComponent>
  );
};

//make this component available to the app
export default SetListScreen;
