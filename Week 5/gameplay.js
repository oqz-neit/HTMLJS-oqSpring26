//scenery setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var lasttime = 0;
requestAnimationFrame(game);

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
    hasEntered:false,
    drawBall: function (){
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI)
        ctx.fill()
    },
     drawSquare: function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(-this.radius,this.radius);
        ctx.lineTo(this.radius,this.radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
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
player.rotation = 0;  // initialize rotation
var myBalls = [];
//enemies spawn timer
var spawnTimer = 0;

function spawnEnemy(){
   var enemy = createGameObject();
   var side = Math.floor(Math.random()* 4);
   if(side === 0){ //top
    enemy.x = randomNumber(0, canvas.width);
    enemy.y = -enemy.radius
   }else if(side === 1){ //right
    enemy.x = canvas.width + enemy.radius;
    enemy.y = randomNumber(0, canvas.height);
    }else if(side === 2){ //bottom
        enemy.x = randomNumber(0, canvas.width);
        enemy.y = canvas.height + enemy.radius;
    }else{//left
        enemy.x = -enemy.radius
        enemy.y = randomNumber(0, canvas.height);

    }
    myBalls.push(enemy);
}

//starting 10 enemies to start
for(var i = 0; i < 10; i++){
    spawnEnemy();
}

//bullets
var bullets =[];
var canShoot = true
//shooting mechanics
function shoot(){
    var bullet = createGameObject();
    
    // Offset bullet spawn to tip of triangle
    var tipDistance = player.radius;
    var fireAngle = player.rotation - Math.PI / 2;  // Remove the +π/2 offset
    bullet.x = player.x + Math.cos(fireAngle) * tipDistance;
    bullet.y = player.y + Math.sin(fireAngle) * tipDistance;
    
    bullet.width = 8;
    bullet.height = 10;
    bullet.color = "red";

    //fire in the direction the player is facing
    var speed = 10;
    bullet.velocityX = Math.cos(fireAngle) * speed;
    bullet.velocityY = Math.sin(fireAngle) * speed;
    //bullet array
    bullets.push(bullet);
    canShoot = false;
    //cooldown
    setTimeout(function () {canShoot = true}, 300);
}
//bullet hell powerup
function bulletHell(){
    var numBullets = 16;
    for(var k = 0; k < numBullets; k++){
        var angle = (k / numBullets) * 2 * Math.PI;
        var b = createGameObject();
        b.x = player.x;
        b.y = player.y;
        b.color = "magenta";
        b.width = 8;
        b.height = 10;
        b.velocityX = Math.cos(angle) * 10;
        b.velocityY = Math.sin(angle) * 10;
        bullets.push(b);
    }
}
//bullet hell timer 
function startBulletHell(){
    bulletHellTimer = 3;
    bulletHell();
    var hellInterval = setInterval(function(){
        bulletHell();
        bulletHellTimer--;
    }, 1000);
    setTimeout(function(){
        clearInterval(hellInterval);
        bulletHellTimer = 0;
    }, 3000);
}
//powerups
var powerupItems = []; //pickups on screen
var currentPowerup = null; //no powerup held
var isDashing = false;
var dashTimer = 0;
var dashDuration = 15;
var dashSpeed = 25;
var bulletHellTimer = 0

//draw hud
function drawHUD(){
    //minutes and seconds 
    var minutes = Math.floor(timer / 60);
    var seconds = Math.floor(timer % 60);
    
    //display
ctx.fillStyle = "black";
ctx.font = "20px Arial";
ctx.fillText(`Enemies Defeated ${score}|| Time ${minutes}:${seconds}`,20, 30)
var puNames = {dash: "DASH", nuke: "NUKE", bulletHell: "BULLET HELL"};
var puColors = {dash: "cyan", nuke: "orange", bulletHell: "magenta"};
ctx.fillStyle = currentPowerup ? puColors[currentPowerup] : "gray";
ctx.fillText(currentPowerup ? puNames[currentPowerup] + "- press SPACE" : "NO POWERUP",20 ,55);
if(bulletHellTimer > 0 ){
    ctx.fillStyle = "magenta"
    ctx.fillText("BULLET HELL:" + bulletHellTimer, 20, 80);
    } 
}

function game(timestamp){
    //clear screen & increasing timer
    requestAnimationFrame(game);
    var delta = (timestamp - lasttime) / 1000;
    lasttime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer += delta;
    spawnTimer += delta;
    
        var spawnRate = Math.max(1, 3 - Math.floor(timer / 30));
        if(spawnTimer >= spawnRate){
            spawnTimer = 0;
        
        var count = 1 + Math.floor(timer / 30);
        for(var j = 0; j < count; j++){
            spawnEnemy();
        }
    }

    switch (states){
        case "game":
            drawHUD();
            
    

    //moving the player
    numberofEnemies = myBalls.length;
    
    //player rotation
    var dx = mouseX - player.x;
    var dy = mouseY - player.y;
    player.rotation = Math.atan2 (dy, dx) + Math.PI / 2;
    //
    if(w == true || up == true){
        player.velocityY -= acceleration * (delta *60 )
    }
    if(s == true || down == true){
        player.velocityY += acceleration* (delta *60 )
    }
    if(a == true || left == true){
        player.velocityX -= acceleration* (delta *60 )
    }
    if(d == true || right == true){
        player.velocityX += acceleration* (delta *60 )
    }
    if(space && currentPowerup && !isDashing){
        if(currentPowerup === "dash"){
            isDashing = true;
            dashTimer = dashDuration;
        }else if(currentPowerup === "nuke"){
        score += myBalls.length;
        myBalls = [];
        }else if(currentPowerup === "bulletHell"){
            startBulletHell();
        }
        currentPowerup = null;
    }
        
    if(click && canShoot){
        shoot();
        click = false;
    }

    //velocity to zero
    player.velocityY *= Math.pow(friction, delta * 60);
    player.velocityX *= Math.pow(friction, delta * 60);

    //updating postition
    player.x += player.velocityX * (delta * 60);
    player.y += player.velocityY * (delta * 60);

    //player boundaries
    if(player.x - player.radius < 0) player.x = player.radius;
    if(player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
    if(player.y - player.radius < 0) player.y = player.radius;
    if(player.y + player.radius > canvas.height) player.y = canvas.height - player.radius

    //dash movement
    if(isDashing){
        var dashAngle = player.rotation - Math.PI / 2;
        player.x += Math.cos(dashAngle) * dashSpeed;
        player.y += Math.sin(dashAngle) * dashSpeed;
        dashTimer -= delta * 60;
        if(dashTimer <= 0) isDashing = false;
        for(var e = myBalls.length - 1; e >= 0; e--){
            var edx = player.x - myBalls[e].x;
            var edy = player.y - myBalls[e].y;
            var edist = Math.sqrt(edx * edx + edy *edy);
            if(edist < player.radius + myBalls[e].radius){
                score++;
                myBalls.splice(e,1);
            }

        }
    }

    myBall.drawBall();
    player.drawSquare();

    
    
    


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
            enemy.x += enemy.moveX * (delta * 60);
            enemy.y += enemy.moveY * (delta * 60);
           

            //boundary check
            if(!enemy.hasEntered &&
             enemy.x - enemy.radius > 0 &&
             enemy.x + enemy.radius < canvas.width &&
             enemy.y - enemy.radius > 0 &&
             enemy.y + enemy.radius < canvas.height){
                enemy.hasEntered = true;
             }

             //tight boundary checks after entering
             if(enemy.hasEntered){
                if(enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > canvas.width){
                    enemy.y = -randomNumber(50,200);
                    enemy.x = randomNumber(enemy.radius, canvas.width - enemy.radius);
                    enemy.hasEntered = false;
                }
        
                    if(enemy.y + enemy.radius > canvas.height){
                        enemy.y = -randomNumber(50,200);
                        enemy.x = randomNumber(enemy.radius, canvas.width - enemy.radius);
                        enemy.hasEntered = false;
                    }
                }
             
            enemy.drawBall();
          
        }
        //powerup draw and collect
        for(var p = powerupItems.length -  1; p >= 0; p--){
            var pu = powerupItems[p];
            ctx.beginPath();
            ctx.fillStyle = pu.color;
            ctx.arc(pu.x, pu.y, pu.radius, 0, 2 * Math.PI);
            ctx.fill();
        var pdx = player.x - pu.x;
        var pdy = player.y - pu.y;
        var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if(pdist < player.radius + pu.radius){
            currentPowerup = pu.type;
            powerupItems.splice(p, 1);
            }

        }
        
        //collision between the bullets and the balls 
        for(var b = bullets.length - 1; b >= 0; b--){
        bullets[b].x += bullets[b].velocityX * (delta * 60);
            bullets[b].y += bullets[b].velocityY * (delta * 60);

            bullets[b].drawSquare();

            if (bullets[b].y + bullets[b].height < 0){
                bullets.splice(b,1)
            }else{
            for (var e = 0; e < myBalls.length; e++){
                var distX = bullets[b].x - myBalls[e].x;
                var distY = bullets[b].y - myBalls[e].y;
                var dist = Math.sqrt((distX* distX) + (distY * distY))
                //drop logic
                if(dist < myBalls[e].radius){
                    score++;
                    var deadX = myBalls[e].x;
                    var deadY = myBalls[e].y;
                    myBalls.splice(e, 1);
                    bullets.splice (b, 1);
                    if(Math.random() < 0.1){
                        var types = ["dash", "nuke", "bulletHell"];
                        var type = types[Math.floor(Math.random() * types.length)];
                        var puColors = {dash: "cyan", nuke: "orange", bulletHell: "magenta"};
                        powerupItems.push({x: deadX, y: deadY, radius: 10, type: type, color: puColors[type]});
                    }
                    break;

                }
                
            }
           
        }
    
        }       
        break;
    }

}
