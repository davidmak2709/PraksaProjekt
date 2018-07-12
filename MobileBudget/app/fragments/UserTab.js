import React from 'react';
import { Text, ScrollView, Dimensions,AsyncStorage, View, Alert} from 'react-native';
import LoadingDataDialog from "../components/LoadingDataDialog";
import PasswordChangeDialog from "../components/PasswordChangeDialog";
import ErrorDialog from "../components/ErrorDialog";
import {FormLabel, FormInput, Button} from 'react-native-elements';


const {height, width} = Dimensions.get('window');
export default class UserTab extends React.Component {
  static token;
  static oldUsername;
  constructor(){
    super();
    this.state = {
      username : "",
      email : "",
      firstname : "",
      lastname : "",
      passwordModalVisible : false,
      loading : true,
      errorDialogVisible : false,
      errorMsg : "",
      saveChangesButtonDisabled : true
    };

    this._getUserData();
  }


  logoutUser(){
    AsyncStorage.removeItem("userToken");
    this.props.navigation.navigate("Auth");
  }

  _getUserData = async () =>{

    const userToken = await AsyncStorage.getItem('userToken');
    token = userToken;

   fetch('http://46.101.226.120:8000/api/rest-auth/user/', {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Token ' + token
        },
      }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            username :  responseJson.username,
            email : responseJson.email,
            firstname : responseJson.first_name,
            lastname : responseJson.last_name,
            loading : false
          });
          oldUsername = responseJson.username;
        })
        .catch((error) => {
          console.error(error);
        });
  }

  saveUserData(){
    fetch('http://46.101.226.120:8000/api/rest-auth/user/', {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
         },
         body: JSON.stringify({
           username: this.state.username,
           email : this.state.email,
           first_name : this.state.firstname,
           last_name : this.state.lastname
         }),
       }).then((response) =>  {
         if(response.status == 200){
           Alert.alert("Result","Data successfully updated.");
         } else {
           response.json().then((data) => {
                if(data.username){
                  this.setState({errorMsg : data.username.join(), errorDialogVisible : true});
                }

            });
        }

       }).catch((error) => {
           console.error(error);
         });
  }



  render() {
    return (
      <View>

      {this.state.loading ? <LoadingDataDialog /> : null }

        <ScrollView contentContainerstyle={{ flex: 1, justifyContent: 'flex-start', alignItems: '', marginTop : 25 , marginLeft : 10,
              marginRight : 10 , marginBottom : 10 }}>
          <FormLabel>Username</FormLabel>

          <FormInput placeholder = "Your Username" inputStyle = {{width : width - 100 }} ref={usernameRef => this.usernameRef = usernameRef}
           onChangeText = {(username) => this.setState({username :  username, errorDialogVisible : false,passwordModalVisible : false, saveChangesButtonDisabled : false})}
           returnKeyType = "none" autoCapitalize = "none" value = {this.state.username}/>

          <FormLabel>Email</FormLabel>

          <FormInput placeholder = "Your Email" inputStyle = {{width : width - 100 }} editable={false} value = {this.state.email}/>

          <FormLabel>First Name</FormLabel>

          <FormInput placeholder = "Your first name" inputStyle = {{width : width - 100 }} ref={firstnameRef => this.firstnameRef = firstnameRef}
           onChangeText = {(firstname) => this.setState({firstname :  firstname, errorDialogVisible : false,passwordModalVisible : false, saveChangesButtonDisabled : false})}
               returnKeyType = "none"  autoCapitalize = "none" value = {this.state.firstname}/>

          <FormLabel>Last Name</FormLabel>

          <FormInput placeholder = "Your last name" inputStyle = {{width : width - 100 }} ref={lastnameRef => this.lastnameRef = lastnameRef}
           onChangeText = {(lastname) => this.setState({lastname :  lastname, errorDialogVisible : false,passwordModalVisible : false, saveChangesButtonDisabled : false})}
               returnKeyType = "none" autoCapitalize = "none" value = {this.state.lastname}/>


          <Button title = "Change your password" backgroundColor = "green" buttonStyle = {{marginTop : 25}} icon = {{ name : "save" , size : 20 }}
            onPress = {() => this.setState({passwordModalVisible : true, errorDialogVisible : false})}/>

          <Button disabled = {this.state.saveChangesButtonDisabled} title = "Save changes" backgroundColor = "darkblue" buttonStyle = {{marginTop : 25}} icon = {{ name : "https" , size : 20 }}
              onPress = {this.saveUserData.bind(this)}/>

          <Button title = "Logout" backgroundColor = "red" buttonStyle = {{marginTop : 25, marginBottom : 25}} icon = {{ name : "exit-to-app" , size : 20 }}
              onPress = {this.logoutUser.bind(this)}/>

        </ScrollView>
        <PasswordChangeDialog  visible = {this.state.passwordModalVisible}/>
        <ErrorDialog visible = {this.state.errorDialogVisible} message = {this.state.errorMsg} />
      </View>
    );
  }
}
