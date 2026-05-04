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
    x: randomNumber(115, canvas.width-115),
    y: randomNumber(15,canvas.height-115),
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
//Player Instance
var myBall = createGameObject();
var player = createGameObject();
player.x = canvas.width/2;
player.y = canvas.height/2;
player.width = 30;
player.height = 30;
player.color = "yellow"

for(var i = 0; i<numeberofDots; i++){
    myBalls[i] = createGameObject();
    myBalls[i].moveY = 0;
    myBalls[i].y = k
}