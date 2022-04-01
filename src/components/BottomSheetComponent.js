import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {deviceHeight} from '../utils/responsive-screen';
import ProductListComponent from '../components/ProductListComponent';
import {COLOURS} from '../utils/Colours';
import DeliveryListComponent from './DeliveryListComponent';

export function BottomSheetProductComponent({
  sheetRef,
  dataSource,
  filteredDataSource,
  handleSingleItemPress,
  addProductPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  isProductLoading,
  handleSearchInputSubmit,
  handleRefresh,
  handleAddProduct,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <ProductListComponent
        dataSource={dataSource}
        filteredDataSource={filteredDataSource}
        closeAction={closeAction}
        handleRefresh={() => handleRefresh(true, false)}
        handleAddProduct={handleAddProduct}
        isProductLoading={isProductLoading}
        handleSearchInputSubmit={handleSearchInputSubmit}
        handleSingleItemPress={item => handleSingleItemPress(item, true, false)}
        addProductPress={() => addProductPress()}
        inputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
      />
    </RBSheet>
  );
}
export function BottomSheetZupaAssociateProductComponent({
  sheetRef,
  dataSource,
  filteredDataSource,
  handleSingleItemPress,
  addProductPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  isProductLoading,
  handleSearchInputSubmit,
  handleRefresh,
  handleAddProduct,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <ProductListComponent
        dataSource={dataSource}
        filteredDataSource={filteredDataSource}
        closeAction={closeAction}
        handleRefresh={handleRefresh}
        handleAddProduct={handleAddProduct}
        isProductLoading={isProductLoading}
        handleSearchInputSubmit={handleSearchInputSubmit}
        handleSingleItemPress={item =>
          handleSingleItemPress(item, false, true)
        }
        addProductPress={() => addProductPress()}
        inputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
      />
    </RBSheet>
  );
}

export function BottomSheetDeliveryTypesComponent({
  sheetRef,
  dataSource,
  handleSingleItemPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  handleRefresh,
  isDeliveryLoading,
  handleAddDelivery,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={false}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          //backgroundColor: COLOURS.zupaBlue,
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <DeliveryListComponent
        dataSource={dataSource}
        closeAction={closeAction}
        handleRefresh={() => handleRefresh(false, true, false)}
        isDeliveryLoading={isDeliveryLoading}
        handleSingleItemPress={item =>
          handleSingleItemPress(item, false, true, false)
        }
        InputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
        handleAddDelivery={handleAddDelivery}
      />
    </RBSheet>
  );
}
