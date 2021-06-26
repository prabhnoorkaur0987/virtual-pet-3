//Create variables here
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom,washroom,garden
var update,readstate,gameState
function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
bedroom=loadImage("images/Bed Room.png")
garden=loadImage("images/Garden.png")
washroom=loadImage("images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  currentTime=hour()


  if(currentTime==(lastFed+1)){
    update("playing")
    foodObj.garden()
  }else if(currentTime==(lastFed+2)){
    update("sleeping")
foodObj.bedroom()

  }else if(currentTime>=lastFed+2 && currentTime<=lastFed+4){
    update("washroom")
    foodObj.washroom()
  }else 
  if(gameState==="hungry"){
   
    feed.show()
    addFood.show()
    dog.show()
    dog.addImage(sadDog)
  }
  fill("white")
  stroke ("red")
  textSize (20)
  text("name the dog",200,25)
  foodObj.display();
readstate=database.ref("gameState")
readstate.on("value",function(data){
gameState=data.val()
})

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){

  dog.addImage(sadDog)
  foodS++;
  database.ref('/').update({
    food:foodS
  })
function update(state){
  database.ref("/").update({
    gameState:state
  })
}
}