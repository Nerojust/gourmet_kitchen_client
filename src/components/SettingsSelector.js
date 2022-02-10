import React, {PureComponent,useState} from 'react';
import {StyleSheet,  View, Text,Image, TouchableOpacity} from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {COLOURS} from '../utils/Colours';
import {deviceWidth, hp, wp} from '../utils/responsive-screen';
import AvertaBold from './Text/AvertaBold';

export default class SettingsSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      showMenu: false
    };
  }
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  closeMenu = () => {
    this._menu.hide();
  };

  openMenu = () => {
    this._menu.show();
  };

  onPressItem = (status) => {
    this.props.onPressIcon(status);
    this.closeMenu();
  };

  render() {
    return (
      <Menu
        animationDuration={200}
        ref={this.setMenuRef}
        button={
          <TouchableOpacity
            onPress={this.openMenu}
            style={styles.transpClickableBg}
          >
            <Image
              source={require('../assets/images/moresettings.png')}
              resizeMode={'contain'}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        }
      >
        <>
          <MenuItem onPress={() => this.onPressItem('Edit')}>
            <AvertaBold style={styles.text}>Edit</AvertaBold>
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={() => this.onPressItem('Send to dispatch')}>
            <AvertaBold style={[styles.text, { color: COLOURS.blue }]}>
              Send to dispatch
            </AvertaBold>
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={() => this.onPressItem('Print')}>
            <AvertaBold style={styles.text}>Print</AvertaBold>
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={() => this.onPressItem('Delete')}>
            <AvertaBold style={[styles.text, { color: COLOURS.red }]}>
              Delete
            </AvertaBold>
          </MenuItem>
        </>
      </Menu>
    );
  }
}

// export default function App() {
//   const [visible, setVisible] = useState(false);

//   const hideMenu = () => setVisible(false);

//   const showMenu = () => setVisible(true);

//   return (
//     <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
//       <Menu
//         visible={visible}
//         anchor={<Text onPress={showMenu}>Show menu</Text>}
//         onRequestClose={hideMenu}
//       >
//         <MenuItem onPress={hideMenu}>Menu item 1</MenuItem>
//         <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
//         <MenuItem disabled>Disabled item</MenuItem>
//         <MenuDivider />
//         <MenuItem onPress={hideMenu}>Menu item 4</MenuItem>
//       </Menu>
//     </View>
//   );
// }
const styles = StyleSheet.create({
  statusText: {
    // width: wp(70),
    fontSize: hp(14),
    marginRight: wp(4),
  },
  imageIcon: {width: 18, height: 18},
  transpClickableBg: {
    width: 40,
    height: 20,
    backgroundColor: COLOURS.white,
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
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: COLOURS.lightGray,
  },
  dropDownMenu: {
    flex: 1,
    height: 30,
    width: 300,
    position: 'absolute',
    // borderWidth: 1,
    backgroundColor: 'white',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: 44 * 5,
    zIndex: 100,
    // borderWidth: 1,
  },
  iconshape: {
    width: wp(42),
    height: wp(42),
    backgroundColor: 'rgba(110,122,255,0.17)',
    borderRadius: wp(21),
    justifyContent: 'center',
    alignItems: 'center',
  },

  harrow: {
    fontSize: hp(10),
    marginLeft: wp(4),
  },
});
