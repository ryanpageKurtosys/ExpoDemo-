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

// Getting the screen dimentions
const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

// Getting the status bar height
const StatusBarHeight = StatusBar.currentHeight;

//let the
let points = 0;

export default class Animations_ extends Component {

  constructor(props){
    super(props);
    this.state = {
      snakeX:(Dimensions.get('window').width)/2, //keep a reference to the X Co-Ordinate of the snake
      snakeY:(Dimensions.get('window').height)/2, //keep a referce to the Y Co-Ordinate of the snake
      SnakeColor:'red', //set the initial color of the snake
      bugs:[], //Initialize an expt array for the bugs to collect
      heads: [ //this is the setup for the panHandelar that you drag accross the screen. 
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

  componentDidMount() {
    this.bugsGenerate("red");
  }

  bugsGenerate = (bug_color) => {
    //init empty array for the bugs
    const bugs_array = [];

    for (var i = 0; i < 4; i++) {
      //generate 4 X and Y coordinates for the bugs to render at
      bugs_array.push({
          x:Math.floor(Math.abs(Math.random() * screenWidth - 35)),
          y:Math.floor(Math.abs(Math.random() * screenHeight - 35)),
          backgroundColor:bug_color //set the bug color
      });
    }
    // once the bugs have been generated set the bugs state to the array of bugs
    this.setState({
      bugs:bugs_array
    })
  }

  // this arrow function excecutes the rendering of the bugs at the locations specified above
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
  
  //most complicated part -- setting up the pan handelar for the game ( charector/ snake )
  // https://facebook.github.io/react-native/docs/panresponder

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        this.state.heads.map(({ animation }) => {
          animation.extractOffset();
          // setValue for heads
          animation.setValue({ x: 0, y: 0 });
        });
      },
      onPanResponderMove: (e, { dx, dy,moveX, moveY, x0, y0 }) => {

        const boundries = this.boundries(dx, dy, x0, y0);
        
        this.state.heads[0].animation.setValue({
          x: boundries.dx,
          y: boundries.dy,
        });

        // set current snake X,Y position
        this.setState({
          snakeX:moveX,
          snakeY:moveY
        });
        //see if we have moved over a bug or not 
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

  //setup the boundries for the container so the snake cannot leave the playable area
  boundries(dx, dy, x0, y0){
    //sets the dx to the max value of screenwidth - 35 px
    if(x0 + dx > screenWidth- 35){
      dx =  screenWidth - 35 - x0;
    }
    //sets the dx to the min value of 35px
    if(x0 + dx <= 35 ){
      dx = 35 - x0;
    }
    //sets the dy to the max value of StatusBarHeight- 35px 
    if(y0 + dy <= StatusBarHeight + 35 ){
      dy = StatusBarHeight + 35 - y0;
    }
    //sets the dy to the min value of 35px 
    if(y0 + dy >= screenHeight - 35 ){
      dy = screenHeight - 35 - y0;
    }
    return {
      dx,
      dy
    }
  }

  collisionDetection(){

   // Get the current snake X position
   const snakeX = this.state.snakeX;
   // Get the current snake Y position
   const snakeY = this.state.snakeY;
   //Get a copy of the current bugs array
   const bugs = this.state.bugs;

    bugs.map((value,index) =>{
      //compare the snake X value to a bug value if it is within the bounds check the y value
      if(snakeX >= (value.x - 35 + 10) && snakeX <= (value.x + 45)){
        //compare the snake Y value to a bug value if it is within the bounds then we have moved over a bug
        if(snakeY >= (value.y + 35 - 40) && snakeY <= (value.y + 35 + 45)){
          //remove the specific bug from the bugs array
          bugs.splice(index,1);
          //incriment the points
          points += 10;
        }
      } 
    });
     
    this.setState({
      //update the bugs array
      bugs:bugs,
      //update the points 
      points,
    })

    // if all the bugs in the array have been removed
    if(bugs.length == 0){
      // generate a random color
      const snake_color =  "hsl(" + Math.random() * 360 + ", 100%, 75%)";
      // set the new snake color to the color generated 
      this.setState({
        SnakeColor:snake_color
      })
      //generate a new array of bugs ( ass all have gone )
      this.bugsGenerate(snake_color);
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
  bug:{
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 0,
  }
});
