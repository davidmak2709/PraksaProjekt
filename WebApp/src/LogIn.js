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
   var apiBaseUrl = "http://localhost:4000/api/";
   var self = this;
   var payload={
   "email":this.state.username,
   "password":this.state.password
   }

  var instance = axios.create({
           baseURL: 'http://46.101.226.120:8000/api',
           timeout: 2000,
           withCredentials: true,

       });

       instance.get('/users/')
           .then(function (response) {
               console.log(response);
           })
           .catch(function (error) {
               console.log(error);
           });

  const testURL = 'http://46.101.226.120:8000/api/users/';
 	const myInit = {
         		method: 'GET',
         	};
  const myRequest = new Request(testURL, myInit);
  fetch(myRequest)
    .then(result=> {
        console.log(result);
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
