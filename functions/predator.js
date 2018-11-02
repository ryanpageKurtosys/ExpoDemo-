export default startPredator = () => {

    let pred_X = 0;
    let pred_Y = 0; 
    
      if(!this.state.safeStatus){

        pred_X = this.state.snakeX - 37.5;
        pred_Y = this.state.snakeY - StatusBarHeight - 110;

        Animated.timing(this.state.animatedPredator, {
          toValue:{
           x:pred_X,
           y:pred_Y,
          },
          duration:1200 
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
             duration:1200 
           }).start();
        }

        this.setState({
          pred_X,
          pred_Y
        });
      } 