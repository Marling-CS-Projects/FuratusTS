import { GameObject } from './GameObject';
import {Body, World, Bodies, Render} from 'matter-js';import * as PIXI from 'pixi.js'
import { avatar,canvas, engine } from './index'

let bullets: any = []; //create an empty array to store bullets in

class Bullet extends GameObject { //creates a bullet class 
    speed: number;
    constructor (pixiData:any, matterData:any, speed:number) {
        super(pixiData, matterData)
        this.speed = speed;
    }
}

export function fire(left: boolean) {
    console.log("Fire!"); //for checking that the bullets are actually firing. will remove when project is finished.
    let bullet = createBullet(left); //calls createBullet function.
    bullets.push(bullet); // adds bullets that have been fired to an array of bullets
}

function createBullet(left:boolean) { // is responsible for creating the bullets
    let bullet = new Bullet(PIXI.Sprite.from("assets/bullet.png"), Bodies.rectangle(avatar.matterData.position.x, avatar.matterData.position.y , 30, 20, {isStatic:true}), 10)
    if(left) { // by using a parameter, the program decides whether or not the bullet is travelling left.
        bullet.speed = -bullet.speed;
    }
    World.add(engine.world,[bullet.matterData])
    canvas.stage.addChild(bullet.pixiData); //renders bullet but only pixiData can be rendered by pixi

    return bullet;
}
export function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        Body.setVelocity(bullets[i].matterData, {x:-bullets[i].speed, y:0});; //bullets move to the right when x is pressed
        if (bullets[i].matterData.position.x > 800 || bullets[i].matterData.position.x < 0) { //if bullets have moved too far, then they are dead.
            bullets[i].dead = true;
        }
        if (bullets[i].dead) { //removes bullets that are out of screen.
            World.remove(engine.world, [bullets[i].matterData]);
            canvas.stage.removeChild(bullets[i].pixiData);
            bullets.splice(i, 1); //removes dead bullets from array

        }
    }
}