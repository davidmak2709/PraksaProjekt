import React from 'react';
import { Text, ScrollView, Dimensions,AsyncStorage, View} from 'react-native';
import LoadingDataDialog from "../components/LoadingDataDialog";
import {FormLabel, FormInput, Button} from 'react-native-elements';

//TODO validacija za nove podatke
//TODO modal za password

const {height, width} = Dimensions.get('window');
export default class UserTab extends React.Component {
  static token;
  constructor(){
    super();
    this.state = {
      username : "",
      email : "",
      firstname : "",
      lastname : "",
      passwordModalVisible : false,
      loading : true
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
               autoCapitalize = "none" onChangeText = {(username) => this.setState({username :  username})} returnKeyType = "none"
                value = {this.state.username}/>

          <FormLabel>Email</FormLabel>

          <FormInput placeholder = "Your Email" inputStyle = {{width : width - 100 }} ref={emailRef => this.emailRef = emailRef}
               autoCapitalize = "none" onChangeText = {(email) => this.setState({email : email})} value = {this.state.email}
                keyboardType = "email-address" returnKeyType = "none" />

          <FormLabel>First Name</FormLabel>

          <FormInput placeholder = "Your first name" inputStyle = {{width : width - 100 }} ref={firstnameRef => this.firstnameRef = firstnameRef}
               autoCapitalize = "none" onChangeText = {(firstname) => this.setState({firstname :  firstname})} returnKeyType = "none"
                value = {this.state.firstname}/>

          <FormLabel>Last Name</FormLabel>

          <FormInput placeholder = "Your last name" inputStyle = {{width : width - 100 }} ref={lastnameRef => this.lastnameRef = lastnameRef}
               autoCapitalize = "none" onChangeText = {(lastname) => this.setState({lastname :  lastname})} returnKeyType = "none"
                value = {this.state.lastname}/>


          <Button title = "Change your password" backgroundColor = "green" buttonStyle = {{marginTop : 25}} icon = {{ name : "save" , size : 20 }} />
          <Button  title = "Save changes" backgroundColor = "darkblue" buttonStyle = {{marginTop : 25}} icon = {{ name : "https" , size : 20 }}
              onPress = {this.saveUserData.bind(this)}/>
          <Button title = "Logout" backgroundColor = "red" buttonStyle = {{marginTop : 25}} icon = {{ name : "exit-to-app" , size : 20 }}
              onPress = {this.logoutUser.bind(this)}/>

        </ScrollView>
      </View>
    );
  }
}
