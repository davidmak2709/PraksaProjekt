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
  addform:false,
  wallets:[],
  length:0,
  };
this.handleChange = this.handleChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);

this.handleClick = this.handleClick.bind(this);

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
       //dohvacanje svih walleta
        console.log(response + " " + response.data.length);
        self.setState({length:response.data.length});
        self.setState({wallets:response.data});
        //console.log(this.state.balance + "aaaa");
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
    window.location.reload();

}

handleChange = event => {
  this.setState({
    [event.target.id]: event.target.value
  });
}

renderaddform(){
    if(this.state.addform){
      return   (
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
        </form>);
    }
    else return ;

}
handleClick = event => {

    window.alert("zelite li izbrisati wallet s id-om:"+ event.target.value);

    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/wallets/",
             timeout: 4000,
             headers: {'Authorization': "Token "+this.state.token}

         });

    instance.delete(event.target.value+"/")
     .then(function (response) {
       //brisanje određenog walleta
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      window.location.reload();
    }


renderwallet(){
    //var self =  this;
    var wallets = [];
    for(var i = 0 ; i < this.state.length ; i++){
      if(this.state.wallets[this.state.length-1]){

      var obj = this.state.wallets[i];
      console.log(obj);
      wallets.push(
        <div className="wallet" key={i}>
          <label>Wallet:</label>
          {obj.name}
          <label>balnace:</label>
          {obj.balance} {obj.currency}
          <button type="button" class="btn btn-danger" value={obj.pk} onClick={this.handleClick}>X</button>

        </div>
      )
    }
  }
    return wallets;

}
render() {

    return (
      <div>
      {this.renderwallet()}

      {this.renderaddform()}
      <hr />

      <button type="button" onClick={()=>{this.setState({addform:true})}}>Add new wallet!</button>

      </div>
    );
  }
}


export default Wallet;
