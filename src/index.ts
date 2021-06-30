import { updateBullets } from './Bullets'
import { Avatar } from './Avatar'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js';
import { fire } from './Bullets';
import { topWall, leftWall, rightWall, bottomWall } from './lvl1'

//creates constants to be used by matter in the rest of the programme. 
const Engine = Matter.Engine;
const Body= Matter.Body;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const engine = Engine.create();

//creates an avatar for the player that has both matter and pixi properties and health.
export let avatar = new Avatar(PIXI.Sprite.from("assets/protagonist.png"), Bodies.rectangle(27,570, 60, 60), 10 )
World.add(engine.world, [avatar.matterData])

//draws a new stage
export let canvas = new PIXI.Application (
    {
        width: 800,
        height:600,
        backgroundColor: 0x808080
    }
);


//keyboard event handlers
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

//game updates every tick
canvas.ticker.add(gameLoop);

//detects when key is pressed
let keys:any = {} 

function keysDown(e: any) {
    keys[e.keyCode] = true;
}

function keysUp(e: any) {
    keys[e.keyCode] = false;
}

/*
let isJumping = false //prevents double jump 
function jump() {
    if (isJumping) return
    let timerUpID = setInterval(function () { //the setInterval method allows me to create a function that runs every certain interval of time
        if (avatar.y < 450) {
            clearInterval(timerUpID) // stops permanent jumping 
            let timerDownID = setInterval(function () {
                if (avatar.y > 562) {
                    clearInterval(timerDownID) //stops permanent fall
                    isJumping = false
                }
                avatar.y += 4
            }, 20)
        }
        isJumping = true
        avatar.y -= 10 //gradually decreases the height following a jump
    }, 20)
}
*/

let lastBulletTime:number = null;
function gameLoop() {
    updateBullets();
    //Z makes the player go up the screen by increasing the y position by 5 every tick.
    if (keys["90"]) {
        Body.setVelocity(avatar.matterData, {x:0, y:-10})
    }
    //X          
    if (keys["67"]) {
        let now = Date.now(); //number of milliseconds since 1/1/1970

        if ((now - lastBulletTime) > 300) { //lastBulletTime is initially 0, so this will always fire straight away
            fire(false);
            lastBulletTime = now; //updates the last time a bullet was fired.
        }
    }
    //C
    if (keys["88"]) {
        let now = Date.now();

        if ((now - lastBulletTime) > 300) {
            fire(true);
            lastBulletTime = now;
        }
    }

    //Left arrow
    if (keys["37"]) {
        Body.setVelocity(avatar.matterData, {x:-10, y:0})
    }
    //Right arrow
    if (keys["39"]) {
        Body.setVelocity(avatar.matterData, {x:10, y:0})
    }
}