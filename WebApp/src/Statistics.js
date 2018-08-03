import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';
import {BootstrapTable,
       TableHeaderColumn} from 'react-bootstrap-table';

var dataGraph2;


function getData(){

  axios.get('https://www.quandl.com/api/v3/datasets/EOD/AAPL.json?api_key=CXvjxs9TMu42wRzsKrXi')
 .then(function (response) {
   console.log(response);
   console.log(response.data.dataset.data['0']['0']);
   dataGraph2 = {
       chart:
       {caption:response.data.dataset.dataset_code,
       subCaption:"Last 5 records",
       numberPrefix:"$",
       theme:"ocean"}
       ,data:[{label:response.data.dataset.data['4']['0'], value:response.data.dataset.data['4']['1']},
           {label:response.data.dataset.data['3']['0'],value:response.data.dataset.data['3']['1']},
           {label:response.data.dataset.data['2']['0'],value:response.data.dataset.data['2']['1']},
           {label:response.data.dataset.data['1']['0'],value:response.data.dataset.data['1']['1']},
           {label:response.data.dataset.data['0']['0'],value:response.data.dataset.data['0']['1']}]};
           Charts(FusionCharts);
           FusionCharts.ready(function(){

             var revenueChartConfigs={
               id:"revenue-chart",
               type:"column2d",
               width:"80%",
               height:400,
               dataFormat:"json",
               dataSource:dataGraph2};
             ReactDOM.render(<ReactFC{...revenueChartConfigs}/>,document.getElementById('chart-container'));
           });

 })
 .catch(function (error) {
   console.log(error);
   window.alert("API zahtjev err " + error );
 })
 .then(function () {
   // always executed
 });
}

class Statistics extends Component {
  constructor(props){
    super(props);
    this.state={
    token:window.sessionStorage.getItem("key"),
    transactions: [],
    };

   }

   rendertransactions(){
       var transactions = this.state.transactions;

       return (
          <div>
        <BootstrapTable data={transactions}>
          <TableHeaderColumn isKey dataField='pk'>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField='name'>
            Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField='date'>
            Date
          </TableHeaderColumn>
          <TableHeaderColumn dataField='category'>
            Category
          </TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>
            Amount
          </TableHeaderColumn>
          <TableHeaderColumn dataField='currency'>
            Currency
          </TableHeaderColumn>
          <TableHeaderColumn dataField='recurring'>
            Recuring
          </TableHeaderColumn>

        </BootstrapTable>
      </div>

      );
   }

  render() {
    return (
      <div>
      <div id="chart-container"></div>
      {this.rendertransactions()}
      </div>
    );
  }

componentDidMount() {
  getData();
  var self = this;
  var instance = axios.create({
           baseURL: "http://46.101.226.120:8000/api/",
           timeout: 4000,
           headers: {'Authorization': "Token "+this.state.token}

       });
  console.log(this.state.token);
  instance.get('/wallets/transactions/ ')
   .then(function (response) {
     //dohvacanje svih walleta
      console.log(response);
      self.setState({transactions:response.data.results});
      console.log(self.state.transactions);

    })
    .catch(function (error) {
      console.log(error);
    });

}
}

export default Statistics;
