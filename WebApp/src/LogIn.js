import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends Component {
constructor(props){
  super(props);
  this.state={
  username:'',
  password:''
  }
 }

 handleClick(event){
   var apiBaseUrl = "http://46.101.226.120:8000/api/";
   var self = this;
   var payload={
   "email":this.state.username,
   "password":this.state.password
   }

  var instance = axios.create({
           baseURL: apiBaseUrl,
           timeout: 2000,


       });

  instance.get('/users/')
           .then(function (response) {
               console.log(response);
               window.alert(response.data['0'].email);
           })
           .catch(function (error) {
               console.log(error);

           });

  instance.post('rest-auth/login/ ', {
    username: payload.email,
    password: payload.password,
  })
  .then(function (response) {
    //dohvacanje tokena i spremanje u session
    console.log(JSON.stringify(response) + "TOKEN");
    window.sessionStorage.setItem("key", response.data.key);
    console.log(window.sessionStorage.getItem("key"));
    window.sessionStorage.setItem("username", payload.email);
  })
  .catch(function (error) {
    console.log(error);
  });

}




render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Login"
           />
           <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
         </div>
         </MuiThemeProvider>
      </div>

    );
  }
}
const style = {
 margin: 15,
};

export default Login;
