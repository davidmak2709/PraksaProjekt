import React, { Component } from 'react';
import { View, AppRegistry, KeyboardAvoidingView, StyleSheet,
          Dimensions, ScrollView,BackHandler, Keyboard, Platform } from 'react-native';
import {FormInput, CheckBox, SocialIcon, Text,} from 'react-native-elements';

// "baa1edeebd7c1e2e6be67790a943bd2c88e6bf0f"

const {height, width} = Dimensions.get('window');
export default class NewWalletScreen extends Component {
  static navigationOptions = {
      header: null
  };


  constructor(props){
    super(props);
    this.state= {
      euro : true,
      dollar : false,
      kuna : false,
      nameError : false,
      balanceError : false,
      name : "",
      balance : 0,
    };

  }

  componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.navigate("App");
        return true;
    };

  createNewWallet(){
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
    }

    if(name == "" || name.lenght < 5 || name.lenght > 50){
      nameError = true;
      this.nameRef.shake();
    } else {
      nameError = false;
    }

    if(balance == ""){
      balanceError = true;
      this.balanceRef.shake();
    } else {
      balanceError = false;
    }

    if(nameError === false){
      fetch('http://46.101.226.120:8000/api/wallets/create/', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Token ' + 'baa1edeebd7c1e2e6be67790a943bd2c88e6bf0f'
            },
            body: JSON.stringify({
              balance: 300.00,
              currency : "HRK",
              name : "Moj prvi novčanik"
            }),
          }).then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error(error);
            });
      }
  }

  render() {
    return (
      <View style = {{backgroundColor : "ghostwhite", flex : 1}}>
      <ScrollView>
          <KeyboardAvoidingView enabled behavior = "padding" style = {styles.container} enabled>

            <FormInput placeholder = "Insert new wallet name" containerStyle = {styles.input}  inputStyle = {{width : width - 100}}
                underlineColorAndroid="transparent"  selectionColor = "orangered" blurOnSubmit={false} onChangeText = {(name) => this.setState({name : name})}
                  returnKeyType = "next" ref={nameRef => this.nameRef = nameRef} onSubmitEditing = { () => this.balanceRef.focus()} />

                <FormInput placeholder = "Insert current account balance" containerStyle = {styles.input}  inputStyle = {{width : width - 100}}
                    underlineColorAndroid="transparent" keyboardType = "numeric"  selectionColor = "orangered" blurOnSubmit={false}  onSubmitEditing = {() => Keyboard.dismiss()}
                      onChangeText = {(balance) => this.setState({balance : balance})}  returnKeyType = "done" ref={balanceRef => this.balanceRef = balanceRef} />

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
          </KeyboardAvoidingView>
        </ScrollView>
        <KeyboardAvoidingView style =  {styles.buttonContainer} disable>
          <SocialIcon raised style = {[styles.button, {backgroundColor : "green"}]} button  type='home'
            onPress = {() => this.props.navigation.navigate("App")} behavior= {(Platform.OS === 'ios')? "padding" : null}
              keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}/>
          <SocialIcon raised style = {[styles.button, {backgroundColor : "green"}]} button  type='plus'
            onPress = {this.createNewWallet.bind(this)} behavior= {(Platform.OS === 'ios')? "padding" : null}
              keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}/>
        </KeyboardAvoidingView>
      </View>
      );
  }
}

const styles = StyleSheet.create({
    container : {
      flex : 1,
      marginTop : height * 0.15,
      flexDirection: "column",
      alignItems : "center"
    },
    input : {
        margin : 10,
        alignItems : "center",
        width : width - 50,
        borderRadius : 50,
        backgroundColor : "ghostwhite",
        borderColor : "green",
        borderWidth : 2,
      },
      currencySelectorContainer : {
        flexDirection: "row",
        justifyContent : "center",
      },
      currencyOptionContainer : {
        backgroundColor : "ghostwhite",
      },
      button : {
          width: 60,
          height: 60,
          borderRadius: 30,
          marginBottom : height * 0.1,
          marginRight : width * 0.1,
          marginLeft : width * 0.1,
        },
      buttonContainer : {
          flex : 1,
          flexDirection: "row",
          justifyContent : "space-between",
          alignItems : "center"
        }

});


AppRegistry.registerComponent('NewWalletScreen', () => NewWalletScreen);
