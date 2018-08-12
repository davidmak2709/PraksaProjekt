import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Profile extends Component {
constructor(props){
  super(props);
  this.state={
  username:'',
  password:'',
  password2:'',
  email:'',
  emailreset:''
  }
 }



  componentDidMount() {
    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/",
             timeout: 4000,

         });

    instance.get('/rest-auth/user/ ')
     .then(function (response) {
        //dohvacanje tokena i spremanje u session
        console.log(JSON.stringify(response) + "USER INFO");
      })
      .catch(function (error) {
        console.log(error);
      });
    }

 handleClick(event){
   var apiBaseUrl = "http://46.101.226.120:8000/api/";

  var instance = axios.create({
           baseURL: apiBaseUrl,
           timeout: 2000,

       });

  instance.post('/rest-auth/password/reset/ ', {
    email: "negulic17@gmail.com",
  })
  .then(function (response) {
    //dohvacanje tokena i spremanje u session
    console.log(JSON.stringify(response) + "RESET PASS OVER EMAIL");
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
             title="Profile"
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
         <div>
         <AppBar
            title="Reset password"
          />
          <TextField
            hintText="Enter your email"
            floatingLabelText="emailreset"
            onChange = {(event,newValue) => this.setState({emailreset:newValue})}
            />
          <br/>
            <RaisedButton label="Restore password" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
        </div>
         </MuiThemeProvider>
      </div>

    );
  }
}
const style = {
 margin: 15,
};

export default Profile;
