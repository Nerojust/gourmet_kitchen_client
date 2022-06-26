import React, {PureComponent, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {deviceWidth, fp, hp, wp} from '../utils/responsive-screen';
import {Button, Menu, Divider, Provider} from 'react-native-paper';
import AvertaBold from './Text/AvertaBold';

const OrdersSelector = ({onPressIcon}) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const onPressItem = status => {
    onPressIcon(status);
    closeMenu();
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu} style={styles.transpClickableBg}>
          <Image
            source={require('../assets/images/moresettings.png')}
            resizeMode={'contain'}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
      }>
      <>
        <Menu.Item
          onPress={() => onPressItem('messages')}
          title="Messages"
          titleStyle={{
            color: COLOURS.green2,
            fontWeight: 'bold',
            fontSize: fp(15),
          }}
        />
        <Divider />
        <Menu.Item
          onPress={() => onPressItem('delete')}
          titleStyle={{color: COLOURS.red, fontSize: fp(15)}}
          title="Delete all"
        />
      </>
    </Menu>
  );
};
export default OrdersSelector;

const styles = StyleSheet.create({
  statusText: {
    // width: wp(70),
    fontSize: hp(14),
    marginRight: wp(4),
  },
  imageIcon: {width: 18, height: 18, tintColor: COLOURS.gray},
  transpClickableBg: {
    width: 40,
    height: 20,
    //backgroundColor: COLOURS.white,
    justifyContent: 'center',
    alignItems: 'center',
    right: deviceWidth * 0.02,
  },
  text: {color: COLOURS.text_color, padding: 15, fontSize: 14},
  statusButton: {
    width: '100%',
    // borderWidth: 1,
    // height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
