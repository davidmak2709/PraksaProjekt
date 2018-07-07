import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import HomeScreen from "./app/screens/Home/HomeScreen";
import  LoginScreen  from './app/screens/Login/LoginScreen';
import  AuthLoadingScreen  from './app/screens/AuthLoading/AuthLoadingScreen';
import SignupScreen from './app/screens/Signup/SignupScreen';

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ Login: LoginScreen,Signup : SignupScreen ,  });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

class App extends React.Component {

  render() {
  }
}
