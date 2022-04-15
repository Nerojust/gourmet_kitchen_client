import React, {PureComponent, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {COLOURS} from '../utils/Colours';
import {deviceWidth, hp, wp} from '../utils/responsive-screen';
import AvertaBold from './Text/AvertaBold';

export default class OrdersSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      showMenu: false,
    };
  }
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  closeMenu = () => {
    this._menu.hide();
  };

  openMenu = () => {
    this._menu.show();
  };

  onPressItem = status => {
    this.props.onPressIcon(status);
    this.closeMenu();
  };

  render() {
    return (
      <Menu
        animationDuration={200}
        ref={this.setMenuRef}
        anchor={
          <TouchableOpacity
            onPress={this.openMenu}
            style={styles.transpClickableBg}>
            <Image
              source={require('../assets/images/moresettings.png')}
              resizeMode={'contain'}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        }>
        <>
          <MenuItem onPress={() => this.onPressItem('delete')}>
            <AvertaBold style={styles.text}>Delete All</AvertaBold>
          </MenuItem>
          <MenuDivider />
        </>
      </Menu>
    );
  }
}

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
