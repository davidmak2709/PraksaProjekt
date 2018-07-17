import React, { Component } from 'react';
import { View, AppRegistry,Dimensions,ActivityIndicator,
    StyleSheet, ImageBackground} from 'react-native';
import {Text, Icon, Divider} from 'react-native-elements';
import PropTypes from 'prop-types';
const {height, width} = Dimensions.get('window');

export default class Wallet extends Component {
  constructor(props) {
    super();
  }

  render(){
    let color = "darkseagreen";
    let state = this.props.balance;
    if (state < 0) {
      color = "darkred";
    }
    return(
      <View style = {styles.main}>
        <View style = {styles.header}>
          <View style = {{flexDirection : "column",flex: 1, flexWrap: 'wrap'}}>
            <Text h4>{this.props.name}</Text>
          </View>
          <View style = {styles.iconsLayout}>
            <Icon color =  "gold" name=  "star-border" size = {30}/>
            <Divider style = {{backgroundColor : "transparent", width : 20}} />
            <Icon color =  "green" name=  "edit" size = {30}/>
            <Divider style = {{backgroundColor : "transparent", width : 20}} />
            <Icon color =  "red" name=  "delete" size = {30}/>
          </View>
        </View>
        <View style = {styles.content}>
          <Text h3>{this.props.currency}</Text>
          <Divider style = {{backgroundColor : "transparent", width : 20}} />
          <Text h2 style = {{color : color}}>{parseFloat(state).toFixed(2)}</Text>
        </View>
      </View>
  );
  }
}

const styles = StyleSheet.create({
    main : {
      height : height * 0.3,
      width : width * 0.85,
      margin : 10,
      backgroundColor : "transparent",
      borderColor : "green",
      borderWidth : 1,
    },
    header : {
      alignItems : "center",
      flexDirection : "row",
      justifyContent : "space-between",
      height : height * 0.3 * 0.2,
      padding : 10
    },
    iconsLayout : {
      flexDirection : "row",
      justifyContent : "space-between"
    },
    content : {
      flexDirection : "row",
      alignItems : "flex-end",
      justifyContent : "flex-end",
      height : height * 0.3 * 0.7,
      padding : 10
    }

});

Wallet.propTypes = {
  name : PropTypes.string.isRequired,
  balance : PropTypes.number.isRequired,
  currency : PropTypes.string.isRequired,
};

AppRegistry.registerComponent('Wallet', () => Wallet);
