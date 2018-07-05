import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import axios from 'axios';
var dataGraph2;

function formatDate(history) {
    var d = new Date()
    d.setDate(d.getDate() - history);
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function getData(){

  axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=JU29AGJ4M2SEODU5')
 .then(function (response) {
   console.log(response);
   console.log(formatDate(5),formatDate(4),formatDate(3),formatDate(2));
   window.alert("API zahtjev success " + response.data["Time Series (Daily)"][formatDate(2)]["1. open"]);
   dataGraph2 = {
       chart:
       {caption:response.data["Meta Data"]["2. Symbol"],
       subCaption:"Last 5 days",
       numberPrefix:"$",
       theme:"ocean"}
       ,data:[{label:formatDate(1), value:response.data["Time Series (Daily)"][formatDate(2)]["1. open"]},
           {label:formatDate(2),value:response.data["Time Series (Daily)"][formatDate(2)]["1. open"]},
           {label:formatDate(3),value:response.data["Time Series (Daily)"][formatDate(3)]["1. open"]},
           {label:formatDate(4),value:response.data["Time Series (Daily)"][formatDate(3)]["1. open"]},
           {label:formatDate(5),value:response.data["Time Series (Daily)"][formatDate(3)]["1. open"]}]};
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
