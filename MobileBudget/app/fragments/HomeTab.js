import React from 'react';
import { Text, View, Dimensions, AsyncStorage } from 'react-native';
import { StatusBar } from 'react-native';
import CategoriesSlideShow from "../components/CategoriesSlideShow";

export default class HomeTab extends React.Component {
  componentWillMount(){
    StatusBar.setHidden(true);
  }


  render() {
    return (
        <CategoriesSlideShow />
    );
  }
}
