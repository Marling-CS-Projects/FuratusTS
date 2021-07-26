//import { updateBullets, fire } from './Bullets'
import { Entity, Avatar } from './Entity'
import * as PIXI from 'pixi.js'
import { Wall, Platform } from './Walls'
import { platforms1, spikes1 } from './levels/lvl1'
import { Bullet, bullets, fire } from './Bullet'
import { Engine, Body, World, Bodies } from 'matter-js';
import * as Matter from 'matter-js';
import { GameObject } from './GameObject'

export const engine = Engine.create();
const loader = PIXI.Loader

//draws a new stage
export let canvas = new PIXI.Application(
    {
        width: 1425,
        height: 600,
        backgroundColor: 0x000000 //blue
    }
);

//creates an avatar for the player that has both matter and pixi properties and health.
export let avatar = new Avatar(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(300, 300, 60, 60, { inertia: Infinity, timeScale: 2 }), 10, false);
//creates the alternative pixiData for a dead avatar outside of the player's view
export let avdead = PIXI.Sprite.from("assets/avdead.png");
export let deadmsg = PIXI.Sprite.from("assets/youdied.png")
avdead.anchor.set(0.5)
avdead.x = 0
deadmsg.x = 0
avdead.y = 1395
deadmsg.y = 1395

canvas.renderer.view.style.position = 'absolute';
canvas.renderer.view.style.display = "block";
document.body.appendChild(canvas.view);


//adds player and level matterData to the engine so that they work with physics.
World.add(engine.world, [avatar.matterData,]);
for (let i = 0; i < platforms1.length; i++) { //adds every platform to the engine
    World.add(engine.world, [platforms1[i].matterData])
}
for (let i = 0; i < spikes1.length; i++) {
    World.add(engine.world, [spikes1[i].matterData])
}
//adds the pixiData of objects to the stage so they are shown.
canvas.stage.addChild(avatar.pixiData, avdead, deadmsg);
for (let i = 0; i < platforms1.length; i++) { //adds every platform to the stage
    canvas.stage.addChild(platforms1[i].pixiData)
}
for (let i = 0; i < spikes1.length; i++) {
    canvas.stage.addChild(spikes1[i].pixiData)
}

//keyboard event handlers
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

//game updates every tick
canvas.ticker.add(gameLoop);

//detects when key is pressed
let keys: any = {}
function keysDown(e: any) {
    keys[e.keyCode] = true;
}
//detects when a key stops being pressed
function keysUp(e: any) {
    keys[e.keyCode] = false;
}

//collision detection
let avatarGrounded: boolean = true;
Matter.Events.on(engine, "collisionStart", function (event) { //when Matter detects a collison start
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) //filter with avatar as bodyA or bodyB
        .forEach(pair => {
            let collidingWith = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; //checks if the avatar is bodyA or B
            //for ground collisions
            for (let i = 0; i < platforms1.length; i++) {
                if (collidingWith == platforms1[i].matterData) { //if they are colliding, then the player is on the ground.
                    avatarGrounded = true;
                }
            }
            //for spike collisions
            for (let i = 0; i < spikes1.length; i++) {
                if (collidingWith == spikes1[i].matterData) {
                    avatar.health = 0;
                }
            }
        })
})

Matter.Events.on(engine, "collisionStart", function (event) { //when Matter detects a collison start
    for (let i = 0; i > bullets.length; i++) {
        event.pairs
            .filter(pair => pair.bodyA == bullets[i].matterData || pair.bodyB == bullets[i].matterData) //filter with avatar as bodyA or bodyB
            .forEach(pair => {
                let beingShot = pair.bodyA == bullets[i].matterData ? pair.bodyB : pair.bodyA;
                if (beingShot instanceof Entity) {
                    beingShot.health -= 1;
                    bullets[i].dead = true;
                    console.log("shot")
                } else if (beingShot! instanceof Entity) {
                    bullets[i].dead = true;
                    console.log("shot")
                }

            })
    }
 })

Matter.Events.on(engine, "collisionEnd", function (event) {
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData)
        .forEach(pair => {
            let possibleGrounding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA;
            for (let i = 0; i < platforms1.length; i++) {
                if (possibleGrounding == platforms1[i].matterData) {
                    avatarGrounded = false; //when the collision ends, the player is no longer grounded
                }
            }
        })
})

let lastBulletTime: number = null;
function gameLoop(delta: number) {
    canvas.stage.position.x = -avatar.matterData.position.x + canvas.view.width / 2; //centres the camera on the avatar.
    //Z makes the player 'jump' by giving the avatar an upwards velocity.
    if (keys["90"] && avatar.dead === false && avatarGrounded === true) {
        Body.setVelocity(avatar.matterData, { x: avatar.matterData.velocity.x, y: -12 })
    }
    //C         
    if (keys["88"] && avatar.dead === false) {
        let now = Date.now(); //number of milliseconds since 1/1/1970

        if ((now - lastBulletTime) > 300) { //lastBulletTime is initially 0, so this will always fire straight away
            fire(false);
            lastBulletTime = now; //updates the last time a bullet was fired.
        }
    }
    //X
    if (keys["67"] && avatar.dead === false) {
        let now = Date.now();

        if ((now - lastBulletTime) > 300) {
            fire(true);
            lastBulletTime = now;
        }
    }

    //R allows the player to reset the avatar in case of death
    if (keys["82"]) {
        Body.setPosition(avatar.matterData, { x: 300, y: 300 })
        avatar.dead = false
        avatar.health = 10
        avatarGrounded = true
        avdead.x = 0
        deadmsg.x = 0
        avdead.y = 1200
        deadmsg.y = 1200 //resets death sprites so they can't be seen.
        for (let i = 0; i < bullets.length; i++) { //removes all dead bullets remaining on the stage.
            bullets[i].dead = true;
        }
    }

    //Left arrow
    if (keys["37"] && avatar.dead === false) {
        Body.setVelocity(avatar.matterData, { x: -5, y: avatar.matterData.velocity.y })
    }
    //Right arrow
    if (keys["39"] && avatar.dead === false) {
        Body.setVelocity(avatar.matterData, { x: 5, y: avatar.matterData.velocity.y })
    }

    avatar.update(delta)
    bullets.forEach((bullet: Bullet) => bullet.update(delta))
    for (let i = 0; i < platforms1.length; i++) {
        platforms1[i].update(delta)
    }
    for (let i = 0; i < spikes1.length; i++) {
        spikes1[i].update(delta)
    }
    Engine.update(engine, delta * 10)
}

