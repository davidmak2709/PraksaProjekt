import React from 'react';
import { Text, View, Dimensions, AsyncStorage, ActivityIndicator,ScrollView, Image,StyleSheet,TouchableOpacity } from 'react-native';
import {Icon} from 'react-native-elements';
import Wallet from '../components/Wallet';

const {height, width} = Dimensions.get('window');

export default class WalletTab extends React.Component {
  constructor(){
    super();
    this._getUserWallets();
    this.state = {
      response : [],
      loading : true
    };
  }


  _getUserWallets = async () =>{

    const userToken = await AsyncStorage.getItem('userToken');
    token = userToken;

   fetch('http://46.101.226.120:8000/api/wallets/', {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Token ' + token
        },
      }).then((response) => response.json())
        .then((responseJson) => {
         this.setState({response : responseJson, loading : false});
        })
        .catch((error) => {
          console.error(error);
        });
  }



  render() {
   var views = [];
   for (var i = 0; i < Object.keys(this.state.response).length; i++) {
     let currentWallet = this.state.response[i];
     views.push(
       <View key = {i}>
         <Wallet name = {currentWallet.name}  balance = {currentWallet.balance} currency = {currentWallet.currency}/>
       </View>
     );
   }


    if(this.state.loading){
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator  size="large" color = "green" />
        </View>  );
    } else {
      return (
        <View style = {{flex : 1}}>
          <ScrollView style = {{paddingBottom : 50}} >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingBottom : height * 0.15 }}>
              {views}
            </View>
          </ScrollView>
          <TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacityStyle} >
            <Icon color =  "white" name=  "add" size = {30}/>
          </TouchableOpacity>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
 TouchableOpacityStyle:{
     backgroundColor : "green",
     position: 'absolute',
     width: 50,
     height: 50,
     alignItems: 'center',
     justifyContent: 'center',
     borderRadius : 25,
     right: 30,
     bottom: 30,
   },

});
