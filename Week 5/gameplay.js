//scenery setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var interval = 1000/ 60;
setInterval(game,interval);

//player speed
var acceleration = 0.6;
var friction = 0.88;
var maxspeed = 11;
var numberofEnemies;
var score = 0;
var timer = 0; //seconds 

//gamestate
var states = ("game")
states = "game"

//creation of player 
function createGameObject(){
    var gameObject = {
    x: randomNumber(115, canvas.width - 115),
    y: randomNumber(15, canvas.height - 15),
    moveX: setRandomDirection(), 
    moveY: setRandomDirection(),
    velocityX: 0,
    velocityY: 0,
    color: "yellow",
    radius: 15,
    width: 15,
    height: 15,
    drawBall: function (){
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI)
        ctx.fill()
    },
     drawSquare: function () {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    }
    return gameObject;
}

function randomNumber(low,high){
    return Math.random() * (high - low) + low;
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
var numberofEnemies = 10;

for(var i = 0; i<numberofEnemies; i++){
    myBalls[i] = createGameObject();
    myBalls[i].y = myBalls[i].y
}

//bullets
var bullets =[];
var canShoot = true
//shooting mechanics
function shoot(){
    var bullet = createGameObject();
    bullet.x = player.x + player.width /2 - 4;
    bullet.y = player.y;
    bullet.width = 8;
    bullet.height = 10;
    bullet.color = "red";
    bullet.velocityY = -10;
    //bullet array
    bullets.push(bullet);
    canShoot = false;
    //cooldown
    setTimeout(function () {canShoot = true}, 300);
}
//powerups
var powerups
var activate = true 

//draw hud
function drawHUD(){
    //minutes and seconds 
    var minutes = Math.floor(timer / 60);
    var seconds = Math.floor(timer % 60);
    var secondsText = String(seconds).padStart(2,"0");
    //display
ctx.fillStyle = "black";
ctx.font = "20px Arial";
ctx.fillText(`Enemies Defeated ${score}|| Time ${minutes}:${seconds}`,20, 30)
}

function game(){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer += interval/1000;

    switch (states){
        case "game":
            drawHUD();
            
    

    //moving the player
    numberofEnemies = myBalls.length;
    if(numberofEnemies <= 0){
        states = "win";
    }
    if(w == true || up == true){
        player.velocityY -= acceleration
    }
    if(s == true || down == true){
        player.velocityY += acceleration
    }
    if(a == true || left == true){
        player.velocityX -= acceleration
    }
    if(d == true || right == true){
        player.velocityX += acceleration
    }
    if(space == true || powerups == true){
        powerups();

    }
    if(click && canShoot){
        shoot();
        click = false;
    }

    //velocity to zero
    player.velocityY *= friction;
    player.velocityX *= friction;

    //updating postition
    player.x += player.velocityX;
    player.y += player.velocityY;

    myBall.drawBall();
    player.drawSquare();

    //stage boundaries
    



        for (var i = 0; i < myBalls.length; i++){
            var enemy = myBalls[i];

            var dx = player.x - enemy.x;
            var dy = player.y - enemy.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            var speed = 2;
    
            if (dist > 0){
                enemy.moveX = (dx / dist) * speed;
                enemy.moveY = (dy / dist) * speed
                
            }
            enemy.x += enemy.moveX;
            enemy.y += enemy.moveY;
            enemy.drawBall()

            if(enemy.y > canvas.height + enemy.radius){
                enemy.y = -randomNumber(0, canvas.height);
            }
            if(enemy.x < enemy.radius +100){
                enemy.moveX *= -1;
                enemy.color = "orange";
                enemy.y += enemy.radius * 3;
            }
            if(enemy.y - enemy.radius > canvas.height){
                enemy.y = -enemy.radius;
                enemy.x = randomNumber(enemy.radius, canvas.width - enemy.radius)
            }
          
        }
        
        //collision between the bullets and the balls 
        for(var b = bullets.length - 1; b >= 0; b--){
            console.log(bullets.length)
            bullets[b].x += bullets[b].velocityX;
            bullets[b].y += bullets[b].velocityY;

            bullets[b].drawSquare();

            if (bullets[b].y + bullets[b].height < 0){
                bullets.splice(b,1)
            }else{
            for (var e = 0; e < myBalls.length; e++){
                var distX = bullets[b].x - myBalls[e].x;
                var distY = bullets[b].y - myBalls[e].y;
                var dist = Math.sqrt((distX* distX) + (distY * distY))
                
                if(dist < myBalls[e].radius){
                    score++;
                    myBalls.splice(e, 1);
                    bullets.splice (b, 1);
                    break;

                }

            }
           
        }
    }

}
    
}

