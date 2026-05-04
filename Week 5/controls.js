var keydown = document.addEventListener("keydown", keyDown);
var keyup = document.addEventListener("keyup", keyUp);
var click = document.addEventListener("click", function(){
    console.log("mouse click")
});
//general movement
var w = false;
var a = false;
var s = false;
var d = false;
//to shoot
var LMB = false;
//powerups
var space = false;

var up = false;
var down = false;
var left = false;
var right = false;
var LMB = false; 
var space = false; 

function keyDown(e){
    console.log("Pressed" + e.key)
    console.log("Pressed" + e.keyCode)
}
function keyUp(e){
    console.log("Pressed" + e.key)
    console.log("Pressed" + e.keyCode)
}
