var keydown = document.addEventListener("keydown", keyDown)
var keyup = document.addEventListener("keyup", keyUp)

var w = false;
var a = false;
var s = false;
var d = false;

var up = false;
var down = false; 
var left = false;
var right = false;
var space = false;

function keyDown(e){
    console.log("Pressed" + e.key)
    console.log("Pressed" + e.keyCode)
    if(e.key == "w"){
        w = true;
    }
    if(e.key == "a"){
        a = true;
    }
    if(e.key == "s"){
        s = true; 
    }
    if(e.key == "d"){
        d = true;
    }
    if(e.keyCode == 32){
        space = true;
    }       


}
function keyUp(e){
    console.log("Released" + e.key)
     if(e.key == "w"){
        w = false;
    }
    if(e.key == "a"){
        a = false;
    }
    if(e.key == "s"){
        s = false; 
    }
    if(e.key == "d"){
        d = false;

    }
     if(e.keyCode == 32){
        space = false;
    }       

}