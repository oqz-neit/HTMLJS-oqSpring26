var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var interval = 1000 / 60;
setInterval(game, interval);

var acceleration = 0.6;//how fast we speed up 
var friction = 0.88;//how fast we speed upor slow down. between 0.0 and 1.0
var maxspeed = 10;
var numberOfShips;
var score = 0;
//comment reference to ship sprite 
var ship = document.getElementById("ship");

//gamestates for menus and game 
var states = ("game", "win")
states = "game";

function createGameObject() {
    var gameObject = {
        x: randomNumber(115, canvas.width - 115),
        y: randomNumber(15, canvas.height - 15),
        moveX: setRandomDirection(),
        moveY: setRandomDirection(),
        velocityX: 0,
        velocityY: 0,
        color: `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)})`,
        radius: 15,
        width: 15,
        height: 15,
        sprite: "ship",
        drawBall: function () {
            //draw the object;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        },
        drawSquare: function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        drawSprite: function () {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }

    }
    return gameObject;


}

function randomNumber(low, high) {
    return Math.random() * (high - low) + low;
}

function setRandomDirection() {
    var dir = Math.random();
    if (dir > 0.5) {
        return 2;
    } else {
        return -2;
    }
}
//This creates a single instance of the ball 
var myBall = createGameObject();
var player = createGameObject();
player.x = canvas.width / 2;
player.y = canvas.height / 2;
player.width = 30;
player.height = 30;
player.color = "purple"
player.sprite = ship;
//this creates a 
var myBalls = [];
var numeberofDots = 10;

for (var i = 0; i < numeberofDots; i++) {
    myBalls[i] = createGameObject();
    myBalls[i].moveY = 0;
    myBalls[i].y = myBalls[i].y
}

//setup our bullets
var bullets = [];
var canShoot = true;

function shoot() {
    var bullet = createGameObject();
    bullet.x = player.x + player.width / 2 - 4;
    bullet.y = player.y;
    bullet.width = 8;
    bullet.height = 10;
    bullet.color = "green";
    bullet.velocityY = -10;
    //take the bullet and add to the bullet array
    bullets.push(bullet);
    canShoot = false;
    //cooldown
    setTimeout(function () { canShoot = true }, 500);
}

function drawHUD() {
    ctx.fillStyle = "black";
    ctx.font = "14px, Arial";
    ctx.fillText(`Ships Defeated ${score} | Ships Left ${numberOfShips}`, 25, 25);
}

function game() {
    //clear the game screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (states) {
        case "game":
            //all of the game code will go here

            numberOfShips = myBalls.length;
            if(numberOfShips <= 0){
                states = "win";
            }



            //Move the Player
            if (w == true || up == true) {
                //player.y -= 2;
                player.velocityY -= acceleration
            }
            if (s == true || down == true) {
                //player.y += 2;
                player.velocityY += acceleration
            }
            if (a == true || left == true) {
                //player.x -= 2;
                player.velocityX -= acceleration
            }
            if (d == true || right == true) {
                //player.x += 2;
                player.velocityX += acceleration
            }
            if (space == true && canShoot) {
                shoot();

            }
            //To bring velocity back to zero we apply friction
            player.velocityY *= friction;
            player.velocityX *= friction;

            //Update the player position
            player.x += player.velocityX;
            player.y += player.velocityY;

            //myBall.drawBall();
            //player.drawSquare();

            //player draw sprite
            player.drawSprite();

            for (var i = 0; i < myBalls.length; i++) {
                myBalls[i].drawBall();
                //Rightside of canvas
                if (myBalls[i].x > canvas.width - myBalls[i].radius - 100) {
                    myBalls[i].moveX *= -1;
                    myBalls[i].color = `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;
                    myBalls[i].y += myBalls[i].radius
                }
                //bottom of canvas
                if (myBalls[i].y > canvas.height + myBalls[i].radius) {
                    // myBalls[i].moveY *= -1;
                    // myBalls[i].color = `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0 ,255)})`;
                    myBalls[i].y = -randomNumber(0, canvas.height);
                }
                //left side of canvas
                if (myBalls[i].x < myBalls[i].radius + 100) {
                    myBalls[i].moveX *= -1;
                    myBalls[i].color = `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;
                    myBalls[i].y += myBalls[i].radius * 3
                }
                //topside of canvas
                // if(myBalls[i].y < myBalls[i].radius){
                //     myBalls[i].moveY *= -1;
                //     myBalls[i].color = `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0 ,255)})`;
                // }
                //myBalls[i].color = `rgb(${randomNumber(0,225})


                myBalls[i].x += myBalls[i].moveX;
                myBalls[i].y += myBalls[i].moveY;


            }

            //Collision between the bullets and the balls
            for (var b = bullets.length - 1; b >= 0; b--) {
                console.log(bullets.length)
                bullets[b].x += bullets[b].velocityX;
                bullets[b].y += bullets[b].velocityY;

                if (bullets[b] + bullets[b].height < 0) {
                    bullets.splice(b, 1); //removes bullet off screen

                }
                for (var e = 0; e < myBalls.length; e++) {
                    //DISTANCE FORMULA
                    var distX = bullets[b].x - myBalls[e].x;
                    var distY = bullets[b].y - myBalls[e].y;
                    var dist = Math.sqrt((distX * distX) + (distY * distY))

                    if (dist < myBalls[e].radius) {
                        //Remove Ball from the screen
                        score++;
                        myBalls.splice(e, 1);
                        bullets.splice(b, 1);
                        break;


                    }


                }

                //draw bullet to the screen
                bullets[b].drawSquare();

            }
            drawHUD();
            break;
        case "win":
            ctx.fillStyle = "black";
            ctx.font = "24px Arial"
            var text = "You Won!"
            ctx.fillText("You Won", canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2 - 20)
            break;
    }
}
