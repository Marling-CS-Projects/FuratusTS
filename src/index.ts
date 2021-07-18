//import { updateBullets, fire } from './Bullets'
import { Avatar } from './Avatar'
import * as PIXI from 'pixi.js'
import { Engine, Body, World, Bodies } from 'matter-js';
import { Wall, Platform} from './Walls'
import { platforms1 } from './levels/lvl1'
import { Bullet, bullets, fire} from './bullets'
import * as Matter from 'matter-js';

export const engine = Engine.create();
const loader = PIXI.Loader

//draws a new stage
export let canvas = new PIXI.Application (
    {
        width: 1450,
        height: 600,
        backgroundColor: 0x808080 //grey
    }
);

//creates an avatar for the player that has both matter and pixi properties and health.
export let avatar = new Avatar(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(300,300, 60, 60, {inertia:Infinity, timeScale:2}), 10 );

canvas.renderer.view.style.position = 'absolute';
canvas.renderer.view.style.display = "block";
document.body.appendChild(canvas.view);


//adds player and wall matterData to the world so that they work with physics.
World.add(engine.world, [avatar.matterData]);
for (let i = 0; i < platforms1.length; i++) {
    World.add(engine.world, [platforms1[i].matterData])
}
//adds the pixiData of objects to the stage so it is shown.
canvas.stage.addChild(avatar.pixiData);
for (let i = 0; i < platforms1.length; i++) {
    canvas.stage.addChild(platforms1[i].pixiData)
} 

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

let playerGrounded: boolean = true;//collisions for the player being grounded
function jump() {
Matter.Events.on(engine, "collisionStart", function (event) { //when Matter detects a collison start
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) //filter with avatar as bodyA or bodyB
        .forEach(pair => {
            let possibleGrounding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; //checks if the avatar is bodyA or B
            for (let i = 0; i < platforms1.length; i++) {
                if (possibleGrounding == platforms1[i].matterData ) { //if they are colliding, then the player is on the ground.
                    playerGrounded = true;
                }
            }
        })
})
//checks in the same way as the statement 
Matter.Events.on(engine, "collisionEnd", function (event) { 
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) 
        .forEach(pair => {
            let possibleGrounding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; 
            for (let i = 0; i < platforms1.length; i++) {
                if (possibleGrounding == platforms1[i].matterData ) {
                    playerGrounded = false;
                }
            }    
        })
})
    if  (playerGrounded === true) {
        Body.setVelocity(avatar.matterData, {x:avatar.matterData.velocity.x, y: -12})
    }
}


let lastBulletTime:number = null;
function gameLoop(delta:number) {
    canvas.stage.position.x = -avatar.matterData.position.x + canvas.view.width / 2; //centres the camera on the avatar.
    //Z makes the player 'jump' by giving the avatar an upwards velocity.
    if (keys["90"]) {
        jump();
    }
    //C         
    if (keys["88"]) {
        let now = Date.now(); //number of milliseconds since 1/1/1970

        if ((now - lastBulletTime) > 300) { //lastBulletTime is initially 0, so this will always fire straight away
            fire(false);
            lastBulletTime = now; //updates the last time a bullet was fired.
        }
    }
    //X
    if (keys["67"]) {
        let now = Date.now();

        if ((now - lastBulletTime) > 300) {
            fire(true);
            lastBulletTime = now;
        }
    }

    //Left arrow
    if (keys["37"]) {
        Body.setVelocity(avatar.matterData, {x:-5, y:avatar.matterData.velocity.y})
    }
    //Right arrow
    if (keys["39"]) {
        Body.setVelocity(avatar.matterData, {x:5, y:avatar.matterData.velocity.y})
    }

    
    avatar.update(delta)
    bullets.forEach((bullet: Bullet) => bullet.update(delta))
    for (let i = 0; i < platforms1.length; i++) {
        platforms1[i].update(delta)
    }
    Engine.update(engine, delta*10)
}

