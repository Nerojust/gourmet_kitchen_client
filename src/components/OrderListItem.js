import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Image,
  CheckBox,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLOURS} from '../utils/Colours';
import {fp, hp} from '../utils/responsive-screen';
import {formatNumberCommaNaira} from '../utils/utils';
import Averta from './Text/Averta';
import AvertaBold from './Text/AvertaBold';
import TextInputComponent from './TextInputComponent';

export default class OrderListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.qty,
    };
  }
  decrementValue = () => {
    if (this.state.value > 1) {
      this.setState({value: this.state.value - 1});
      //setValue(value - 1);
      this.props.sendValue(this.state.value - 1);
    }
  };

  incrementValue = () => {
    this.setState({value: this.state.value + 1});
    this.props.sendValue(this.state.value + 1);
  };
  handleQtyChange = text => {
    this.props.sendValue(parseInt(text) || 0);
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {paddingVertical: this.props.isEditMode ? 17 : 20},
        ]}>
        <Averta
          style={[styles.citem, {flex: this.props.isEditMode ? 0.6 : 1.6}]}
          numberOfLines={3}>
          {this.props.item
            ? this.props.item + ' (' + this.props.size + ')'
            : null}
        </Averta>
        {this.props.isEditMode ? (
          <View
            style={{
              flex: 1,
              //left: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={this.decrementValue}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOURS.lightGray5,
                width: 30,
                height: 30,
                borderRadius: 30,
              }}>
              <FontAwesome
                name="minus"
                size={hp(15)}
                color={COLOURS.text_color}
              />
            </TouchableOpacity>
            {/* <Averta
              style={{
                marginHorizontal: 10,
                fontSize: 14,
                color: COLOURS.text_color
              }}
            >
              {this.state.value}
            </Averta> */}
            <TextInputComponent
              placeholder={'QTY'}
              handleTextChange={this.handleQtyChange}
              defaultValue={
                this.state.value ? this.state.value.toString() : '0'
              }
              returnKeyType={'next'}
              keyboardType={'number-pad'}
              secureTextEntry={false}
              heightfigure={40}
              length={11}
              widthFigure={55}
              //refValue={phoneNumberRef}
              props={{
                borderWidth: 0,
                textAlign: 'center',
                paddingLeft: 0,
                marginHorizontal: 8,
              }}
            />
            <TouchableOpacity
              onPress={this.incrementValue}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOURS.lightGray5,
                width: 30,
                height: 30,
                borderRadius: 30,
              }}>
              <FontAwesome
                name="plus"
                size={hp(15)}
                color={COLOURS.text_color}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Averta style={[styles.cqty, {}]}>{this.props.qty}</Averta>
        )}

        <AvertaBold
          style={[styles.ctotal, this.props.isEditMode ? {flex: 0.5} : null]}>
          {formatNumberCommaNaira(this.props.total)}
        </AvertaBold>

        {/* delete button */}
        {this.props.isEditMode ? (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              //width: deviceWidth * 0.12,
              flex: 0.1,
              right: -9,
            }}
            onPress={this.props.deleteFromOrderBasket}>
            <Image
              source={require('../assets/images/cancel.png')}
              resizeMode={'contain'}
              style={{width: 10, height: 10}}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.4,
    borderBottomColor: COLOURS.lightGray,
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: COLOURS.white,
  },
  citem: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cqty: {
    //width: wp(80),
    fontSize: fp(15),
    left: 28,
    flex: 1,
    color: COLOURS.textInputColor,
  },

  cprice: {
    fontSize: fp(15),
    flex: 1,
    color: COLOURS.textInputColor,
  },
  ctotal: {
    fontSize: fp(15),
    flex: 1,
    color: COLOURS.textInputColor,
    //left: 38,
    fontWeight: 'bold',
  },
});
