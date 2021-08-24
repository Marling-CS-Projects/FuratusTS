//import { updateBullets, fire } from './Bullets'
import { Avatar, power } from './Entity'
import * as PIXI from 'pixi.js'
import { cannons1, lvl1map, platforms1, spikes1, enemies1, prEnemies1, powerups1} from './levels/lvl1'
import { Bullet, fire } from './Bullet'
import { Powerup } from './Powerups'
import { Engine, Body, World, Bodies } from 'matter-js';
import * as Matter from 'matter-js';
import { GameObject } from './GameObject';

export var powerActive:boolean = false; //for powerups


export const engine = Engine.create();
const loader = PIXI.Loader

//draws a new stage
export let canvas = new PIXI.Application(
    {
        width: 1425,
        height: 600,
        backgroundColor: 0x808080 //grey
    }
);

export let bullets: Bullet[] = []; //create an empty array to store bullets in

//creates an avatar for the player that has both matter and pixi properties and health.
export let avatar = new Avatar(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(300, 300, 60, 60, { inertia: Infinity, timeScale: 2 }), 5, false, true, 300, 300, 1,"none");


//creates the alternative pixiData for a dead avatar outside of the player's view
export let deadmsg = PIXI.Sprite.from("assets/youdied.png")
deadmsg.x = 0
deadmsg.y = 1395

canvas.renderer.view.style.position = 'absolute';
canvas.renderer.view.style.display = "block";
document.body.appendChild(canvas.view);


//adds player and level matterData to the engine so that they work with physics.
World.add(engine.world, [avatar.matterData]);
for (let i = 0; i < lvl1map.length; i++) { //adds every platform to the engine
    World.add(engine.world, [lvl1map[i].matterData])
}
//adds the pixiData of objects to the stage so they are shown.
canvas.stage.addChild(avatar.pixiData, deadmsg);
for (let i = 0; i < lvl1map.length; i++) { //adds every platform to the stage
    canvas.stage.addChild(lvl1map[i].pixiData)
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

//collision detection for avatar. use similar method to bullets to compact these into one or statement later.
Matter.Events.on(engine, "collisionStart", function (event) { //when Matter detects a collison start
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) //filter with avatar as bodyA or bodyB
        .forEach(pair => {
            let collidingWith = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; //checks if the avatar is bodyA or B
            //for ground collisions
            for (let i = 0; i < platforms1.length; i++) {
                if (collidingWith == platforms1[i].matterData) { //if they are colliding, then the player is on the ground.
                    avatar.grounded = true;
                }
            }
            //for cannon collisions
            for (let i = 0; i < cannons1.length; i++) {
                if (collidingWith == cannons1[i].matterData) {
                    if ((cannons1[i].matterData.position.x - 25 < avatar.matterData.position.x) || (avatar.matterData.position.x < cannons1[i].matterData.position.x + 25)) {
                        avatar.grounded = true;
                    }
                }
            }
            //for spike collisions
            for (let i = 0; i < spikes1.length; i++) {
                if (collidingWith == spikes1[i].matterData) {
                    avatar.health = 0;
                }
            }
            //for enemy collisions
            for (let i = 0; i < enemies1.length; i++) { //only kills enemy if avatar jumps from above
                if (collidingWith == enemies1[i].matterData) {
                    if (avatar.matterData.position.y < enemies1[i].matterData.position.y) {
                        avatar.grounded = true;
                        enemies1[i].health = 0;
                    } else {
                        avatar.grounded = true;
                        avatar.health -= 1;
                        console.log(avatar.health)
                    }
                }
            }
            //for powerup collisions
            for (let i =  0; i < powerups1.length; i++) {
                if (collidingWith == powerups1[i].matterData) {
                    console.log("colliding")
                    avatar.applyPower(powerups1[i].power)
                    Body.setPosition(powerups1[i].matterData, {x: 3000, y: 800})
                }
            }
        })
})

