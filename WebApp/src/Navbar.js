import React, { Component } from 'react';
import Login from './LogIn'
import Home from './Home'
import Statistics from './Statistics'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Navbar extends Component{

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
    			      <li><Link to="/statistics"><span> Statistics</span> </Link></li>
    			    </ul>
    			    <ul className="nav navbar-nav navbar-right">
    			      <li><a href="#"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
    			      <li><Link to="/login"><span className="glyphicon glyphicon-log-in"> Login</span> </Link></li>
    			    </ul>
    			  </div>
    			</nav>
          <hr />
          <Route exact path="/" component={Home}/>
          <Route path="/login" component={Login} />
          <Route path="/Statistics" component={Statistics} />

    		</div>
      </Router>
    );

  }
}

export default Navbar;
