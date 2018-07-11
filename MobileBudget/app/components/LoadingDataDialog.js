import React, { Component } from 'react';
import { View, AppRegistry,Dimensions, Text, ActivityIndicator } from 'react-native';

const {height, width} = Dimensions.get('window');

export default class LoadingDataDialog extends Component {


  render(){
    return(
      <View style = {{flexDirection : "row", alignItems : "center", justifyContent : "center", paddingTop : height * 0.02,
          paddingBottom : height * 0.01,backgroundColor : "darkgreen"}}>
        <ActivityIndicator size = "large" animating = {true} color = "white"/>
        <Text style = {{color : "white"}}>Loading data...</Text>
      </View>
  );
  }
}

AppRegistry.registerComponent('LoadingDataDialog', () => LoadingDataDialog);
