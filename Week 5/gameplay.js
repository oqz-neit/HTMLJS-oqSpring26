//scenery setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var interval = 1000/60
setInterval(game,interval);

//player speed
var acceleration = 0.6;
var friction = 0.88;
var maxspeed = 11;

//creation of player 
function createGameObject(){
    var gameObject = {
    x: randomNumber(500, canvas.width/2 - 1000),
    y: randomNumber(50,canvas.height/2 - 1000),
    moveX: setRandomDirection(), 
    moveY: setRandomDirection(),
    velocityX:0,
    velocityY:0,
    color: `yellow`,
    radius: 15,
    width: 15,
    height: 15,
    drawBall: function (){
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI)
    },
     drawTriangle: function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(120,120);
        ctx.lineTo(150,135);
        ctx.lineTo(120,150);
        ctx.lineTo(120,120);
        ctx.fill();
        
         
    },

    }
    return gameObject;
}

function randomNumber(low,high){
    return Math.random * (high - low) + low;
    }
function setRandomDirection(){
    var dir = Math.random();
    if(dir > 0.5){
        return 2; 
    } else {
        return -2
    }
}


//Player Instance
var myBall = createGameObject();
var player = createGameObject();
player.x = canvas.width/2;
player.y = canvas.height/2;
player.width = 30;
player.height = 30;
player.color = "yellow"
var myBalls = [];
var numeberofDots = 10;

for(var i = 0; i<numeberofDots; i++){
    myBalls[i] = createGameObject();
    myBalls[i].moveY = 0;
    myBalls[i].y = myBalls[i].y
}

//bullets
var bullet =[];
var canShoot = true
//shooting mechanics
function shoot(){
    var bullet = createGameObject();
    bullet.x = player.x + player.width /2 - 4;
    bullet.y = player.y;
    bullet.width = 8;
    bullet.height = -10;
    bullet.color = "orange";
    bullet.velocityY = -10;
    //bullet array
    bullets.push(bullet);
    canShoot = false;
    //cooldown
    setTimeout(function () {canShoot = true}, 300);
}

function game(){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //moving the player
}


