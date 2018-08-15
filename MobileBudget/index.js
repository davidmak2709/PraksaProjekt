import { AppRegistry } from 'react-native';
import App from './App';
import React from "react";
import { Provider } from "react-redux";
import {createStore} from 'redux';
import rootReducer from "./app/redux/reducers";

const store = createStore(rootReducer);

const AppContainer = () =>
    <Provider store = {store}>
      <App />
    </Provider>

AppRegistry.registerComponent('MobileBudget', () => AppContainer);
