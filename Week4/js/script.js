const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

var fps = 1000/60; //Gives you the Math for 60 frames per second
var timer = setInterval(game,fps); 
var x = canvas.width/2-50;
var y = canvas.height/2-50;
var moveX = setRandomDirection();
var moveY = setRandomDirection();
var color = setRandomColor();

function  game(){
    //We cleared the canvas 
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //Then we draw the object
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 50, 50);


//We update it's values
    x += moveX; 
    y += moveY;

    //logic for the object
    //Right Boundary 
    if(x > canvas.width - 50){
        moveX = -2;
        color = setRandomColor();
    }
    //Left Boundary 
    if(x < 0){
        moveX = 2 ;
        color = setRandomColor();
    }
    //bottom boundary of canvas
    if(y > canvas.height - 50){
        moveY = -2;
        color = setRandomColor();
    }
    //top boundary of canvas
    if(y < 0){
        moveY = 2;
        color = setRandomColor();
    }

}
function setRandomColor(){
     return`rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
}
function setRandomDirection(){
    var dir = Math.random();
    if(dir > 0.5){
        return 2;

    }else{

        return -2;
    }    
    

}