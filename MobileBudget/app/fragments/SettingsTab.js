import React from 'react';
import { View, ScrollView, Button, StatusBar} from 'react-native';
import {Text} from 'react-native-elements';
export default class SettingsTab extends React.Component {

  render() {
    return (
      <View style = {{flex : 1}}>
        <ScrollView>
          <Button title = "DODAJ" onPress = {() => this.props.navigation.navigate("Transaction")} />
        </ScrollView>
      </View>
    );
  }
}
