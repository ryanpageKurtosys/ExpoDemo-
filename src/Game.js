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
import { MaterialCommunityIcons } from '@expo/vector-icons';


const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);
const StatusBarHeight = StatusBar.currentHeight;

let lives = 3;
let special_Collison = false;
let special_status = '';
let safeStatus = false;
let specail_ruinning = false;
let predSpeed = 0;

export default class Animations_ extends Component {

  constructor(props){
    super(props);
    this.state = {
      animationSafeArea: new Animated.ValueXY(),
      animatedPredator: new Animated.ValueXY(),
      animatedPredatorRotate: new Animated.Value(0),
  
      PredCurrentRotate: '0rad',
      PredFutureRotate: '0rad',
      Predflipx:'0rad',
      PredflipY:'0rad',
      snakeX:(Dimensions.get('window').width)/2,
      snakeY:(Dimensions.get('window').height)/2,
      safeBoxWidth:80,
      safeBoxHeight:80,
      safeBox_X:0,
      safeBox_Y:0,
      SnakeColor:'red',
      borderRadius:20,
      points: 0,
      bugs:[],
      bugsSpecial_array:[],
      lives:3,
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
  }

  collisionDetection(){

   const snakeX = this.state.snakeX;
   const snakeY = this.state.snakeY;
   const safeBox_X = Number(JSON.stringify(this.state.animationSafeArea.x))
   const safeBox_Y = Number(JSON.stringify(this.state.animationSafeArea.y));
   //border Radius
   let borderRadius = this.state.borderRadius;
   let SnakeColor = this.state.SnakeColor;

    if(snakeX >= safeBox_X && snakeX <= safeBox_X + this.state.safeBoxWidth){
        if(snakeY >= safeBox_Y && snakeY <= safeBox_Y + this.state.safeBoxHeight){
        borderRadius = 0;
        safeStatus = true;
        }else{
        borderRadius = 20;
        safeStatus = false;
        }
    }else{
        borderRadius = 20;
        safeStatus = false;
    }

    if(special_status == "weight-kilogram"){
        safeStatus = true;
    }

    const bugs = this.state.bugs;
    const bugsSpecial_array = this.state.bugsSpecial_array;
    let points = this.state.points;


    bugs.map((value,index) =>{
      if(snakeX >= (value.x - 30) && snakeX <= (value.x + 30)){
        if(snakeY >= (value.y - 30 + StatusBarHeight) && snakeY <= (value.y + 30 + StatusBarHeight)){
          bugs.splice(index,1);
          points += 10;
        }
      } 
    })


     bugsSpecial_array.map((value,index) =>{
        if(snakeX >= (value.x - 50) && snakeX <= (value.x + 50)){
          if(snakeY >= (value.y - 50 + StatusBarHeight) && snakeY <= (value.y + 50 + StatusBarHeight)){
            bugsSpecial_array.splice(index,1);
            points += 100;
            this.specialFunction(value.type);
          }
        } 
      })
  
     
    this.setState({
      bugs:bugs,
      bugsSpecial_array,
      points:points,
      borderRadius,
      SnakeColor,
      safeStatus,
    })

    const snake_color =  "hsl(" + Math.random() * 360 + ", 100%, 75%)";

    if(bugs.length == 0){
      this.setState({
        SnakeColor:snake_color
      })
      this.bugsGenerate(snake_color);
      this.startPredator();
      this.startAnimation();
    
    }
  }

  specialFunction(special){
     
    if(!specail_ruinning){
        special_status = special;

        if(special == 'heart'){
            lives = lives + 1;
        }
        else if(special == 'test-tube'){
            predSpeed = 1200;
        }
  
        setInterval(() => {
            console.log('running');
              special_status = '';
              special_Collison = false;
              specail_ruinning = false;
              predSpeed = 0;
        }, 6000);    
  
        specail_ruinning = true;
    }
     
  }
  
  //normal bugs -------------------------------------------------------------------------
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

  bugsSpecial = (bug_color) => {
     
    const type = ['bug','terrain','test-tube','weight-kilogram','fire','heart'];
    //type:type[(Math.floor(Math.random() * 5) + 0)],
    const bugsSpecial_array = [];
    bugsSpecial_array.push({
          x:Math.floor(Math.abs(Math.random() * screenWidth - 35)),
          y:Math.floor(Math.abs(Math.random() * screenHeight - 35)),
          status:true,
          backgroundColor:bug_color,
          type:type[2],
      });

    this.setState({
      bugsSpecial_array
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
  
    bugsSpecialRender = () => {

      return(this.state.bugsSpecial_array.map((value,index) => {
            return(
                <View style={StyleSheet.absoluteFill} key={index}> 
                 <TouchableWithoutFeedback>
                   <Animated.View style={[styles.bugSpecial, {left:value.x, top:value.y }]}>
                    <MaterialCommunityIcons name={value.type} size={50} color= {'white'}/>
                   </Animated.View>
                 </TouchableWithoutFeedback>
               </View>
               )
            }
      ))
  }

  //Math.floor(Math.random() * 6) + 1  
  componentDidMount() {
    this.bugsGenerate("red");
    this.interval = setInterval(() => {
      this.startPredator()
    }, 1000);    
    this.intervalSpecial = setInterval(() => {
        this.bugsSpecial();
        setTimeout(() => {
            this.setState({bugsSpecial_array:[]})
        },  Math.floor(Math.random() * 2300) + 1300 );
      }, Math.floor(Math.random() * 12000) + 5000  );    
  }
  

  //predator ------------------

  startPredator = () => {

    let pred_X = 0;
    let pred_Y = 0; 

 
    if(!safeStatus){

        pred_X = this.state.snakeX - 37.5;
        pred_Y = this.state.snakeY - StatusBarHeight - 110;

        Animated.parallel([
            Animated.timing(this.state.animatedPredator, {
                toValue:{
                x:pred_X,
                y:pred_Y,
                }, 
                duration:(1200 + predSpeed)
            }),
            Animated.timing(this.state.animatedPredatorRotate, {
                toValue: 1,
            }),
        ]).start(this.state.animatedPredatorRotate.setValue(0));

      }else{

        if(special_status == "weight-kilogram"){
            Animated.timing(this.state.animatedPredator, {
                toValue:{
                x:screenWidth/2 - 60,
                y:screenHeight - StatusBarHeight - 140
                },
                duration:800 
            }).start();

        }else{

            if((this.state.snakeX - 37.5) > screenWidth/2){
            pred_X = 0;
            }else{
            pred_X = screenWidth - 60;
            }
            if(this.state.snakeY - StatusBarHeight > screenHeight/2){
            pred_Y = 0 - StatusBarHeight - 80;
            }else{
            pred_Y = screenHeight - StatusBarHeight - 140;
            }
            Animated.timing(this.state.animatedPredator, {
                toValue:{
                x:pred_X,
                y:pred_Y
                },
                duration:800 
            }).start();
            }
        }

        const currentRotate = this.state.PredFutureRotate;

  
        const PredSnakeDistX = Number(pred_X - JSON.stringify(this.state.animatedPredator.x));
        const PredSnakeDistY = Number( pred_Y - JSON.stringify(this.state.animatedPredator.y));

        let Predflipx = '0rad';
        let PredflipY = '0rad';
        let newRotate = Math.sin(PredSnakeDistY/PredSnakeDistX);
        //console.log(PredSnakeDistX);
        if(PredSnakeDistX > 0){
            if(PredSnakeDistY > 0 ){
                //console.log("Quad 1");
                newRotate = ((newRotate + (Math.PI/180)*180).toString() + "rad");
                Predflipx = '180rad';
                PredflipY = '0rad';
            }else {
                // console.log("Quad 2");
                 newRotate = ((newRotate + (Math.PI/180)*180).toString() + "rad");
                 Predflipx = '180rad';
                 PredflipY = '0rad';
            }
        }else{
            if(PredSnakeDistY < 0 ){
               // console.log("Quad 4");
                newRotate = ((newRotate + (Math.PI/180)*180).toString() + "rad");
                PredflipY = '180rad';
                Predflipx = '0rad';
            }else{
         
                newRotate = ((newRotate + (Math.PI/180)).toString() + "rad");
                Predflipx = '180rad';
                PredflipY = '180rad';
                //console.log("Quad 3");
            }
        }
        
        if(newRotate != "NaNrad"){
            this.setState({
                PredCurrentRotate:currentRotate,
                PredFutureRotate:newRotate,
                Predflipx:Predflipx,
                PredflipY:PredflipY
            })
        }
        
       
      //console.log(Number(JSON.stringify(this.state.animatedPredator.x)), "  " + pred_X );

      } 

  predator_Snake_Collision(){

     const pred_X = Number(JSON.stringify(this.state.animatedPredator.x))
     const pred_Y = Number(JSON.stringify(this.state.animatedPredator.y))
     const snakeX = this.state.snakeX;
     const snakeY = this.state.snakeY;


     if(snakeX >= (pred_X + 37.5 - 30)  && snakeX <= (pred_X + 37.5 + 30)){
       if(snakeY >= (pred_Y  + StatusBarHeight + 110 - 30) && snakeY <= (pred_Y  + StatusBarHeight + 110 + 30)){
        if(special_status ==! "fire"){
            lives =  lives - 1;
        }else{
            special_Collison = true;
        }
       }
     }
  }

  startAnimation = () => {

    const _x = Math.floor(Math.abs(Math.random() * screenWidth - this.state.safeBoxWidth));
    const _y = Math.floor(Math.abs(Math.random() * screenHeight - this.state.safeBoxHeight));

    Animated.sequence([
      Animated.spring(this.state.animationSafeArea, {
        toValue:{
         x:_x,
         y:_y,
        } 
      })
    ]).start(() => {
      //this.collisionDetection()
    });
  };

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
        })
          
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
      dx =  screenWidth- 35 - x0;
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

  renderSecial(){
      if(special_status != ''){
       return(<MaterialCommunityIcons name={special_status} size={30} color= "white"/>)
      }
  }
  
  image_render_(){  

    if(special_Collison === true){
         return require('../assets/Blank.png');
    }
    else if(this.state.Predflipx !== '0rad' && this.state.PredflipY == '0rad'){
        return require('../assets/pacman_flipped.png');
    }else if(this.state.PredflipY !== '0rad' && this.state.Predflipx == '0rad'){
        return require('../assets/pacman_flipped_y.png');
    }else if(this.state.PredflipY == '180rad' && this.state.Predflipx == '180rad'){
        return require('../assets/pacman_3rd_quad.png');
    }
    else{
        return require('../assets/pacman.png');
    }
    }

  render() {

      const animatedStyles = {
      transform: this.state.animationSafeArea.getTranslateTransform(),
    };

    let PredRotate = this.state.animatedPredatorRotate.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.PredCurrentRotate, this.state.PredFutureRotate ],
    })


 
    const animatedPredatorStyle = {
      transform: [...this.state.animatedPredator.getTranslateTransform(),
        {
            rotate:PredRotate
        },
             
        ],
    };


