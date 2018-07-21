import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Wallet extends Component {
constructor(props){
  super(props);
  this.state={
  token:window.sessionStorage.getItem("key"),
  value:'',
  name:'',
  currency:'',
  balance:'',
  };
this.handleChange = this.handleChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
 }

  componentDidMount() {
    var self = this;
    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/",
             timeout: 4000,
             headers: {'Authorization': "Token "+this.state.token}

         });
    console.log(this.state.token);
    instance.get('/wallets/ ')
     .then(function (response) {
        //dohvacanje tokena i spremanje u session
        console.log(response);
        self.setState({balance:response.data['0'].balance.toString()});
        //console.log(this.state.balance + "aaaa");
        console.log(response.data['0'].balance);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

handleSubmit(event) {
  alert('wallet created:' + this.state.name);
  event.preventDefault();

  var instance = axios.create({
           baseURL: "http://46.101.226.120:8000/api/",
           timeout: 4000,
           headers: {'Authorization': "Token "+this.state.token}

       });

  instance.post('/wallets/create/',{
    balance: this.state.value ,
    currency: this.state.currency,
    name: this.state.name
  })
   .then(function (response) {
      //dohvacanje tokena i spremanje u session
      console.log(response.data + "USER INFO");
    })
    .catch(function (error) {
      console.log(error);
    });

}
handleChange = event => {
  this.setState({
    [event.target.id]: event.target.value
  });
}
render() {

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Add new wallet:
        </label>
        <label>
          Name:
          <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
        </label>
        <label>
          Value:
          <input type="text" id="value" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Currency:
          <input type="text" id="currency" value={this.state.currency} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <hr />
      <label>balance:
      {this.state.balance}
      </label>
      </div>
    );
  }
}


export default Wallet;
