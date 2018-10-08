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
  TouchableWithoutFeedback,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);
const StatusBarHeight = StatusBar.currentHeight;
const safeBoxWidth = 80;
const safeBoxHeight = 80;
let lives = 3;
let special_Collison = false;
let special_status = '';
let safeStatus = false;
let specail_ruinning = false;
let predSpeed = 0;
let points = 0;
let SpeedAdd = 0;
let game_over = false;

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
      safeBox_X:35,
      safeBox_Y:0,
      SnakeColor:'red',
      borderRadius:20,
      bugs:[],
      bugsSpecial_array:[],
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

  resetGame(){
    lives = 3;
    special_Collison = false;
    special_status = '';
    safeStatus = false;
    specail_ruinning = false;
    predSpeed = 0;
    points = 0;
    SpeedAdd = 0;
    game_over = false;

  }

  collisionDetection(){

   const snakeX = this.state.snakeX;
   const snakeY = this.state.snakeY;
   const safeBox_X = Number(JSON.stringify(this.state.animationSafeArea.x))
   const safeBox_Y = Number(JSON.stringify(this.state.animationSafeArea.y));
   //border Radius
   let borderRadius = this.state.borderRadius;
   let SnakeColor = this.state.SnakeColor;


  // console.log("Collission: " + "Snake X " + snakeX + " safeBox_X "  + safeBox_X);
  // console.log("Collission: " + "Snake Y " + snakeY + " safeBox_Y "  + (safeBox_Y +35));

    if(snakeX >= safeBox_X && snakeX <= safeBox_X + safeBoxWidth){
        if(snakeY >= (safeBox_Y + 35 - 30) && snakeY <= (safeBox_Y + safeBoxHeight + 35 )){
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

    bugs.map((value,index) =>{
      if(snakeX >= (value.x - 35 + 10) && snakeX <= (value.x + 45)){
        if(snakeY >= (value.y + 35 - 40) && snakeY <= (value.y + 35 + 45)){
          bugs.splice(index,1);
          points += 10;
        }
      } 
    })


     bugsSpecial_array.map((value,index) =>{
        if(snakeX >= (value.x - 35) && snakeX <= (value.x + 35+50)){
          if(snakeY >= (value.y + 35 - 45) && snakeY <= (value.y + 60 + 35)){
            bugsSpecial_array.splice(index,1);
            points += 100;
            this.specialFunction(value.type);
            this.bugsSpecial();
          }
        } 
      })
  
     
    this.setState({
      bugs:bugs,
      bugsSpecial_array,
      points,
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
        setTimeout(this.specailInterval, 6000);      
  
        specail_ruinning = true;
    }
     
  }

  specailInterval(){
    special_status = '';
    special_Collison = false;
    specail_ruinning = false;
    predSpeed = 0;
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

    SpeedAdd = points/1000*150
  }

  bugsSpecial = (bug_color) => {
     
    const type = ['bug','test-tube','weight-kilogram','fire','heart'];
    //type:type[(Math.floor(Math.random() * 5) + 0)],
    const bugsSpecial_array = [];
    bugsSpecial_array.push({
          x:Math.floor(Math.abs(Math.random() * screenWidth - 35)),
          y:Math.floor(Math.abs(Math.random() * screenHeight - 35)),
          status:true,
          backgroundColor:bug_color,
          type:type[(Math.floor(Math.random() * 4) + 0)],
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
    this.bugsSpecial();
    this.interval = setInterval(() => {
      this.startPredator()
    }, 1000)   
  }
  
  //predator ------------------

  startPredator = () => {

    let pred_X = 0;
    let pred_Y = 0; 

 
    if(!safeStatus){

        pred_X = this.state.snakeX - 25;
        pred_Y = this.state.snakeY - 50;

        Animated.parallel([
            Animated.timing(this.state.animatedPredator, {
                toValue:{
                  x:screenWidth/2 - 60,
                  y:(screenHeight - StatusBarHeight - 140)/2
                }, 
                duration:(1200 + predSpeed - SpeedAdd)
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
                y:(screenHeight - StatusBarHeight - 140)/2
                },
                duration:800 
            }).start();

        }else{

            if((this.state.snakeX - 35) > screenWidth/2){
            pred_X = 0;
            }else{
            pred_X = screenWidth - 60;
            }
            if(this.state.snakeY - StatusBarHeight > screenHeight/2){
              pred_Y = 0;
            }else{
              pred_Y = screenHeight -60 -35;
            }
            Animated.timing(this.state.animatedPredator, {
                toValue:{
                  x:screenWidth/2 - 60,
                  y:(screenHeight - StatusBarHeight - 140)/2
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

    // console.log("Collission: " + "Snake X " + snakeX + " safeBox_X "  + (pred_X +25));
    // console.log("Collission: " + "Snake Y " + snakeY + " safeBox_Y "  + (pred_Y + 50));
  

     if(snakeX >= ( pred_X + 25 - 57)  && snakeX <= ( pred_X +25 + 57 )){
       if(snakeY >= ( pred_Y + 50 -57) && snakeY <= ( pred_Y + 50 + 57)){
        if(special_status === "fire"){
            special_Collison = true;
        }else{
            if(!game_over){
                lives =  lives;
                console.log("Dead");
                if(lives === 0){
                   game_over = true;
                   this.gameover();
                   this.loadData();
                }
            }
        }
       }
     }
  }

    async saveData(){

            const TotalScore = `{"TotalScore":${this.state.TotalScore.TotalScore + points}}`
            try {
                AsyncStorage.setItem('@TotalScore:key', TotalScore);
            } catch (error) {}

            const HighScore = this.state.HighScore;

            if(HighScore["HighScore"].length <= 5){
                HighScore["HighScore"].push(points);  
                try {
                    AsyncStorage.setItem('@HighScores:key',JSON.stringify(HighScore));
                } catch (error) {}
            }
            else{
                const minScore = Math.min.apply( Math, HighScore["HighScore"] );
                const index = HighScore["HighScore"].indexOf(minScore);

                if(points > minScore){
                    HighScore["HighScore"][index] = points;
                    try {
                        AsyncStorage.setItem('@HighScores:key',JSON.stringify(HighScore));
                    } catch (error) {}
                }
            }
    }

    async loadData() {

        AsyncStorage.multiGet(['@HighScores:key','@TotalScore:key']).then((value) => {

            let HighScore = value[0][1];
            let TotalScore = value[1][1];

            if(HighScore === null){
                HighScore = '{"HighScore":[0]}';
            }
        
            if(TotalScore == null){
                TotalScore = '{"TotalScore":0}';
            }

            this.setState({
                HighScore:JSON.parse(HighScore),
                TotalScore:JSON.parse(TotalScore)
            })
    }).then(() => {
        this.saveData();
    })
    };


  gameover(){
      if(game_over){
        return (
        <View style={{width:(Dimensions.get('window').width),height:300,zIndex:3, backgroundColor: "rgba(0,0,0,.25)", alignItems: "center",justifyContent: "center"}}>
            <Text style={{fontSize:30,color:'white',justifyContent:'center',textAlign:'center', paddingTop:20}}>Game Over!</Text>
            <TouchableOpacity style={styles.button} >
                  <Text style={styles.buttonText}>Play Again!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonEnd} onPress={() => {
                  this.resetGame();
                  this.props.navigation.navigate('MainMenu')
                  }}>
                  <Text style={styles.buttonText}>End</Text>
              </TouchableOpacity>
        </View>
        )
      }
      
  }

  startAnimation = () => {

    const _x = Math.floor(Math.abs(Math.random() * screenWidth - safeBoxWidth) + 35);
    const _y = Math.floor(Math.abs(Math.random() * screenHeight - safeBoxHeight));

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
      <View style={[styles.container]}>
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
            <TouchableWithoutFeedback >
              <Animated.View style={[styles.box, animatedStyles, {backgroundColor:this.state.SnakeColor, width: safeBoxWidth, height:safeBoxHeight }]}>
              </Animated.View>
            </TouchableWithoutFeedback>

        </View>  
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
          {this.bugsRender()} 
        </View>
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
          {this.bugsSpecialRender()} 
        </View>
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
          {this.predator_Snake_Collision()} 
        </View>

        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
            <View style={styles.absoluteFill}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.pred, animatedPredatorStyle]}>
                <Image style={{width: 60,height: 60, borderRadius:30}} source={this.image_render_()}/>
              </Animated.View>
            </TouchableWithoutFeedback>
            </View>
        </View>    
      
        {this.gameover()}
        <View style={{ position: 'absolute',top: StatusBarHeight,right: 0,bottom: 0,left: 0,}}>
        {this.state.heads.slice(0).reverse().map((item, index, items) => {
          const pan = index === items.length - 1 ? this._panResponder.panHandlers : {};
          if(!game_over){
            return (
                <Animated.View
                  {...pan}
                  key={index}
                  source={item.image}
                  style={[styles.head, {zIndex: 6, borderRadius: this.state.borderRadius, backgroundColor:this.state.SnakeColor, transform: item.animation.getTranslateTransform() }]}
                >
                  {this.renderSecial()}
                </Animated.View>
              );
          }
        })}
        </View>

        <View style={{position: "absolute", bottom: 10,flexDirection:'row', zIndex: 0}}>
          <View style={{flex:1}}>
            <Text style={{color:'white',fontSize:30, justifyContent:'center'}}>Points {points}</Text>
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
