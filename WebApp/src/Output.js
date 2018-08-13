import React, { Component } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import './Output.css';

var options = [];
var optionscurr = [{ value: "HRK", label: "HRK"},
                    { value: "EUR", label: "EUR"},
                    {value: "USD", label: "USD"},
                    {value: "CHF", label: "CHF"},
                    {value: "GBP", label: "GBP"}];
var optionsCategories = [{ value: 'paycheck' , label: 'paycheck'},
                        { value: 'gasoline', label: 'gasoline'},
                        {value: 'charity', label: 'charity'},
                        {value:'clothing' , label: 'clothing'},
                        {value: 'groceries' , label:'groceries' },
                        {value:'gifts' , label:'gifts' },
                        {value:'healthcare' , label: 'healthcare'},
                        {value: 'household', label:'household' },
                        {value: 'insurance', label: 'insurance' },
                        {value: 'leisure_hobbies', label: 'leisure_hobbies'},
                        {value: 'utilities' , label: 'utilities' },
                        {value: 'vacation' , label:'vacation' },];

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
  length:0,
  walletid:'',
  renderwallets:false,
  selectedOption: null,
  selectedOptioncurr: null,
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
        console.log(options);
        for(var i = 0; i < self.state.wallets.length ; i++){
            var obj = JSON.parse('{ "value": '+ self.state.wallets[i].pk + ', "label": "'+ self.state.wallets[i].name + '"}')
            options.push(obj);
        }
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
    wallet: this.state.selectedOption.value,
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

handleSelect = (selectedOption) => {
  this.setState({ selectedOption });
  this.setState({walletid:selectedOption.label});
  console.log(`Option selected:`, selectedOption);
}
handleSelectcurr = (selectedOption) => {
  this.setState({ currency:selectedOption.value });
  console.log(`Option selected:`, selectedOption);
}
handleSelected = (selectedOption) => {
  this.setState({ category:selectedOption.value });
  console.log(`Option selected:`, this.state.category);
}


renderaddform(){
  //// TODO: dropdown za kategorije i odabir datuma i ponavljajuceg troska
      return   (
        <form onSubmit={this.handleSubmit}>
          <h4 id="title_trans">
            Add new transaction:
          </h4>
          <label>
            Name:
            <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
          </label>
          <label>
            Amount:
            <input type="float" id="value" value={this.state.value} onChange={this.handleChange} />
          </label>
          {this.renderwallet()}
          <label>
            <input type="text" id="wallet" value={this.state.walletid} onChange={this.handleChange} readonly="readonly"/>
          </label>
          <Dropdown options={optionscurr} onChange={this.handleSelectcurr}  placeholder="Select a currency" />
          <label>
            <input type="text" id="curr" value={this.state.currency} onChange={this.handleChange} readonly="readonly"/>
          </label>
          <Dropdown id="category" options={optionsCategories} onChange={this.handleSelected}  placeholder="Select a category" />
          <label>
            <input type="text" id="category" value={this.state.category} onChange={this.handleChange} readonly="readonly"/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
}

renderwallet(){

    return (

      <Dropdown options={options} onChange={this.handleSelect}  placeholder="Select a wallet" />




   );
}

render() {

    return (
      <div id="div_trans">
      {this.renderaddform()}
      <hr />

      </div>
    );
  }
}


export default Output;
