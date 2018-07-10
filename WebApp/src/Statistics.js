import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';
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
  render() {
    return (
      <div id="chart-container"></div>
    );
  }




componentDidMount() {
  getData();

}
}

export default Statistics;
