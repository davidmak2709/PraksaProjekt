import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Signup extends Component {
constructor(props){
  super(props);
  this.state={
  username:'',
  password:'',
  password2:'',
  email:''
  }
 }

 handleClick(event){
   var apiBaseUrl = "http://46.101.226.120:8000/api/";
   var self = this;
   var payload={
   "username":this.state.username,
   "password":this.state.password,
   "password2":this.state.password2,
   "email":this.state.email,
   }

  var instance = axios.create({
           baseURL: apiBaseUrl,
           timeout: 2000,

       });

  instance.post('/rest-auth/registration/ ', {
    username: payload.username,
    password1: payload.password,
    password2: payload.password2,
    email: payload.email,
  })
  .then(function (response) {
    //dohvacanje tokena i spremanje u session
    console.log(JSON.stringify(response) + "TOKEN");
    //// TODO: sucess poruka redirekcija na home + welcome username i logout
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
             title="Sign Up"
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
             <TextField
               type="password"
               hintText="Repeate your Username"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password2:newValue})}
               />
             <br/>
             <TextField
               hintText="Enter your email"
               floatingLabelText="email"
               onChange = {(event,newValue) => this.setState({email:newValue})}
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

export default Signup;
