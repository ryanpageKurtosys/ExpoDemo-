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
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native";

import { Ionicons } from '@expo/vector-icons';
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


const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);
const StatusBarHeight = StatusBar.currentHeight;

export default class MainMenu extends Component {
  state = {
    playbutton: new Animated.Value(0),
    highscore: new Animated.Value(0),
    bugs:[],
    heads: [
        {
          animation: new Animated.ValueXY(),
          text: "",
        },
        {
          animation: new Animated.ValueXY(),
          text: "",
        },
        {
          animation: new Animated.ValueXY(),
          text: "",
        },
        {
          animation: new Animated.ValueXY(),
          text: "",
        },
      ]
  };

  componentDidMount() {
      Animated.timing(this.state.playbutton, {
        toValue: 1,
        duration: 200,
      }).start();
      Animated.timing(this.state.highscore, {
        toValue: 1,
        duration: 200,
      }).start();

  }


  bugsGenerate = (bug_color) => {
    const bugs_array = [];

    for (var i = 0; i < 4; i++) {
      bugs_array.push({
          x:Math.floor(Math.abs(Math.random() * screenWidth - 35)),
          y:Math.floor(Math.abs(Math.random() * screenHeight - 35)),
          status:true,
          backgroundColor:bug_color
      });
    }
    this.setState({
      bugs:bugs_array
    })
  }

  bugsRender = () => {
    return(this.state.bugs.map((value,index) => {
      return(
        <View style={StyleSheet.absoluteFill} key={index}> 
         <TouchableWithoutFeedback>
           <Animated.View style={[styles.bug, {left:value.x, top:value.y }]}>
            <Ionicons name="ios-bug" size={30} color= {value.backgroundColor}/>
           </Animated.View>
         </TouchableWithoutFeedback>
       </View>
       )
    }))
}

    componentWillMount(){
        this.moveSnake();
        this.bugsGenerate("hsl(" + Math.random() * 360 + ", 100%, 75%)");
        this.interval = setInterval(() => this.bugsGenerate("hsl(" + Math.random() * 360 + ", 100%, 75%)"), 5000);
    }

     componentWillUnmount(){
         clearInterval(this.interval);
     }

    moveSnake = () => {

       const x_ = Math.floor(Math.abs(Math.random() * screenWidth));
       const y_ = Math.floor(Math.abs(Math.random() * screenHeight)) 

       Animated.sequence([
                Animated.timing(this.state.heads[0].animation,{
                    toValue: { x: x_ , y: y_ },
                    duration:1200
                }),
            ]).start(() => {
                this.moveSnake();
            });
        }


  render() {

    const buttonStylePlay = createAnimationStyle(this.state.playbutton);
    const buttonStyleHigh = createAnimationStyle(this.state.highscore);

    const animatedStyles = {
        transform: this.state.heads[0].animation.getTranslateTransform(),
      };

    return (
      <View style={[styles.container, {backgroundColor:'#212121'}]}>
        <View
          style={[StyleSheet.absoluteFill, { width: null, height: null, zIndex:-1 }]}>
          <View style={[styles.container, {zIndex:3} ]} />
            <View style={[styles.form, {flex:2, zIndex:2}]}>
              <Text style={[styles.title, {fontWeight:'bold'}]}>Snake</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Animations_')}>
                <Animated.View style={[styles.button, buttonStylePlay]}>
                  <Text style={styles.buttonText}>New Game</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Animated.View 
                onPress={() => this.moveSnake}
                style={[styles.button, buttonStyleHigh]}>
                  <Text style={styles.buttonText}>High Score</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            {this.bugsRender()} 
          <View style={styles.container} />
          {this.state.heads.slice(0).reverse().map((item, index, items) => {
             return (
         <Animated.View
            key={index}
            style={[styles.head,animatedStyles]}
            >
            <Image style={{width: 60,height: 60, borderRadius:30}} source={require('../assets/pacman.png')}/>
            </Animated.View>
             )
        })}
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
  head: {
    width: 60,
    height: 60,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'#212121',
  },
  bug:{
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 0,
  }
});
