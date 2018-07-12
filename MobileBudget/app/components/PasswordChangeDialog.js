import React, { Component } from 'react';
import { View, AppRegistry, StyleSheet, Dimensions, TouchableHighlight, Modal,
          AsyncStorage, Alert } from 'react-native';
import { Text, Icon, FormInput,FormLabel, Divider} from 'react-native-elements';

const {height, width} = Dimensions.get('window');
//TODO napraviti da se zahtjeva stara lozinka i provjeriti
export default class PasswordChangeDialog extends Component {

  constructor(props) {
    super();
    this.state = {
      modalVisible : props.visible,
      passwordVisible : false,
      rPasswordVisible : false,
      oldPasswordVisible : false,
      password1 : "",
      password2 : "",
      oldPassword : "",
    };
  }



  componentWillReceiveProps(nextProps) {
        this.setErrorDialogVisible(nextProps.visible);
    }

  setErrorDialogVisible(visible) {
      if(this.state.modalVisible != visible)
        this.setState({modalVisible : visible});
     }

   saveNewPassword= async () => {
     const userToken = await AsyncStorage.getItem('userToken');
     token = userToken;

     if(this.state.password1 != "" && this.state.password2 != "" && this.state.oldPassword != ""){
       fetch('http://46.101.226.120:8000/api/rest-auth/password/change/', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Token ' + token,
               "OLD_PASSWORD_FIELD_ENABLED" : true
            },
            body: JSON.stringify({
              new_password1 : this.state.password1,
              new_password2 : this.state.password2,
              old_password : this.state.oldPassword,
            }),
          }).then((response) =>  response.json())
            .then((responseJson) => {
              let resultMessage = "";

              if(responseJson.new_password2)
                resultMessage = resultMessage.concat(responseJson.new_password2.join("\n"));

              if(responseJson.detail)
                resultMessage = resultMessage.concat(responseJson.detail);

              Alert.alert("Result", resultMessage)
              console.log(responseJson);
            }).catch((error) => {
              console.error(error);
            });
     }
   }

  render(){
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          console.log("Close.");
        }}>
          <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style = {styles.header}>
                    <Text style = {{marginTop : 10 , fontSize : 20}}>Change password</Text>
                    <Icon containerStyle = {{marginTop : 5}} name='key'  type='material-community' size = {30} color = "green"/>
                </View>
                <View style = {styles.main}>

                  <View style = {styles.inputView}>
                    <FormInput placeholder = "Insert new password" inputStyle = {{ width :  width * 0.65}}  ref={passwordRef => this.passwordRef = passwordRef}
                      autoCapitalize = "none" onChangeText = {(password1) => this.setState({password1 :  password1})} returnKeyType = "next" blurOnSubmit={false}
                        secureTextEntry = {!this.state.passwordVisible} onSubmitEditing = {() => this.rPasswordRef.focus()}/>

                      <Icon containerStyle = {{marginTop : 5}} name={this.state.passwordVisible ? 'eye' : 'eye-off-outline'} type='material-community' size = {22}
                        color ={ this.state.passwordVisible ? "green" : "gray" }  onPress = {() => this.setState({passwordVisible : !this.state.passwordVisible})}/>
                  </View>

                  <View style = {styles.inputView}>
                    <FormInput placeholder = "Repeat new password " inputStyle = {{ width :  width * 0.65}}  ref={rPasswordRef => this.rPasswordRef = rPasswordRef}
                      autoCapitalize = "none" onChangeText = {(password2) => this.setState({password2 :  password2})} returnKeyType = "next" blurOnSubmit={false}
                        secureTextEntry = {!this.state.rPasswordVisible} onSubmitEditing = {() => this.oldPasswordRef.focus()}/>

                      <Icon containerStyle = {{marginTop : 5}} name={this.state.rPasswordVisible ? 'eye' : 'eye-off-outline'} type='material-community' size = {22}
                        color ={ this.state.rPasswordVisible ? "green" : "gray" }  onPress = {() => this.setState({rPasswordVisible : !this.state.rPasswordVisible})}/>
                  </View>

                  <View style = {styles.inputView}>
                    <FormInput placeholder = "Insert your old password" inputStyle = {{ width :  width * 0.65}}  ref={oldPasswordRef => this.oldPasswordRef = oldPasswordRef}
                      autoCapitalize = "none" onChangeText = {(oldPassword) => this.setState({oldPassword :  oldPassword})} returnKeyType = "done" blurOnSubmit={true}
                        secureTextEntry = {!this.state.oldPasswordVisible}/>

                      <Icon containerStyle = {{marginTop : 5}} name={this.state.oldPasswordVisible ? 'eye' : 'eye-off-outline'} type='material-community' size = {22}
                        color ={ this.state.oldPasswordVisible ? "green" : "gray" }  onPress = {() => this.setState({oldPasswordVisible : !this.state.oldPasswordVisible})}/>
                  </View>

                </View>
                <View style = {styles.footer}>

                  <TouchableHighlight
                    underlayColor="ghostwhite"
                    onPress={() => {
                      this.setErrorDialogVisible(false)
                    }}>
                    <Text  style = {{color:"red", fontSize : 22 }}>CLOSE</Text>
                  </TouchableHighlight>

                  <Divider style = {{ width  : 20, backgroundColor : "white"}}  />

                  <TouchableHighlight
                    underlayColor="ghostwhite"
                    onPress={this.saveNewPassword}>
                    <Text  style = {{color:"green", fontSize : 22 }}>SAVE</Text>
                  </TouchableHighlight>

                </View>
              </View>
          </View>
      </Modal>
  );
  }
}

const styles = StyleSheet.create({
    container :{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : 'rgba(0,0,0,0.5)'
    },
    contentContainer : {
      width: width * 0.9,
      height: height * 0.65,
      backgroundColor : "white"
    },
    header : {
      flex : 1,
      flexDirection : "row",
      justifyContent : "space-between",
      alignItems : "center",
      marginLeft : 25,
      marginRight : 25
    },
    main :{
      flex : 2,
      justifyContent : "center",
      alignItems : "center",
      marginLeft : 10,
      marginRight : 10,
      borderTopColor : "black",
      borderTopWidth : 1
    },
    inputView : {
      flex : 1,
      flexDirection : "row",
      justifyContent : "space-evenly"

    },
    footer :  {
      flex : 1,
      flexDirection : "row",
      justifyContent : "space-evenly",
      alignItems : "flex-end",
      // marginRight : 25,
      marginBottom : 25
    },
});

AppRegistry.registerComponent('PasswordChangeDialog', () => PasswordChangeDialog);
