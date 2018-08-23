   import React, { Component } from 'react';
import axios from 'axios';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import ReactDOM from 'react-dom';

var dataGraphCategories = [];
var data =[
  [],
  [],
  []
];
function getData(pk,k){

var dataset = [];
  for(var i = 0 ; i<6 ;i++){
    var date = new Date();
    var balance = 0;
    var date1 = date;
    date1.setMonth(date.getMonth()-i);
    var datum1 = date1.toISOString().slice(0,10);
    var date2 = date;
    date2.setMonth(date.getMonth()-1);
    var datum2 = date2.toISOString().slice(0,10);
    //console.log(datum1,datum2);
    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/",
             timeout: 4000,
             headers: {'Authorization': "Token "+window.sessionStorage.getItem("key")}

         });
    var obj;

    instance.get('/wallets/transactions/',{
      params: {
        date_after: datum2,
        date_before: datum1,
        wallet: pk,
      }
    })
     .then(function (response) {
       //dohvacanje svih walleta
       //console.log(response.data.results);
       balance=0;
        for(var j=0;j<response.data.count;j++){
            balance += response.data.results[j]['amount'];

        }
         obj = JSON.parse('{ "value": '+ balance + ', "label":"'+ response.data.results[0]['date'].slice(0,7) +' "}');
         dataset.push(obj);
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  data[k]=dataset;
  console.log(data);
}

function drawGraphbalance(pk,dataset){
  console.log("crtam");
   dataGraphCategories[pk] = {
       chart:
       {caption:"monthly balance",
       subCaption:"",
       numberPrefix:"",
       theme:"ocean"},
       data:dataset
     }
  Charts(FusionCharts);
  FusionCharts.ready(function(){
              var revenueChartConfigs={
                id:"chart"+pk,
                type:"column2d",
                width:"80%",
                height:210,
                dataFormat:"json",
                dataSource:dataGraphCategories[pk]};
              ReactDOM.render(<ReactFC{...revenueChartConfigs}/>,document.getElementById('chart-container'+pk));
           });

}


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
        <div id="div_trans">
        <form onSubmit={this.handleSubmit}>
          <h4 id="title_trans">
            Add new wallet:
          </h4>
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
      </div>);
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
    var self =  this;
    var wallets = [];
    for(var i = 0 ; i < this.state.length ; i++){
      if(this.state.wallets[this.state.length-1]){
      var obj = this.state.wallets[i];
      getData(obj.pk,i);

      console.log(obj);


      var str = "chart-container" + i;
      wallets.push(
        <div id="div_trans" className="wallet" key={i}>
          <h5><b>Wallet:</b> {obj.name}</h5>
          <h4>balance:<b> {obj.balance}, {obj.currency}</b></h4>
          <button type="button" class="btn btn-danger" value={obj.pk} onClick={this.handleClick}>Delete!</button>

          <div id={str} class="graph"> ></div>
        </div>
      )
    }
  }

  setTimeout(function() {
    for(var i = 0 ; i < self.state.length ; i++){
      if(self.state.wallets[self.state.length-1]) drawGraphbalance(i, data[i]);
    }
  }, 4000);
    return wallets;

}
render() {

    return (
      <div>
      {this.renderwallet()}
      <hr />
      {this.renderaddform()}
      <hr />

      <button type="button" onClick={()=>{
        const currentState = this.state.addform;
        this.setState({addform: !currentState})}}>Add new wallet!</button>

      </div>
    );
  }
}


export default Wallet;
