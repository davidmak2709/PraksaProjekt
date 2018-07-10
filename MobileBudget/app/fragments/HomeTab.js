import React from 'react';
import { Text, View, Dimensions } from 'react-native';

export default class HomeTab extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}