//collision detection for bullets
Matter.Events.on(engine, "collisionStart", function (event) {
    for (let i = 0; i < bullets.length; i++) {
        event.pairs
            .filter(pair => pair.bodyA == bullets[i].matterData || pair.bodyB == bullets[i].matterData)
            .forEach(pair => {
                let beingShot = pair.bodyA == bullets[i].matterData ? pair.bodyB : pair.bodyA;
                for (let j = 0; j < gameObjectManager.length; j++) {
                    const beingShotGameObject = gameObjectManager[j]; //fixes body issue with beingShot
                    if (beingShot == beingShotGameObject.matterData) {
                        bullets[i].hit(beingShotGameObject) //see hit method in bullets
                    }
                }
            })
    }
})

//collision end detection for avatar
Matter.Events.on(engine, "collisionEnd", function (event) {
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData)
        .forEach(pair => {
            let possibleGrounding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA;
            for (let i = 0; i < platforms1.length; i++) {
                if (possibleGrounding == platforms1[i].matterData) {
                    avatar.grounded = false; //when the collision ends, the player is no longer grounded
                }
            }
            for (let i = 0; i < enemies1.length; i++) {
                if (possibleGrounding == enemies1[i].matterData) {
                    if (avatar.matterData.position.y < enemies1[i].matterData.position.y) {
                        avatar.grounded = false;
                    }
                }
            }
            for (let i = 0; i < cannons1.length; i++) {
                if (possibleGrounding == cannons1[i].matterData) {
                    if ((cannons1[i].matterData.position.x - 30 < avatar.matterData.position.x) || (avatar.matterData.position.x < cannons1[i].matterData.position.x + 30)) {
                        avatar.grounded = false;
                    }
                }
            }
        })
})

let lastBulletTime: number = 0;
function updateElapsed() {
    elapsed = Date.now() - lastBulletTime;
}
let elapsed: number = (Date.now() - lastBulletTime);




function gameLoop(delta: number) {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].dead) { //removes bullets that are out of screen.
            World.remove(engine.world, bullets[i].matterData)
            canvas.stage.removeChild(bullets[i].pixiData);
            bullets.splice(i, 1); //removes dead bullets from array
        }
    }
    canvas.stage.position.x = -avatar.matterData.position.x + canvas.view.width / 2; //centres the camera on the avatar.
    //Z makes the player 'jump' by giving the avatar an upwards velocity.
    if (keys["90"] && avatar.dead === false && avatar.grounded === true) {
        Body.setVelocity(avatar.matterData, { x: avatar.matterData.velocity.x, y: -12 })
    }
    //C         
    if (keys["88"] && avatar.dead === false) {

        if ((elapsed) > 300) { //lastBulletTime is initially 0, so this will always fire straight away
            fire(false, true, avatar.matterData.position.x, avatar.matterData.position.y);
            lastBulletTime = Date.now();  //updates the last time a bullet was fired;
        }
    }
    //X
    if (keys["67"] && avatar.dead === false) {

        if ((elapsed) > 300) {
            fire(true, true, avatar.matterData.position.x, avatar.matterData.position.y);
            lastBulletTime = Date.now();
        }
    }

    //R allows the player to reset the avatar in case of death
    if (keys["82"]) {
        avatar.reset()
        for (let i = 0; i < enemies1.length; i++){
            enemies1[i].reset()
        }
        for (let i = 0; i < powerups1.length; i++) {
            powerups1[i].reset()
        }
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
    for (let i = 0; i < lvl1map.length; i++) {
        lvl1map[i].update(delta)
    }

    updateElapsed();
    Engine.update(engine, delta * 10)
}

//array of all gameObjects. stored seperately to stop circular dependency error.
export let gameObjectManager: GameObject[] = [];
gameObjectManager.push(avatar, ...lvl1map,)

//fires cannons every 3 seconds
for (let i = 0; i < cannons1.length; i++) {
    setInterval(cannons1[i].emit, 3000)
}

//projectile enemies fire if avatar is in proximity to them
for (let i = 0; i < prEnemies1.length; i++) {
    setInterval(prEnemies1[i].emit, 1000)
}
    
/*let testtext = new PIXI.Text('test')
canvas.stage.addChild(testtext)
testtext.position.x = 950
testtext.position.y = 340 */