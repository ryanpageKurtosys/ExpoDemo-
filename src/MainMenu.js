import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  KeyboardAvoidingView
} from "react-native";


import Background  from '../assets/main4.png';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const createAnimationStyle = animation => {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 0],
  });

  return {
    opacity: animation,
    transform: [
      {
        translateY,
      },
    ],
  };
};

export default class MainMenu extends Component {
  state = {
    playbutton: new Animated.Value(0),
    highscore: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.stagger(200, [
      Animated.timing(this.state.playbutton, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.state.highscore, {
        toValue: 1,
        duration: 200,
      }),
    ]).start();
  }

  render() {

    const buttonStylePlay = createAnimationStyle(this.state.playbutton);
    const buttonStyleHigh = createAnimationStyle(this.state.highscore);

    return (
      <View style={[styles.container, {backgroundColor:'#212121'}]}>
        <View
          style={[StyleSheet.absoluteFill, { width: null, height: null }]}>
          <View style={styles.container} />
            <View style={[styles.form, {flex:2}]}>
              <Text style={[styles.title, {fontWeight:'bold'}]}>Snake</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Animations_')}>
                <Animated.View style={[styles.button, buttonStylePlay]}>
                  <Text style={styles.buttonText}>New Game</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Animated.View style={[styles.button, buttonStyleHigh]}>
                  <Text style={styles.buttonText}>High Score</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          <View style={styles.container} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: "#FFF",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 10,
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.25)",
    paddingVertical: 10,
  },
  button: {
    width:300,
    marginTop: 30,
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontWeight:'bold'
  },
});
