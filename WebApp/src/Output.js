import React, { Component } from 'react';
import axios from 'axios';
var Dropdown = require('react-simple-dropdown');
var DropdownTrigger = Dropdown.DropdownTrigger;
var DropdownContent = Dropdown.DropdownContent;

class Output extends Component {
constructor(props){
  super(props);
  this.state={
  token:window.sessionStorage.getItem("key"),
  value:0,
  name:'',
  currency:'',
  balance:'',
  category:'',
  addform:false,
  wallets:[],
  length:0,
  walletid:39,
  renderwallets:false,
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
       //dohvacanje svih walleta
        console.log(response);
        self.setState({length:response.data.length});
        self.setState({wallets:response.data});
        self.setState({renderwallets:true});
        console.log(self.state.wallets);

      })
      .catch(function (error) {
        console.log(error);
      });
    }

handleSubmit(event) {
  alert('transaction copleted:' + this.state.name);
  event.preventDefault();
  var self = this;
  var instance = axios.create({
           baseURL: "http://46.101.226.120:8000/api/",
           timeout: 4000,
           headers: {'Authorization': "Token "+this.state.token}

       });

  instance.post('/wallets/transactions/create/',{
    wallet: 39 ,
    name: this.state.name,
    amount: this.state.value,
    currency: this.state.currency,
    category: this.state.category,
  })
   .then(function (response) {
      //dohvacanje tokena i spremanje u session
      console.log(response.data + "Transaction completed successfuly");
    })
    .catch(function (error) {
      console.log(error);
      alert('transaction failed:' + self.state.name);
    });

}

handleChange = event => {
  this.setState({
    [event.target.id]: event.target.value
  });
}

renderaddform(){
  //// TODO: dropdown za kategorije i odabir datuma
      return   (
        <form onSubmit={this.handleSubmit}>
          <label>
            Add new transaction:
          </label>
          <label>
            Name:
            <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
          </label>
          <label>
            Amount:
            <input type="float" id="value" value={this.state.value} onChange={this.handleChange} />
          </label>
          <label>
            Currency:
            <input type="text" id="currency" value={this.state.currency} onChange={this.handleChange} />
          </label>
          <label>
            Category:
            <input type="text" id="category" value={this.state.category} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>);
}

renderwallet(){
    //var self =  this;
    var wallets = this.state.wallets;

    return (
       <div>
       //// TODO: formatirati izgled i podatke
       {wallets.map(wallet => <div> {wallet.pk} </div>)}
       
       </div>
   );
}

render() {

    return (
      <div>
      {this.renderwallet()}

      {this.renderaddform()}
      <hr />

      </div>
    );
  }
}


export default Output;
