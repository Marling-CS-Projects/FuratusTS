import { updateBullets } from './Bullets'
import { update } from 'lodash';
import { Avatar } from './Avatar'
import * as PIXI from 'pixi.js'
import { Application, Loader, LoaderResource, PlaneGeometry, Rectangle, Sprite, Texture } from 'pixi.js'
import {Engine, Body, World, Bodies, Render} from 'matter-js';
import { fire } from './Bullets';
import { Wall } from './Walls'

const engine = Engine.create();
const loader = PIXI.Loader

//draws a new stage
export let canvas = new Application (
    {
        width: 800,
        height: 600,
        backgroundColor: 0x808080 //grey
    }
);

// Add the canvas to the document
canvas.renderer.view.style.position = 'absolute';
canvas.renderer.view.style.display = "block";
document.body.appendChild(canvas.view);

//creates an avatar for the player that has both matter and pixi properties and health.
export let avatar = new Avatar(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(770,30, 60, 60), 10 )
let bottomWall = new Wall(PIXI.Sprite.from("assets/wallhor.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));

World.add(engine.world, [avatar.matterData, bottomWall.matterData]) //adds player and wall matterData to the world so that they work with physics.
canvas.stage.addChild(avatar.pixiData, bottomWall.pixiData) //adds the pixiData of objects to the stage so it is shown.

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


let lastBulletTime:number = null;
function gameLoop(delta:number) {
    updateBullets();
    //Z makes the player go up the screen by giving the avatar an upwards velocity.
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
        Body.setVelocity(avatar.matterData, {x:-5, y:0})
    }
    //Right arrow
    if (keys["39"]) {
        Body.setVelocity(avatar.matterData, {x:5, y:0})
    }

    avatar.update(delta)
    Engine.update(engine, delta*10)
}