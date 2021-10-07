//import { updateBullets, fire } from './Bullets'
import { Avatar, power, Boss, Laser } from './Entity'
import * as PIXI from 'pixi.js'
import { Level,} from './levels/Level'
import { Bullet, fire } from './Bullet'
import { Engine, Body, World } from 'matter-js';
import * as Matter from 'matter-js';
import { GameObject } from './GameObject';
import { createMenu, createStartMenu, menuContainer,levelEndContainer } from './menus';
import "./style.css"
//creates variables to be used in the rest of the game
export const engine = Engine.create();
export let bullets: Bullet[] = [];
export let avatar = new Avatar()//creates an avatar for the player
export const boss = new Boss()
export const deadmsg = PIXI.Sprite.from("assets/youdied.png")
export let gameObjectManager: GameObject[] = [];//array of all gameObjects. stored seperately to stop circular dependency error.
let intervals:any[] = [] //so that all intervals can be cleared on a level end.

deadmsg.x = 0
deadmsg.y = 1395
export let selectedLevel: Level;//for switching between levels
let gameStarted: boolean;

//draws a new stage
export let canvas = new PIXI.Application(
    {
        width: 1425,
        height: 600,
        backgroundColor: 0x808080 //grey
    }
);
createMenu(menuContainer)
createStartMenu()

canvas.renderer.view.style.position = 'absolute';
canvas.renderer.view.style.display = "block";

export function loadMap(map: Level) { //called by menus to start the game when button is pressed
    avatar.health = 5
    removeMap()
    document.body.appendChild(canvas.view);
    selectedLevel = map;
    gameStarted = true;
    //adds player and level matterData to the engine so that they work with physics.
    World.add(engine.world, [avatar.matterData]);
    for (let i = 0; i < map.map.length; i++) {
        World.add(engine.world, [map.map[i].matterData])
    }
    //adds the pixiData of objects to the stage so they are shown.
    canvas.stage.addChild(avatar.pixiData, deadmsg);
    for (let i = 0; i < map.map.length; i++) {
        canvas.stage.addChild(map.map[i].pixiData)
    }

    if (map.levelIndex === 3){ //only adds boss to boss lvl
        World.add(engine.world, [boss.matterData]);
        canvas.stage.addChild(boss.pixiData)

        intervals.push(setInterval(boss.atk, 10000))
    }

    //sets avatar's position to the start of the level 
    avatar.spawnX = selectedLevel.avSpawnX;
    avatar.spawnY = selectedLevel.avSpawnY;
    Body.setVelocity(avatar.matterData, {x: 0, y: 0})
    Body.setPosition(avatar.matterData, { x: avatar.spawnX, y: avatar.spawnY})
    
    // avatar.matterData.velocity.x = avatar.matterData.velocity.y = 0
    gameObjectManager = [avatar, boss, ...selectedLevel.map] //clears gameObjectManager and adds new level

    //fires cannons every 3 seconds
    for (let i = 0; i < selectedLevel.cannons.length; i++) {
        intervals.push(setInterval(selectedLevel.cannons[i].emit, 1500))
    }

    //projectile enemies fire if avatar is in proximity to them
    for (let i = 0; i < selectedLevel.projectileEnemies.length; i++) {
        intervals.push(setInterval(selectedLevel.projectileEnemies[i].emit, 1000))
    }
}