    return (
      <View style={styles.container}>
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
            <TouchableWithoutFeedback >
              <Animated.View style={[styles.box, animatedStyles, {backgroundColor:this.state.SnakeColor, width: this.state.safeBoxWidth, height:this.state.safeBoxHeight }]}>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.pred, animatedPredatorStyle]}>
                <Image style={{width: 60,height: 60, borderRadius:30}} source={this.image_render_()}/>
              </Animated.View>
            </TouchableWithoutFeedback>
       
        {this.bugsRender()} 
        {this.bugsSpecialRender()} 
        {this.predator_Snake_Collision()} 
        {this.state.heads.slice(0).reverse().map((item, index, items) => {
          const pan = index === items.length - 1 ? this._panResponder.panHandlers : {};
          return (
            <Animated.View
              {...pan}
              key={index}
              source={item.image}
              style={[styles.head, {zIndex: 1, borderRadius: this.state.borderRadius, backgroundColor:this.state.SnakeColor, transform: item.animation.getTranslateTransform() }]}
            >
              {this.renderSecial()}
            </Animated.View>
          );
        })}
          </View>
        <View style={{position: "absolute", bottom: 10,flexDirection:'row', zIndex: 0}}>
          <View style={{flex:1}}>
            <Text style={{color:'white',fontSize:30, justifyContent:'center'}}>Points {this.state.points}</Text>
          </View>
          <View style={{flex:1, justifyContent:'center', alignItems:'center',flexDirection:'row'}}>
            <MaterialCommunityIcons name="heart" size={30} color= "red"/>
            <Text style={{color:'white',fontSize:30, justifyContent:'center'}}> {lives}</Text>
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
  bugSpecial:{
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 0,
  }
});
