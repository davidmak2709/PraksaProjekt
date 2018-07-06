import React, { Component } from 'react';
import { Text ,View, AppRegistry, StyleSheet, Dimensions, AsyncStorage,
          KeyboardAvoidingView, ScrollView,Keyboard, Alert } from 'react-native';
import {FormInput, Button} from 'react-native-elements';

const {height, width} = Dimensions.get('window');

//TODO napraviti u modal da se ispisuju poruuke
//TODO redirekcija na prvi wallet

export default class SignupScreen extends Component {
  static navigationOptions = {
      header: null
  };

  constructor(){
    super();
    this.state = {
      username : "",
      email : "",
      password : "",
      rpassword : "",
      usernameError : false,
      emailError : false,
      passwordError : false,
      borderColorUsername : "green",
      borderColorEmail : "green",
      borderColorPassword : "green",
    };
  }

  createNewUser(){
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const rpassword = this.state.rpassword;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    //provjera username
    if(username == "" || username.lenght < 6){
      this.setState({usernameError : true, borderColorUsername : "red"});
      this.usernameRef.shake();
    } else {
      this.setState({usernameError : false, borderColorUsername : "green"});
    }

    //provjera mail-a
    if(email == "" || !reg.test(email)){
      this.setState({emailError : true, borderColorEmail : "red"});
      this.emailRef.shake();
    } else{
      this.setState({emailError : false, borderColorEmail : "green"});
    }

    //provjera password-a
    if(password == "" || password.lenght < 9 || password != rpassword){
      this.setState({passwordError : true, borderColorPassword : "red"});
      this.passwordRef.shake();
      this.repeatPasswordRef.shake();
    } else {
      this.setState({passwordError : false, borderColorPassword : "green",});
    }

    if(this.state.usernameError === false && this.state.passwordError === false
          && this.state.emailError === false){

            fetch('http://46.101.226.120:8000/api/rest-auth/registration/', {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username : username,
                  email: email,
                  password1: password,
                  password2: password,
                }),
              }).then((response) => response.json())
                .then((responseJson) => {
                  if(responseJson.key){
                    AsyncStorage.setItem("userToken", responseJson.key);
                    this.props.navigation.navigate('Home');
                  }else {
                    let errorMsg = "";

                    if(responseJson.username)
                      errorMsg = errorMsg.concat(responseJson.username.join("\n"));

                    if(responseJson.email)
                      errorMsg = errorMsg.concat("\n" + responseJson.email.join("\n"));

                    if(responseJson.password1)
                      errorMsg = errorMsg.concat("\n" + responseJson.password1.join("\n"));

                    Alert.alert("Error",errorMsg);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
          }
  }

  render() {
    return (
    <View style = {{flex : 1,  backgroundColor : "ghostwhite"}}>
        <ScrollView>
              <KeyboardAvoidingView style = {styles.container}  behavior="padding" enabled>
                <Text style = {{fontSize : 32, marginTop : 5 }}>Welcome!</Text>

                <FormInput placeholder = "Insert your Username (min. 5 char)" containerStyle = {[styles.input ,{borderColor : this.state.borderColorUsername}]}
                  inputStyle = {{width : width - 100}}  ref={usernameRef => this.usernameRef = usernameRef} onChangeText = {(username) => this.setState({username})}
                    onSubmitEditing = { () => this.emailRef.focus()} underlineColorAndroid="transparent" blurOnSubmit={false}
                      returnKeyType = "next" />

                <FormInput placeholder = "Insert your Email" containerStyle = {[styles.input ,{borderColor : this.state.borderColorEmail}]}
                    inputStyle = {{width : width - 100}} underlineColorAndroid="transparent" autoCapitalize = "none"
                      onChangeText = {(email) => this.setState({email})} onSubmitEditing = { () => this.passwordRef.focus()} blurOnSubmit={false}
                        keyboardType = "email-address" returnKeyType = "next"   ref={emailRef => this.emailRef = emailRef}/>

                <FormInput placeholder = "Insert your Password (min. 8 char)" containerStyle = {[styles.input ,{borderColor : this.state.borderColorPassword}]}
                    inputStyle = {{width : width - 100}}  secureTextEntry = {true} underlineColorAndroid="transparent" autoCapitalize = "none"
                      onChangeText = {(password) => this.setState({password})} blurOnSubmit={false} returnKeyType = "next"
                        onSubmitEditing = { () => this.repeatPasswordRef.focus()} ref={passwordRef => this.passwordRef = passwordRef}/>

                <FormInput placeholder = "Repeat your Password" containerStyle = {[styles.input ,{borderColor : this.state.borderColorPassword}]}
                  inputStyle = {{width : width - 100}}  secureTextEntry = {true} underlineColorAndroid="transparent" autoCapitalize = "none"
                    onChangeText = {(rpassword) => this.setState({rpassword})} blurOnSubmit={false} returnKeyType = "done"
                      onSubmitEditing = { () => Keyboard.dismiss()} ref={repeatPasswordRef => this.repeatPasswordRef = repeatPasswordRef}/>

              </KeyboardAvoidingView>
        </ScrollView>
        <KeyboardAvoidingView style =  {styles.buttonContainer} disable>
            <Button icon={{ name: 'clear', size : 35 }}  buttonStyle = {styles.button}  backgroundColor = "red" onPress = {() => this.props.navigation.goBack()}/>
            <Button icon={{ name: 'done', size : 35 }}  buttonStyle = {styles.button} backgroundColor = "green"  onPress = {this.createNewUser.bind(this)}/>
        </KeyboardAvoidingView>
      </View>
          );
  }
}


const styles = StyleSheet.create({
    container : {
      flex : 5,
      flexDirection : "column",
      justifyContent : "center",
      alignItems : "center",

    },
    input : {
      margin : 5,
      alignItems : "center",
      width : width - 50,
      borderRadius : 50,
      backgroundColor : "ghostwhite",
      borderWidth : 2,
    },
    button : {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom : height * 0.05,
      marginRight : width * 0.05,
      marginLeft : width * 0.05,
    },
    buttonContainer : {
      flex : 1,
      flexDirection: "row",
      justifyContent : "space-between",
      alignItems : "flex-end"
    }
});


AppRegistry.registerComponent('SignupScreen', () => SignupScreen);
