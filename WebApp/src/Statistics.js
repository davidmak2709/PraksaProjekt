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

var optionsCategories = [{value: '' , label:'all' },
                        {value: 'paycheck' , label: 'paycheck'},
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

function onSelectRow(row, isSelected, e) {
  if (isSelected) {

    // Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var del = document.getElementsByClassName("btn btn-danger")[0];
var tgl = document.getElementsByClassName("btn btn-info")[0];

modal.style.display = "block";

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

del.onclick = function(){
  // Save it!`You just selected '${row['name']}'`
  var instance = axios.create({
           baseURL: "http://46.101.226.120:8000/api/",
           timeout: 4000,
           headers: {'Authorization': "Token "+window.sessionStorage.getItem("key")}

       });

       console.log('/wallets/transactions/'+ row['pk']+'/')

  instance.delete('/wallets/transactions/'+ row['pk']+'/')
   .then(function (response) {
     //dohvacanje svih walleta
      console.log(response);
      window.alert("transaction deleted");
    })
    .catch(function (error) {
      console.log(error);
    });
    modal.style.display = "none";

}

tgl.onclick = function(){
  // Save it!`You just selected '${row['name']}'`
  var instance = axios.create({
           baseURL: "http://46.101.226.120:8000/api/",
           timeout: 4000,
           headers: {'Authorization': "Token "+window.sessionStorage.getItem("key")}

       });

       console.log('/wallets/transactions/update/'+ row['pk']+'/')
  var bool;
  if(row['recurring']==true) bool=false;
  else bool = true;
  console.log(bool);
  instance.patch('/wallets/transactions/update/'+ row['pk']+'/', {
    recurring: bool
  })
   .then(function (response) {
     //dohvacanje svih walleta
      console.log(response);
      window.alert("recurring toggled");
    })
    .catch(function (error) {
      console.log(error);
    });
    modal.style.display = "none";
}


  }
}

const selectRowProp = {
  mode: 'checkbox',
  clickToSelect: true,
  unselectable: [2],
  selected: [1],
  onSelect: onSelectRow,
  bgColor: 'gold'
};
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
        <BootstrapTable data={transactions}
         selectRow={selectRowProp}>
          <TableHeaderColumn isKey
                              width="35"
                              dataField='pk'>
            ID
          </TableHeaderColumn >
          <TableHeaderColumn width="20%" dataField='name'>
            Name
          </TableHeaderColumn>
          <TableHeaderColumn width="20%" dataField='date'>
            Date
          </TableHeaderColumn>
          <TableHeaderColumn width="20%" dataField='category'>
            Category
          </TableHeaderColumn>
          <TableHeaderColumn width="20%" dataField='amount'>
            Amount
          </TableHeaderColumn>
          <TableHeaderColumn width="10%"dataField='currency'>
            Currency
          </TableHeaderColumn>
          <TableHeaderColumn width="15%"dataField='recurring'>
            Reccuring
          </TableHeaderColumn>
        </BootstrapTable>
      </div>

      );
   }


   renderFilter(){
         return   (
           <div id="div_trans">
             <h4>
               <b>Filter:</b>
             </h4>
             <label>
               Name:
               <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
             </label>
             <Dropdown id="category" options={optionsCategories} onChange={this.handleSelected}  placeholder="Select a category" />
             <label>
               <input type="text" id="category" value={this.state.category} onChange={this.handleChange} readonly="readonly"/>
             </label>
             <button type="button" class="btn btn-warning" onClick={this.handleClick}>Filter</button>
             </div>
           );
   }

   renderModal(){
     return(
       <div id="myModal" class="modal">

        <div class="modal-content">
          <span class="close">&times;</span>

          <p>Do you want to edit or delete transaction?</p>
          <button id="toggle" type="button" class="btn btn-info" >Toggle recurring</button>
          <button id="delete" type="button" class="btn btn-danger">Delete transaction</button>
        </div>

      </div>
     );
   }

  render() {
    return (
      <div>
      <div id="chart-container"></div>
      {this.rendertransactions()}
      {this.renderFilter()}
      {this.renderModal()}
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
