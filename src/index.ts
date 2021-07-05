//import { updateBullets, fire } from './Bullets'
import { update } from 'lodash';
import {GameObject} from './GameObject'
import { Avatar } from './Avatar'
import * as PIXI from 'pixi.js'
import { Application, Loader, LoaderResource, PlaneGeometry, Rectangle, Sprite, Texture } from 'pixi.js'
import {Engine, Body, World, Bodies, Render} from 'matter-js';
import { Wall } from './Walls'

export const engine = Engine.create();
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
export let avatar = new Avatar(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(770,30, 60, 60, {inertia:Infinity}), 10 );
let bottomWall = new Wall(PIXI.Sprite.from("assets/wallhor.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true,}));

//adds player and wall matterData to the world so that they work with physics.
World.add(engine.world, [avatar.matterData, bottomWall.matterData]) 
//adds the pixiData of objects to the stage so it is shown.
canvas.stage.addChild(avatar.pixiData, bottomWall.pixiData) 

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

let bullets: any = []; //create an empty array to store bullets in

class Bullet extends GameObject { //creates a bullet class 
    speed: number;
    constructor (pixiData:any, matterData:any, speed:number) {
        super(pixiData, matterData)
        this.speed = speed;
    }
    update(delta:number) {
        this.pixiData.position.x = this.matterData.position.x; 
        this.pixiData.position.y = this.matterData.position.y; 
        this.pixiData.rotation = this.matterData.angle;
        for (let i = 0; i < bullets.length; i++) {
            Body.setVelocity(bullets[i].matterData, {x:-bullets[i].speed, y:0});; //bullets move to the right when x is pressed
            if (bullets[i].matterData.position.x > 800 || bullets[i].matterData.position.x < 0) { //if bullets have moved too far, then they are dead.
                bullets[i].dead = true;
            }
            if (bullets[i].dead) { //removes bullets that are out of screen.
                canvas.stage.removeChild(bullets[i].pixiData);
                bullets.splice(i, 1); //removes dead bullets from array
    
            }
        }
    }

}

function fire(left: boolean) {
    console.log("Fire!"); //for checking that the bullets are actually firing. will remove when project is finished.
    let bullet = createBullet(left); //calls createBullet function.
    bullets.push(bullet); // adds bullets that have been fired to an array of bullets
}

function createBullet(left:boolean) { // is responsible for creating the bullets
    let bullet = new Bullet(PIXI.Sprite.from("assets/bullet.png"), Bodies.rectangle(avatar.pixiData.position.x, avatar.pixiData.position.y , 30, 20, {isStatic:true}), 10)
    if(left) { // by using a parameter, the program decides whether or not the bullet is travelling left.
        bullet.speed = -bullet.speed;
    }
    World.add(engine.world,[bullet.matterData]);
    canvas.stage.addChild(bullet.pixiData); 

    return bullet;
}

let lastBulletTime:number = null;
function gameLoop(delta:number) {
    //Z makes the player go up the screen by giving the avatar an upwards velocity.
    if (keys["90"]) {
        let now = Date.now();

        if ((now - lastBulletTime) > 300) {
            Body.setVelocity(avatar.matterData, {x:0, y:-5})
            lastBulletTime = now;
        }
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
    Bullet.update(delta)
    bottomWall.update(delta)
    Engine.update(engine, delta*10)
}