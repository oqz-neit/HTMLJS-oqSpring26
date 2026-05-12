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
        ctx.fillStyle = "green";
        ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI);
        ctx.fill();
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

function spawnEnemy(phase){ //enemy phases
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
    //enemy types foundation
   var roll = Math.random();
   if(snakeBoss){
    if(roll < 0.6){
        enemy.type = "chaser";
    } else {
        enemy.type = "orbital";
        enemy.color = "#8800cc";
        enemy.orbiting = false;
        enemy.orbitAngle = Math.random() * 2 * Math.PI;
        enemy.orbitRadius = 150;
        enemy.orbitSpeed = (Math.random() > 0.5) ? 1.5 : -1.5;
        enemy.dodgeCooldown = 0;
    }
    myBalls.push(enemy);
    return;
   }
   if(phase === 1){
        enemy.type = "chaser";
   } else if (phase === 2){
    if(roll < 0.7){
        enemy.type = "chaser";
    } else {
    enemy.type = "shooter";
    enemy.color = "#ff4444";
    enemy.shootTimer = 0;
    enemy.shootInterval = 1.8;
   } 
} else {
    if(roll < 0.55){ // reg chaser
    enemy.type = "chaser";
   } else if(roll < 0.85){ //shooter
    enemy.type = "shooter";
    enemy.color = "#ff4444";
    enemy.shootTimer = 0;
    enemy.shootInterval = 1.8;
   } else { // orbital enemy 
    enemy.type = "orbital";
    enemy.color = "#8800cc";
    enemy.orbiting = false;
    enemy.orbitAngle = Math.random() * 2 * Math.PI;
    enemy.orbitRadius = 150;
    enemy.orbitSpeed = (Math.random() > 0.5) ? 1.5 : -1.5;
    enemy.dodgeCooldown = 0;
   }

   
}
myBalls.push(enemy);
}

//starting 10 enemies to start
for(var i = 0; i < 10; i++){
    spawnEnemy(1);
}

//bullets
var bullets =[];
var canShoot = true;
var enemyBullets = [];
var bossSpawned = false;
var snakeBoss = null;
var bossTime = 80;
var bossAlert = 0;
var alertMessage = "";
var pendingAlert = "";
var weaponUpgraded = false;
var tripleShot = false;
//shooting mechanics
function shoot(){
    // Offset bullet spawn to tip of triangle
    var fireAngle = player.rotation - Math.PI / 2;  // Remove the +π/2 offset
    var speed = 10;
    var tipDistance = player.radius;

    var angleOffsets;
    if(tripleShot){
        angleOffsets = [-0.2, 0, 0.2];
    } else if(weaponUpgraded){
        angleOffsets = [-0.15, 0.15];
    } else {
        angleOffsets = [0];
    }
    
    for(var o = 0; o < angleOffsets.length; o++){
        var angle = fireAngle + angleOffsets[o];
        var bullet = createGameObject();
        bullet.x = player.x + Math.cos(fireAngle) * tipDistance;
        bullet.y = player.y + Math.sin(fireAngle) * tipDistance;
        bullet.width = 8;
        bullet.height = 10;
        bullet.color = "red";
        bullet.velocityX = Math.cos(angle) * speed;
        bullet.velocityY = Math.sin(angle) * speed;
        bullet.rotation = player.rotation + angleOffsets[o];
        bullets.push(bullet);
    }
    canShoot = false;
    //cooldown
    setTimeout(function () {canShoot = true}, 200);
}
//pacman powerup
// function pacman(){
//     var player = createGameObject();
    
