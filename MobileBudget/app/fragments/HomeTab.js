import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';

export default class HomeTab extends React.Component {

  componentDidMount(){
    StatusBar.setHidden(true);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}
