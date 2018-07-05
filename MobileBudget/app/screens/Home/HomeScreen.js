import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';

export default class HomeScreen extends Component {

    render() {
      return (
    <Text>Hello</Text>
      );
    }
}

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
