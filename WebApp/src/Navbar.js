import React, { Component } from 'react';
import Login from './LogIn'
import Home from './Home'
import Statistics from './Statistics'
import Signup from './Signup'
import Profile from './Profile'
import Wallet from './Wallet'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

class Navbar extends Component{
  constructor(props){
    super(props);
    this.state={
    hello: window.sessionStorage.getItem("key"),
    }
   }

   logout(){
     var self = this;
     var apiBaseUrl = "http://46.101.226.120:8000/api/";

     var instance = axios.create({
              baseURL: apiBaseUrl,
              timeout: 2000,
          });

     instance.post('rest-auth/logout/ ')
     .then(function (response) {
       //dohvacanje tokena i spremanje u session
       console.log(JSON.stringify(response) + "LOGOUT");
       sessionStorage.clear();
       window.location.reload();
       //// TODO: mozda postoji bolji nacin, sporo reload cijele stranice

     })
     .catch(function (error) {
       console.log(error + "ERRRRRRor");
     });
   }

  renderlogindiv(){

    if(this.state.hello){
      return( <ul className="nav navbar-nav navbar-right">
          			      <li><a href="/profile">Wellcome {window.sessionStorage.getItem("username")}</a></li>
          			      <li><Link to="/login"><span onClick={this.logout} className="glyphicon glyphicon-log-out"> Logout</span> </Link></li>
          			 </ul>);
    }else {
      return( <ul className="nav navbar-nav navbar-right">
          			      <li><a href="/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
          			      <li><Link to="/login"><span className="glyphicon glyphicon-log-in"> Login</span> </Link></li>
          			 </ul>);

    }
  }

  render(){

    return (
      <Router>
    		<div>
    			<nav className="navbar navbar-inverse">
    			  <div className="container-fluid">
    			    <div className="navbar-header">
    			      <a className="navbar-brand" href="/">MyFinances</a>
    			    </div>
    			    <ul className="nav navbar-nav">
    			      <li className="active"><a href="/">Home</a></li>
    			      <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#">Manage <span className="caret"></span></a>
    			        <ul className="dropdown-menu">
    			          <li><a href="#">Ulazi</a></li>
    			          <li><a href="#">Izlazi</a></li>
    			          <li><a href="#">Investicije</a></li>
    			        </ul>
    			      </li>
                <li><Link to="/wallet"><span> Wallet</span> </Link></li>
    			      <li><Link to="/statistics"><span> Statistics</span> </Link></li>
    			    </ul>
    			    {this.renderlogindiv()}
    			  </div>
    			</nav>
          <hr />
          <Route exact path="/" component={Home}/>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/profile" component={Profile} />
          <Route path="/wallet" component={Wallet} />

    		</div>
      </Router>
    );

  }
}

export default Navbar;