// }
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
        b.rotation = player.rotation;
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
//powerup
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
function drawDiamond(e){
    ctx.save();
    ctx.translate(e.x,e.y);
    ctx.rotate(Math.PI / 4);    //45 degree turns a square into a diamond 
    ctx.fillStyle = "#ff4444";
    ctx.strokeStyle = "#990000";
    ctx.lineWidth = 2;
    ctx.fillRect(-e.radius, -e.radius,e.radius * 2, e.radius * 2);
    ctx.strokeRect(-e.radius,-e.radius, e.radius * 2, e.radius * 2);
    ctx.restore();
}
function drawStripedCircle(e){
    ctx.save();
    ctx.translate(e.x,e.y);
    ctx.beginPath();
    ctx.arc(0, 0, e.radius, 0, 2 * Math.PI);
    ctx.clip(); //clips drawing to the circle's shape 
    ctx.fillStyle = e.orbiting ? "#cc00cc" : "#8800cc"; //brighter when orbiting
    ctx.fillRect(-e.radius,-e.radius,e.radius * 2, e.radius * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
    for(var i = -e.radius; i < e.radius; i += 7){ //draw verticle stripes 
    ctx.fillRect(i, -e.radius, 3, e.radius * 2);
    }
    ctx.restore();
}
function spawnSnakeBoss(){
    snakeBoss = {
        segments: [],
        hp: 3,
        maxHp: 3,
        moveX: 3,
        moveY: 2
    };
    for(var i = 0; i < 50; i++){
        snakeBoss.segments.push({
            x: 50 - i * 28,
            y: canvas.height / 2,
            shootTimer: i * 0.3,
            shootInterval: 1.5 
        });
    }
}
    function updateBoss(delta){
        var head = snakeBoss.segments[0];
        head.x += snakeBoss.moveX * (delta * 60);
        head.y += snakeBoss.moveY * (delta * 60);
        if(head.x - 22 < 0 || head.x + 22 > canvas.width) snakeBoss.moveX *= -1;
        if(head.y - 22 < 0 || head.y + 22 > canvas.height) snakeBoss.moveY *= -1;
        var spacing = 26;
        for(var i = 1; i < snakeBoss.segments.length; i++){
            var seg = snakeBoss.segments[i];
            var prev = snakeBoss.segments[i - 1];
            var sdx = prev.x - seg.x;
            var sdy = prev.y - seg.y;
            var sdist = Math.sqrt(sdx * sdx + sdy * sdy);
            if(sdist > spacing){
                seg.x += (sdx / sdist) * (sdist - spacing);
                seg.y += (sdy / sdist) * (sdist - spacing);
            }
        }
        for(var i = 0; i < snakeBoss.segments.length; i++){
            var seg = snakeBoss.segments[i];
            seg.shootTimer += delta;
            if(seg.shootTimer >= seg.shootInterval){
                seg.shootTimer = 0;
                var angle = Math.random() * 2 * Math.PI;
                enemyBullets.push({
                    x: seg.x, y: seg.y,
                    velocityX: Math.cos(angle) * 4,
                    velocityY: Math.sin(angle) * 4,
                    radius: 5,
                    bouncing: true,
                    lifetime: 8
                })
                
            }
        }
    
    }           //snake boss form 
    function drawBoss(){
        for(var i = snakeBoss.segments.length - 1; i >= 0; i--){
            var seg = snakeBoss.segments[i];
            var segRadius = i === 0 ? 22 : 18;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segRadius, 0, 2 * Math.PI);
            ctx.fillStyle = i === 0  ? "#00ff88" : "#007744";
            ctx.fill();
            ctx.strokeStyle = "#00ffaa";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.fillStyle = "#333";
        ctx.fillRect(canvas.width / 2 - 100, 8, 200, 14);
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(canvas.width / 2 - 100, 8, 200 * (snakeBoss.hp / snakeBoss.maxHp), 14);
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width / 2 - 100, 8, 200, 14);
    }
    function game(timestamp){
    //clear screen & increasing timer
    requestAnimationFrame(game);
    var delta = (timestamp - lasttime) / 1000;
    lasttime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer += delta;
    spawnTimer += delta;

        var phase = timer < 15 ? 1 : timer < 25 ? 2 : 3;
        var spawnRate = Math.max(1.5, 3 - Math.floor(timer / 30));
        var count = Math.min(4, 1 + Math.floor(timer / 30));
        if(spawnTimer >= spawnRate){
            spawnTimer = 0;
        for(var j = 0; j < count; j++){
            spawnEnemy(phase);
        }
    }
    if(timer >= 40 && !weaponUpgraded){
        weaponUpgraded = true;
        bossAlert = 3;
        alertMessage = "DUAL"
    }
    if(timer >= bossTime - 5 && !bossSpawned && bossAlert <= 0){
        bossAlert = 5;
        alertMessage = "BOSS INCOMING"
    }
    //boss alert display
    if(timer >= bossTime && !bossSpawned){
        bossSpawned = true;
        myBalls = [];
        spawnSnakeBoss();
        }
        if(bossAlert > 0){
            bossAlert -= delta;
            if(bossAlert <= 0 && pendingAlert !== ""){
                alertMessage = pendingAlert;
                pendingAlert = "";
                bossAlert = 3;
            }
            if(bossAlert > 0){
            ctx.save();
            ctx.fillStyle = "rgba(255, 0, 0," + Math.min(1, bossAlert) + ")";
            ctx.font = "bold 100px Arial";
            ctx.textAlign = "center";
            ctx.fillText(alertMessage, canvas.width / 2, canvas.height / 2);
            ctx.restore();
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
    var moveX = 0;
    var moveY = 0;
    if(w == true || up == true){
        moveY -= 1; 
    }
    if(s == true || down == true){
        moveY += 1;
    }
     if(a == true || left == true){
         moveX -= 1;
     }
     if(d == true || right == true){
         moveX += 1;
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
       
    }

    //acceleration
    player.velocityX += moveX * acceleration * (delta * 60);
    player.velocityY += moveY * acceleration * (delta * 60);
    
    //velocity to zero
    player.velocityY *= Math.pow(friction, delta * 60);
    player.velocityX *= Math.pow(friction, delta * 60);

    player.velocityX = Math.max(-maxspeed, Math.min(maxspeed,player.velocityX));
    player.velocityY = Math.max(-maxspeed, Math.min(maxspeed, player.velocityY));

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

    // ENEMY LOOP
    for(var i = 0; i < myBalls.length; i++){
            var enemy = myBalls[i];

           if(enemy.type === "orbital" && enemy.orbiting){
            if(Math.random() < 0.15 * delta) enemy.orbitSpeed *= -1;
            if(enemy.dodgeCooldown > 0) enemy.dodgeCooldown -= delta;
            for(var bd = 0; bd < bullets.length; bd++){
                var bddx = bullets[bd].x - enemy.x;
                var bddy = bullets[bd].y - enemy.y;
                var bddist = Math.sqrt(bddx * bddx + bddy * bddy);
                if(bddist < 70 && enemy.dodgeCooldown <= 0){
                    enemy.orbitSpeed *= -1;
                    enemy.dodgeCooldown = 0.5;
                    break;
                }
            }
            enemy.orbitAngle += enemy.orbitSpeed * delta;
            enemy.orbitRadius -= 25 * delta;
            enemy.x = player.x + Math.cos(enemy.orbitAngle) * enemy.orbitRadius;
            enemy.y = player.y + Math.sin(enemy.orbitAngle) * enemy.orbitRadius;
            if(enemy.orbitRadius <= player.radius){
                score = Math.max(0, score - 1);
                myBalls.splice(i, 1);
                i--;
            }
           } else {
            var edx = player.x - enemy.x;
            var edy = player.y - enemy.y;
            var edist = Math.sqrt(edx * edx + edy * edy);
            var espeed = (enemy.type === "shooter") ? 1.2 : 2;
            if(edist > 0){
                enemy.moveX = (edx / edist) * espeed;
                enemy.moveY = (edy / edist) * espeed;
            }
             enemy.x += enemy.moveX * (delta * 60);
             enemy.y += enemy.moveY * (delta * 60);
            if(enemy.type === "shooter"){
                enemy.shootTimer += delta;
                if(enemy.shootTimer >= enemy.shootInterval){
                    enemy.shootTimer = 0;
                    var adx = player.x - enemy.x;
                    var ady = player.y - enemy.y;
                    var adist = Math.sqrt(adx * adx + ady * ady);
                    if(adist > 0){
                        enemyBullets.push({
                            x: enemy.x, y: enemy.y,
                            velocityX: (adx / adist) * 4,
                            velocityY: (ady / adist) * 4,
                            radius: 5
                        });
                    }
                }
            }
            if(!enemy.hasEntered &&
                enemy.x - enemy.radius > 0 &&
                enemy.x + enemy.radius < canvas.width &&
                enemy.y - enemy.radius > 0 &&
                enemy.y + enemy.radius < canvas.height){
                    enemy.hasEntered = true;
                }
                if(enemy.hasEntered){
                    if(enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > canvas.width){
                        enemy.y = -randomNumber(50, 200);
                        enemy.x = randomNumber(enemy.radius, canvas.width - enemy.radius);
                        enemy.hasEntered = false;
                    }
                    if(enemy.y + enemy.radius > canvas.height){
                        enemy.y = -randomNumber(50, 200);
                        enemy.x = randomNumber(enemy.radius, canvas.width - enemy.radius);
                        enemy.hasEntered = false;
                    }
                }
            }
                if(enemy.type === "shooter"){
                    drawDiamond(enemy);
                } else if(enemy.type === "orbital"){
                    drawStripedCircle(enemy);
                } else {
                    enemy.drawBall();
                }
            }
            
            //powerup loop
            for(var p = powerupItems.length - 1; p >= 0; p--){
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

            // PLAYER BULLETS
            for(var b = bullets.length - 1; b >= 0; b--){
                bullets[b].x += bullets[b].velocityX * (delta * 60);
                bullets[b].y += bullets[b].velocityY * (delta * 60);
                bullets[b].drawSquare();
                if(bullets[b].y + bullets[b].height < 0){
                    bullets.splice(b, 1);
                } else {
                    for(var e = 0; e < myBalls.length; e++){
                        var distX = bullets[b].x - myBalls[e].x;
                        var distY = bullets[b].y - myBalls[e].y;
                        var dist = Math.sqrt(distX * distX + distY * distY);
                        if(dist < myBalls[e].radius){
                            if(myBalls[e].type === "orbital" && !myBalls[e].orbiting){
                                myBalls[e].orbiting = true;
                                bullets.splice(b, 1);
                            } else {
                                score++;
                                var deadX = myBalls[e].x;
                                var deadY = myBalls[e].y;
                                myBalls.splice(e, 1);
                                bullets.splice(b, 1);
                                if(Math.random() < 0.1){
                                    var types = ["dash", "nuke", "bulletHell"];
                                    var type = types[Math.floor(Math.random() * types.length)];
                                    var puColors = {dash: "cyan", nuke: "orange", bulletHell: "magenta"};
                                    powerupItems.push({x: deadX, y: deadY, radius: 10, type: type, color: puColors[type]});

                                }
                            }
                            break;
                        }
                    }
                    if(snakeBoss && b >= 0 && b < bullets.length){
                        for(var si = snakeBoss.segments.length - 1; si >= 0; si--){
                            var seg = snakeBoss.segments[si];
                            var segRadius = si === 0 ? 22 : 18;
                            var sbdx = bullets[b].x - seg.x;
                            var sbdy = bullets[b].y - seg.y;
                            var sbdist = Math.sqrt(sbdx * sbdx + sbdy * sbdy);
                            if(sbdist < segRadius){
                                if(si === 0){
                                    if(snakeBoss.segments.length === 1){
                                        snakeBoss.hp--;
                                        bullets.splice(b, 1);
                                        if(snakeBoss.hp <= 0){
                                            score += 10;
                                            snakeBoss = null;
                                            tripleShot = true;
                                            bossAlert = 3;
                                            alertMessage = "BOSS ABOLISHED";
                                            pendingAlert = "TRIGUN ACQUIRED";
                                        }
                                    } else{
                                        bullets.splice(b, 1);
                                    }
                                } else{
                                    snakeBoss.segments.splice(si, 1);
                                    bullets.splice(b, 1);
                                    score++;
                                }
                                break;
                            }

                        }
                    } //player destroys boss bullets
            if(b >= 0 && b < bullets.length){
                for(var ep = enemyBullets.length - 1; ep >= 0; ep--){
                    var epdx = bullets[b].x - enemyBullets[ep].x;
                    var epdy = bullets[b].y - enemyBullets[ep].y;
                    var epdist = Math.sqrt(epdx * epdx + epdy * epdy);
                    if(epdist < 10 + enemyBullets[ep].radius){
                        enemyBullets.splice (ep, 1);
                        break;
                    }
                }
            }
                }
            }
           
            // ENEMY BULLETS
            for(var eb = enemyBullets.length - 1; eb >= 0; eb--){
                enemyBullets[eb].x += enemyBullets[eb].velocityX * (delta * 60);
                enemyBullets[eb].y += enemyBullets[eb].velocityY * (delta * 60);
                ctx.beginPath();
                ctx.fillStyle = enemyBullets[eb].bouncing ? "#ff8800" : "#ff4444";
                ctx.arc(enemyBullets[eb].x, enemyBullets[eb].y, enemyBullets[eb].radius, 0, 2 * Math.PI);
                ctx.fill();
                if(enemyBullets[eb].bouncing){
                    var br = enemyBullets[eb].radius;
                    enemyBullets[eb].lifetime -= delta;
                    if(enemyBullets[eb].lifetime <= 0){
                        enemyBullets.splice(eb, 1);
                    } else {
                if(enemyBullets[eb].x - br < 0 || enemyBullets[eb].x + br > canvas.width)
                 enemyBullets[eb].velocityX *= -1;
                if(enemyBullets[eb].y - br < 0 || enemyBullets[eb].y + br > canvas.height)
                    enemyBullets[eb].velocityY *= -1;
                    }
                } else {
                    if(enemyBullets[eb].x < 0 || enemyBullets[eb].x > canvas.width||
                        enemyBullets[eb].y < 0 || enemyBullets[eb].y > canvas.height){
                            enemyBullets.splice(eb, 1);
                        }
                }

                }
                //Boss Update
                if(snakeBoss){
                    updateBoss(delta);
                    drawBoss();
                }
                break;
            }
        }