import React,{Component} from 'react';
import {AsyncStorage,AppRegistry,View, StyleSheet,Text} from 'react-native';
import { Button, FormInput, FormValidationMessage  } from 'react-native-elements';




export default class LoginScreen extends Component {
    static navigationOptions = {
      header: null,
    };

    constructor(){
      super();
      this.state = {
        email : "",
        password : "",
        passwordError : false,
        emailError : false,
        borderColorEmail : "green",
        borderColorPwd : "green",
      };
    }

    loginUser(){
      const email = this.state.email;
      const password = this.state.password;
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

      //provjera mail-a
      if(email == "" || !reg.test(email)){
        this.setState({emailError : true, borderColorEmail : "red"});
        this.emailRef.shake();
      } else{
        this.setState({emailError : false, borderColorEmail : "green"});
      }

      //provjera password-a
      if(password == ""){
        this.setState({passwordError : true, borderColorPwd : "red"});
        this.passwordRef.shake();
      } else {
        this.setState({passwordError : false, borderColorPwd : "green",});
      }

      //ako nema greske poslji post na server
      if(this.state.emailError === false && this.state.passwordError === false){
        fetch('http://46.101.226.120:8000/api/rest-auth/login/', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password
            }),
          }).then((response) => response.json())
            .then((responseJson) => {
              AsyncStorage.setItem("userToken", responseJson.key);
              this.props.navigation.navigate('Home');
            })
            .catch((error) => {
              console.error(error);
            });



      }
    }


    render(){
      const { navigate } = this.props.navigation;
      return(
        <View style = {styles.container}>
          <FormInput placeholder = "Insert your Email" containerStyle = {[styles.input ,{borderColor : this.state.borderColorEmail}]}
              inputStyle = {{width : 250 }} ref={emailRef => this.emailRef = emailRef} underlineColorAndroid="transparent"
                selectionColor = "orangered" autoCapitalize = "none" onSubmitEditing = { () => this.passwordRef.focus()}
                  blurOnSubmit={false}  onChangeText = {(email) => this.setState({email})} keyboardType = "email-address"
                    returnKeyType = "next" />

            {this.state.emailError  ? <FormValidationMessage>Error email</FormValidationMessage> : null }

        <FormInput placeholder = "Insert your Password" containerStyle = {[styles.input ,{borderColor : this.state.borderColorPwd}]}
            inputStyle = {{width : 250}}  secureTextEntry = {true} underlineColorAndroid="transparent" selectionColor = "orangered"
             autoCapitalize = "none" ref={passwordRef => this.passwordRef = passwordRef} onChangeText = {(password) => this.setState({password})}
              returnKeyType = "done"/>

            {this.state.passwordError ? <FormValidationMessage>Error password</FormValidationMessage> : null }


        <View style = {styles.buttonsContainer}>
            <Button raised title = "Login"   backgroundColor="green"  buttonStyle = {styles.button} onPress = {this.loginUser.bind(this)}/>
            <Button raised title = "Sign Up" backgroundColor="darkred" buttonStyle = {styles.button} onPress = {() => navigate('Signup')}/>
          </View>
        </View>
      );
  }

}


const styles = StyleSheet.create({
    container : {
      flex : 1,
      flexDirection : "column",
      justifyContent : "center",
      alignItems : "center",
      backgroundColor : "ghostwhite"
    },
    buttonsContainer : {
      marginTop : 50,
      flexDirection : "row"
    },
    button : {
      width : 100,
      borderColor: "transparent",
      borderWidth: 0
    },
    input : {
      margin : 10,
      alignItems : "center",
      width :300,
      borderRadius : 50,
      backgroundColor : "ghostwhite",
      borderWidth : 2,

    }

});

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);
