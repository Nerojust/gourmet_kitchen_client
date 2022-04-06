import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Text,
  Keyboard,
} from 'react-native';

import ProductSans from './Text/ProductSans';
import TextInputComponent from './TextInputComponent';
import ProductSansBold from './Text/ProductSansBold';
import LoaderShimmerComponent from './LoaderShimmerComponent';
import EmptyComponent from './EmptyComponent';
import AddComponent from './AddComponent';
import {NAIRA_} from '../utils/Constants';
import {deviceWidth, deviceHeight} from '../utils/responsive-screen';
import {COLOURS} from '../utils/Colours';
import {IMAGES} from '../utils/Images';

const DeliveryListComponent = ({
  dataSource,
  handleSingleItemPress,
  handleInputSearchText,
  InputValue,
  closeAction,
  handleRefresh,
  isDeliveryLoading,
  handleAddDelivery,
}) => {
  const renderItem = ({item}) => {
    //console.log("item", item);
    return (
      <>
        {item?.isActive ? (
          <>
            <TouchableOpacity
              style={styles.itemView}
              onPress={() => handleSingleItemPress(item)}>
              <Text style={styles.itemText}>{item?.name}</Text>
              <Text style={styles.itemPriceText}>
                {NAIRA_}
                {item?.price}
              </Text>
            </TouchableOpacity>

            {/* line divider */}
            <View
              style={{
                width: deviceWidth,
                backgroundColor: COLOURS.lightGray,
                height: 0.5,
              }}
            />
          </>
        ) : null}
      </>
    );
  };
  return (
    <SafeAreaView
      style={{
        //alignItems: "center",
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
      }}>
      {isDeliveryLoading ? null : (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{alignSelf: 'flex-start', left: 28, marginBottom: 15}}
            onPress={closeAction}>
            <ProductSans
              style={{
                color: COLOURS.zupaBlue,
                fontSize: 13,
              }}>
              Close
            </ProductSans>
          </TouchableOpacity>

          <TextInputComponent
            placeholder={'Search Delivery Types'}
            handleTextChange={handleInputSearchText}
            defaultValue={InputValue}
            returnKeyType={'go'}
            keyboardType={'default'}
            secureTextEntry={false}
            props={{
              width: deviceWidth * 0.88,
              borderWidth: 0,
            }}
            heightfigure={50}
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <View style={{paddingBottom: 20}} />

          {dataSource && dataSource.length > 0 ? (
            <>
              <FlatList
                data={dataSource}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                renderItem={renderItem}
                keyboardShouldPersistTaps={'handled'}
              />
              {/* <AddComponent goto={handleAddDelivery} style={{ bottom: 70 }} /> */}
              <View style={{paddingBottom: 10}} />
            </>
          ) : (
            <TouchableOpacity
              style={styles.noResultView}
              activeOpacity={1}
              onPress={() => Keyboard.dismiss()}>
              <EmptyComponent
                title={'No delivery types found'}
                image={IMAGES.noCategories}
                style={{top: -160}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRefresh(false, false, true)}>
                  <ProductSansBold
                    style={[
                      styles.noResultText,
                      {color: COLOURS.blue, marginTop: 20},
                    ]}>
                    Click to refresh
                  </ProductSansBold>
                </TouchableOpacity>
              </EmptyComponent>
              {/* <AddComponent goto={handleAddDelivery} /> */}
            </TouchableOpacity>
          )}
        </>
      )}
      <LoaderShimmerComponent
        isLoading={isDeliveryLoading}
        // loadingMessage={"Fetching delivery types"}
      />
    </SafeAreaView>
  );
};

export default DeliveryListComponent;

const styles = StyleSheet.create({
  itemView: {
    width: deviceWidth,
    justifyContent: 'center',
    fontSize: 13,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: COLOURS.white,
    marginBottom: 5,
    paddingHorizontal: 30,
  },
  itemPriceText: {
    fontWeight: 'bold',
    width: deviceWidth,
    fontSize: 13,
    marginTop: 10,
    color: COLOURS.black,
  },
  itemText: {
    color: COLOURS.text_color,
    width: '100%',
    fontSize: 14,
  },
  noResultView: {
    alignSelf: 'center',
    height: deviceHeight - 260,
    width: deviceWidth,
    //justifyContent: "center",
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOURS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
