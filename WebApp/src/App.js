import React, { Component } from 'react';
import logo from './dollar.svg';
import './App.css';
import Navbar from './Navbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-slider">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h1 className="App-title">Welcome to MyFinances</h1>

        </header>
        <Navbar />


      </div>
    );
  }
}

export default App;