export function removeMap(){
    gameStarted = false;
    World.clear(engine.world, false)
    canvas.stage.removeChildren(0) //removes all children from stage from  child index 0
    intervals.forEach(clearInterval)
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

//for regulating bullet fire
let lastBulletTime: number = 0;
function updateElapsed() {
    elapsed = Date.now() - lastBulletTime;
}
let elapsed: number = (Date.now() - lastBulletTime);

//collision detection for avatar. use similar method to bullets to compact these into one or statement later.
Matter.Events.on(engine, "collisionStart", function (event) { //when Matter detects a collison start
    event.pairs
        .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) //filter with avatar as bodyA or bodyB
        .forEach(pair => {
            let collidingWith = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; //checks if the avatar is bodyA or B
            //for ground collisions
            for (let i = 0; i < selectedLevel.platforms.length; i++) {
                if (collidingWith == selectedLevel.platforms[i].matterData) { //if they are colliding, then the player is on the ground.
                    avatar.grounded = true;
                }
            }
            //for cannon collisions
            for (let i = 0; i < selectedLevel.cannons.length; i++) {
                if (collidingWith == selectedLevel.cannons[i].matterData) {
                    if ((selectedLevel.cannons[i].matterData.position.x - 25 < avatar.matterData.position.x) || (avatar.matterData.position.x < selectedLevel.cannons[i].matterData.position.x + 25)) {
                        avatar.grounded = true;
                    }
                }
            }
            //for spike collisions
            for (let i = 0; i < selectedLevel.spikes.length; i++) {
                if (collidingWith == selectedLevel.spikes[i].matterData) {
                    avatar.grounded = true;
                    if (avatar.power == "invincible") {
                        avatar.removePower()
                    } else {
                        avatar.health = 0;
                    }
                }
            }
            //for enemy collisions
            for (let i = 0; i < selectedLevel.enemies.length; i++) { //only kills enemy if avatar jumps from above
                if (collidingWith == selectedLevel.enemies[i].matterData) {
                    avatar.grounded = true
                    if (avatar.matterData.position.y + 10 < selectedLevel.enemies[i].matterData.position.y) {
                        selectedLevel.enemies[i].health = 0;
                    } else {
                        if (avatar.power == "invincible") {
                            avatar.removePower()
                        } else if (avatar.power !== ("shield" || "invincible")) {
                            avatar.health -= 1;
                            console.log(avatar.health)
                        }
                    }
                }
            }
            if (selectedLevel.levelIndex == 3) {
                if (collidingWith == boss.matterData){
                    avatar.health -= 4
                }
            }
            //for powerup collisions
            for (let i = 0; i < selectedLevel.powerups.length; i++) {
                if (collidingWith == selectedLevel.powerups[i].matterData) {
                    let power: power = selectedLevel.powerups[i].power
                    avatar.applyPower(power)
                    Body.setPosition(selectedLevel.powerups[i].matterData, { x: 3000, y: 800 }) //moves the powerup out of view
                }
            }

            if (collidingWith == selectedLevel.levelEnd.matterData){
                document.body.removeChild(canvas.view);
                createMenu(levelEndContainer)
                selectedLevel.levelEnd.levelEndMenu()
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
            for (let i = 0; i < selectedLevel.platforms.length; i++) {
                if (possibleGrounding == selectedLevel.platforms[i].matterData) {
                    avatar.grounded = false; //when the collision ends, the player is no longer grounded
                }
            }
            for (let i = 0; i < selectedLevel.enemies.length; i++) {
                if (possibleGrounding == selectedLevel.enemies[i].matterData) {
                    if (avatar.matterData.position.y < selectedLevel.enemies[i].matterData.position.y) {
                        avatar.grounded = false;
                    }
                }
            }
            for (let i = 0; i < selectedLevel.cannons.length; i++) {
                if (possibleGrounding == selectedLevel.cannons[i].matterData) {
                    if ((selectedLevel.cannons[i].matterData.position.x - 30 < avatar.matterData.position.x) || (avatar.matterData.position.x < selectedLevel.cannons[i].matterData.position.x + 30)) {
                        avatar.grounded = false;
                    }
                }
            }
            for (let i = 0; i < selectedLevel.spikes.length; i++) {
                if (possibleGrounding == selectedLevel.spikes[i].matterData) {
                    avatar.grounded = false;
                }
            }
        })
})


function gameLoop(delta: number) {
    if (gameStarted == true) {
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
            boss.reset()
            for (let i = 0; i < selectedLevel.enemies.length; i++) {
                selectedLevel.enemies[i].reset()
            }
            for (let i = 0; i < selectedLevel.projectileEnemies.length; i++) {
                selectedLevel.projectileEnemies[i].reset()
            }
            for (let i = 0; i < selectedLevel.powerups.length; i++) {
                selectedLevel.powerups[i].reset()
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
        for (let i = 0; i < selectedLevel.map.length; i++) {
            selectedLevel.map[i].update(delta)
        }
        gameObjectManager.filter(gameObject => gameObject instanceof Laser).forEach(laser => laser.update(delta)); //updates all lasers
        boss.update(delta)
        updateElapsed();
        Engine.update(engine, delta * 10)
        // for testing console.log(avatar.power)
    }
}

/*tlet testtext = new PIXI.Text('test')
canvas.stage.addChild(testtext)
testtext.position.x = 950
testtext.position.y = 340 */