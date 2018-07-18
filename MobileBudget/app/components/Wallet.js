import React, { Component } from 'react';
import { View, AppRegistry,Dimensions,ActivityIndicator,
    StyleSheet,TouchableOpacity, Alert, Keyboard} from 'react-native';
import {Text, Icon, Divider, FormInput, CheckBox} from 'react-native-elements';
import PropTypes from 'prop-types';
import NewWalletDialog from './NewWalletDialog';

const {height, width} = Dimensions.get('window');

export default class Wallet extends Component {
  static token;
  constructor(props) {
    super(props);
    this.state = {
      visible : true,
      editWallet : false,
      name : this.props.name,
      balance : this.props.balance,
      nameBorderColor : "green",
      balanceBorderColor : "green"
    };
  }

  _deleteWallet(){
    let url = 'http://46.101.226.120:8000/api/wallets/' + this.props.pk + '/';


    fetch(url, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.props.token
         },
       }).then((response) =>   {
            if(response.status == 204){
              this.setState({visible : false, editWallet : false});
            }
         })
         .catch((error) => {
           console.error(error);
         });
  }

  _updateWallet(){
    const name = this.state.name;
    const balance = this.state.balance;

    let nameError = false;
    let balanceError = false;

    let currency = "";

    if(this.state.kuna){
      currency = "HRK"
    } else if (this.state.dollar) {
      currency = "USD"
    } else if (this.state.euro) {
      currency = "EUR"
    } else {
      currency = this.props.currency;
    }

    if(name == "" || name.lenght < 5 || name.lenght > 50){
      nameError = true;
      this.setState({nameBorderColor:"red"});
      this.nameRef.shake();
    } else {
      nameError = false;
      this.setState({nameBorderColor:"green"});

    }

    if(balance == ""){
      balanceError = true;
      this.setState({balanceBorderColor:"red"});
      this.balanceRef.shake();
    } else {
      balanceError = false;
      this.setState({balanceBorderColor:"green"});
    }

    if(nameError === false && balanceError === false){
      fetch('http://46.101.226.120:8000/api/wallets/'+this.props.pk+'/', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Token ' + this.props.token
            },
            body: JSON.stringify({
              balance: balance,
              currency : currency,
              name : name
            }),
          }).then((response) => {
              if(response.status == 200){
                Alert.alert("Updated. Refresh! :)");
              } else {
                Alert.alert("Error");
              }
            })
            .catch((error) => {
              console.error(error);
            });
      }
  }

  render(){
    let color = "darkseagreen";
    let state = this.state.balance;
    if (state < 0) {
      color = "darkred";
    }
    if(this.state.visible){
      return(
        <View style = {styles.main}>
          <View style = {styles.header}>
            <View style = {{flexDirection : "column",flex: 1, flexWrap: 'wrap'}}>
              <Text h4>{this.state.name}</Text>
            </View>
            <View style = {styles.iconsLayout}>
              <Icon color =  "gold" name=  "star-border" size = {30}/>
              <Divider style = {{backgroundColor : "transparent", width : 20}} />
              <Icon color =  "green" name=  "edit" size = {30}
              onPress = {() => this.setState({editWallet : true, visible : false})}/>
              <Divider style = {{backgroundColor : "transparent", width : 20}} />
              <Icon color =  "red" name=  "delete" size = {30}
              onPress = { () => Alert.alert(
                  'Delete ' + this.props.name + ' wallet',
                  'Are you sure?',
                  [
                    {text: 'No', style: 'cancel'},
                    {text: 'Yes', onPress: this._deleteWallet.bind(this)},
                  ],
                  { cancelable: false }
                )
              }
              />
            </View>
          </View>
          <View style = {styles.content}>
            <Text h3>{this.props.currency}</Text>
            <Divider style = {{backgroundColor : "transparent", width : 20}} />
            <Text h2 style = {{color : color}}>{parseFloat(state).toFixed(2)}</Text>
          </View>
        </View>
      );

    } else if (this.state.editWallet) {
      return(
        <View style = {styles.main}>
          <View style = {styles.header}>
            <View style = {{flexDirection : "column",flex: 1, flexWrap: 'wrap'}}>
              <Text h4>Edit your wallet</Text>
            </View>
          <View style = {[styles.iconsLayout,{justifyContent : "flex-end", alignItems : "flex-end"}]}>
            <Icon color =  "red" name=  "close" size = {30}
            onPress = {() => this.setState({editWallet : false, visible : true})}/>
          </View>
        </View>
        <View>
            <FormInput placeholder = "Insert wallet name" containerStyle = {[styles.input, {borderBottomColor : this.state.nameBorderColor}]}  inputStyle = {{width : width * 0.8  * 0.95}}
                underlineColorAndroid="transparent"  selectionColor = "orangered" blurOnSubmit={false} onChangeText = {(name) => this.setState({name : name})}
                  returnKeyType = "next" ref={nameRef => this.nameRef = nameRef} onSubmitEditing = { () => this.balanceRef.focus()}
                  value = {this.state.name} />

            <FormInput placeholder = "Insert account balance" containerStyle = {[styles.input, {borderBottomColor : this.state.balanceBorderColor}]}
              inputStyle = {{width : width * 0.8 * 0.95 }} underlineColorAndroid="transparent" keyboardType = "numeric"  selectionColor = "orangered"
                blurOnSubmit={false}  onSubmitEditing = {() => Keyboard.dismiss()} onChangeText = {(balance) => this.setState({balance : balance})}
                  returnKeyType = "done" ref={balanceRef => this.balanceRef = balanceRef} value = {this.state.balance.toString()} />

            <View style = {styles.currencySelectorContainer}>
              <CheckBox title = "EUR"  center iconRight = {false} checkedIcon="euro"  uncheckedIcon='euro'
                checkedColor='green' uncheckedColor = 'red' checked = {this.state.euro} containerStyle = {styles.currencyOptionContainer}
                  onPress = {() => this.setState({ euro : true, dollar : false, kuna : false})}/>

              <CheckBox title = "USD" center checkedIcon='dollar'  uncheckedIcon='dollar' containerStyle = {styles.currencyOptionContainer}
                checkedColor='green' uncheckedColor = 'red'  checked = {this.state.dollar}
                  onPress = {() => this.setState({ euro : false, dollar : true, kuna : false})} />

              <CheckBox  center title = "HRK" checkedIcon='money'  uncheckedIcon='money'  checked = {this.state.kuna }
                checkedColor='green' uncheckedColor = 'red' containerStyle = {styles.currencyOptionContainer}
                  onPress = {() => this.setState({ euro : false, dollar : false, kuna : true})}/>
          </View>
          <View style = {[styles.iconsLayout,{justifyContent : "center", alignItems : "center", marginRight : 10}]}>
            <TouchableOpacity activeOpacity={0.5} onPress = {this._updateWallet.bind(this)}>
              <Text  style = {{color:"green", fontSize : 22 }}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      );
    } else {
      return ( null);
    }

  }
}

const styles = StyleSheet.create({
    main : {
      height : height * 0.4,
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
    },
    input : {
      alignItems : "center",
      backgroundColor : "transparent",
      borderBottomWidth : 1,
    },
    currencySelectorContainer : {
      flexDirection: "row",
      justifyContent : "center",
    },
    currencyOptionContainer : {
      backgroundColor : "transparent",
    },

});

Wallet.propTypes = {
  name : PropTypes.string.isRequired,
  balance : PropTypes.number.isRequired,
  currency : PropTypes.string.isRequired,
};

AppRegistry.registerComponent('Wallet', () => Wallet);
