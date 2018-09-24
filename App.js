import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  PanResponder,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { createSwitchNavigator } from 'react-navigation';
import Animations_ from './src/Game';
import MainMenu from './src/MainMenu'

export default class App extends React.Component {

  render() {

    return (
      <AppNavigator initialRouteName={MainMenu}/>
    );
  }
}

const AppNavigator = createSwitchNavigator({
  MainMenu: { screen: MainMenu },
  Animations_: { screen: Animations_ 
  },
 
});
