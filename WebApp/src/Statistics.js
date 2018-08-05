import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';
import {BootstrapTable,
       TableHeaderColumn} from 'react-bootstrap-table';
import Dropdown from 'react-dropdown';

var dataGraph2;

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
    name: "",
    category: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

   }

   handleClick(event) {
      this.getTransactions();
   }

   handleChange = event => {
     this.setState({
       [event.target.id]: event.target.value
     });
   }

   handleSelected = (selectedOption) => {
     this.setState({ category:selectedOption.value });
     console.log(`Option selected:`, this.state.category);
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
   renderFilter(){
     //// TODO: dropdown za kategorije i odabir datuma i ponavljajuceg troska
         return   (
           <div>
             <label>
               Filter:
             </label>
             <label>
               Name:
               <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
             </label>
             <Dropdown id="category" options={optionsCategories} onChange={this.handleSelected}  placeholder="Select a category" />

             <button type="button" class="btn btn-filter" onClick={this.handleClick}>Filter</button>
             </div>
           );
   }

  render() {
    return (
      <div>
      <div id="chart-container"></div>
      {this.rendertransactions()}
      {this.renderFilter()}
      </div>
    );
  }

  getTransactions(){
    var self = this;
    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/",
             timeout: 4000,
             headers: {'Authorization': "Token "+this.state.token}

         });
    console.log(this.state.token);
    instance.get('/wallets/transactions/',{
      params: {
        name: this.state.name ,
        category: this.state.category,
      }
    })
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

componentDidMount() {
  getData();
  this.getTransactions();

  }
}

export default Statistics;
