import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);
const StatusBarHeight = StatusBar.currentHeight;
let points = 0;

export default class Animations_ extends Component {

  constructor(props){
    super(props);
    this.state = {
      snakeX:(Dimensions.get('window').width)/2,
      snakeY:(Dimensions.get('window').height)/2,
      SnakeColor:'red',
      bugs:[],
      heads: [
        {
          animation: new Animated.ValueXY(),
        },
        {
          animation: new Animated.ValueXY(),
        },
        {
          animation: new Animated.ValueXY(),
        },
        {
          animation: new Animated.ValueXY(),
        },
      ]
    };

  }

  collisionDetection(){

   const snakeX = this.state.snakeX;
   const snakeY = this.state.snakeY;
   let SnakeColor = this.state.SnakeColor;
   const bugs = this.state.bugs;

    bugs.map((value,index) =>{
      if(snakeX >= (value.x - 35 + 10) && snakeX <= (value.x + 45)){
        if(snakeY >= (value.y + 35 - 40) && snakeY <= (value.y + 35 + 45)){
          bugs.splice(index,1);
          points += 10;
        }
      } 
    });
     
    this.setState({
      bugs:bugs,
      points,
      SnakeColor,
    })

    const snake_color =  "hsl(" + Math.random() * 360 + ", 100%, 75%)";

    if(bugs.length == 0){
      this.setState({
        SnakeColor:snake_color
      })
      this.bugsGenerate(snake_color);
    }
  }
  
  //normal bugs -------------------------------------------------------------------------
  bugsGenerate = (bug_color) => {
    const bugs_array = [];

    for (var i = 0; i < 4; i++) {
      bugs_array.push({
          x:Math.floor(Math.abs(Math.random() * screenWidth - 35)),
          y:Math.floor(Math.abs(Math.random() * screenHeight - 35)),
          backgroundColor:bug_color
      });
    }
    this.setState({
      bugs:bugs_array
    })
  }

    //------------------------
    bugsRender = () => {
        return(this.state.bugs.map((value,index) => {
          return(
            <View style={StyleSheet.absoluteFill} key={index}> 
             <TouchableWithoutFeedback>
               <Animated.View style={[styles.bug, {left:value.x, top:value.y }]}>
                <MaterialCommunityIcons name="bug" size={30} color= {value.backgroundColor}/>
               </Animated.View>
             </TouchableWithoutFeedback>
           </View>
           )
        }))
    }


  //Math.floor(Math.random() * 6) + 1  
  componentDidMount() {
    this.bugsGenerate("red");
  }
  
  //predator ------------------

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.heads.map(({ animation }) => {
          animation.extractOffset();
          // setValue Animated bug fix
          animation.setValue({ x: 0, y: 0 });
        });
      },
      onPanResponderMove: (e, { dx, dy,moveX, moveY, x0, y0 }) => {

        const boundries = this.boundries(dx, dy, x0, y0);
        
        this.state.heads[0].animation.setValue({
          x: boundries.dx,
          y: boundries.dy,
        });

        this.setState({
          snakeX:moveX,
          snakeY:moveY
        });

        this.collisionDetection();
      
         this.state.heads.slice(1).map(({ animation }, index) => {
          return Animated.sequence([
            Animated.delay(index * 20),
            Animated.spring(animation, {
              toValue: { x: boundries.dx, y: boundries.dy },
            }),
          ]).start();
        });
      },
    });
  }

  boundries(dx, dy, x0, y0){
    
    if(x0 + dx > screenWidth- 35){
      dx =  screenWidth - 35 - x0;
    }
    if(x0 + dx <= 35 ){
      dx = 35 - x0;
    }
    if(y0 + dy <= StatusBarHeight + 35 ){
      dy = StatusBarHeight + 35 - y0;
    }

    if(y0 + dy >= screenHeight - 35 ){
      dy = screenHeight - 35 - y0;
    }
    return {
      dx,
      dy
    }
  }



  render() {

  
    return (
      <View style={[styles.container]}>
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
          {this.bugsRender()} 
        </View>  
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
        {this.state.heads.slice(0).reverse().map((item, index, items) => {
          const pan = index === items.length - 1 ? this._panResponder.panHandlers : {};
            return (
                <Animated.View
                  {...pan}
                  key={index}
                  source={item.image}
                  style={[styles.head, {zIndex: 6, borderRadius: 20, backgroundColor:this.state.SnakeColor, transform: item.animation.getTranslateTransform() }]}
                >
                </Animated.View>
              );

        })}
        </View>

        <View style={{position: "absolute", bottom: 10,flexDirection:'row', zIndex: 0}}>
          <View style={{flex:1}}>
            <Text style={{color:'white',fontSize:30, justifyContent:'center'}}>Points {points}</Text>
          </View>
        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#212121'
  },
  head: {
    width: 40,
    height: 40,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'red',
    elevation:5
  },
  box: {
    top: 0,
    left: 0,
  },
  pred: {
    width: 60,
    height: 60,
    backgroundColor: "yellow",
    top: 0,
    left: 0,
    borderRadius: 30,
  },
  bug:{
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 0,
  }, 
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontWeight:'bold'
  }, 
  button:{
    width:100,
    marginTop: 30,
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  buttonEnd:{
    width:100,
    marginTop: 30,
    backgroundColor: "#212121",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  bugSpecial:{
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 0,
  }
});
