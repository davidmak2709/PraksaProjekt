import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';


var dataGraphCategories1;
var dataGraphCategories2;
var data_out = [];
var data_in = [];
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

function drawGraphIN(){
  console.log("crtam");
   dataGraphCategories1 = {
       chart:
       {caption:"Income",
       subCaption:"",
       numberPrefix:"%",
       theme:"ocean"}
       ,data:data_in};
  Charts(FusionCharts);
  FusionCharts.ready(function(){

              var revenueChartConfigs2={
                id:"income-chart",
                type:"pie2d",
                width:"80%",
                height:400,
                dataFormat:"json",
                dataSource:dataGraphCategories1};
              ReactDOM.render(<ReactFC{...revenueChartConfigs2}/>,document.getElementById('chart-container2'));
           });
}

function drawGraphOUT(){
  console.log("crtam");
   dataGraphCategories2 = {
       chart:
       {caption:"Outcome",
       subCaption:"",
       numberPrefix:"%",
       showPercentInTooltip: "0",
       decimals: "1",
       placecalueinside:1,
       theme:"ocean"}
       ,data:data_out};
  Charts(FusionCharts);
  FusionCharts.ready(function(){
              var revenueChartConfigs2={
                id:"outcome-chart",
                type:"pie2d",
                width:"80%",
                height:400,
                dataFormat:"json",
                dataSource:dataGraphCategories2};
              ReactDOM.render(<ReactFC{...revenueChartConfigs2}/>,document.getElementById('chart-container3'));
           });

}

class Graph extends Component {
  constructor(props){
    super(props);
    this.state={
    token:window.sessionStorage.getItem("key"),
    transactions: [],
    };

   }

  render() {

    return (
      <div>
      <div id="chart-container2"></div>
      <div id="chart-container3"></div>
      </div>
    );
  }

  getTransactions(categ){

    var instance = axios.create({
             baseURL: "http://46.101.226.120:8000/api/",
             timeout: 4000,
             headers: {'Authorization': "Token "+this.state.token}


         });
    instance.get('/stats/categories/', {params: {
        category: categ ,
      }
    })
     .then(function (response) {
       //dohvacanje svih walleta
        console.log(response);
        var obj = JSON.parse('{ "label": "'+ response.data[0].category + '", "value": '+ response.data[0].percentage_outcome + '}')
        var obj2 = JSON.parse('{ "label": "'+ response.data[0].category + '", "value": '+ response.data[0].percentage_income + '}')
        data_out.push(obj);
        data_in.push(obj2);

      })
      .catch(function (error) {
        console.log(error);
      });
  }

componentDidMount() {
  for (var i = 0; i < optionsCategories.length; i++){
    var obj = optionsCategories[i];
    this.getTransactions(obj.value);
  }


console.log(data_out);
console.log(data_in);
setTimeout(function() {
    drawGraphIN();
    drawGraphOUT();
}, 3000);

  }
}

export default Graph;
