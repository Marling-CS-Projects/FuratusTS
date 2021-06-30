import { GameObject } from './GameObject';
import { Body, Bodies } from 'matter-js';
import * as PIXI from 'pixi.js'
import { avatar } from './index'
import { canvas } from './index'

let bullets: any = []; //create an empty array to store bullets in
let bulletSpeed:number = 10;

class Bullet extends GameObject { //creates a bullet class 
    speed: number;
    startx: number;
    x: number;
    y: number;
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
    let bullet = new Bullet(PIXI.Sprite.from("assets/protagbullet.png"), (avatar.matterData.position.x, avatar.matterData.position.y , 30, 20), 10)
    bullet.y = avatar.matterData.position.y; //makes sure bullet fires from same height as avatar.
    if(left) { // by using a parameter, the program decides whether or not the bullet is travelling left.
        bullet.speed = -bulletSpeed;
    } else {
        bullet.speed = bulletSpeed;
    }
    canvas.stage.addChild(bullet.pixiData); //renders bullet but only pixiData can be rendered by pixi

    return bullet;
}

export function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].x += bullets[i].speed; //bullets move to the right when x is pressed
        if (bullets[i].x > 800 || bullets[i].x < 0) { //if bullets have moved too far, then they are dead.
            bullets[i].dead = true;
        }
        if (bullets[i].dead) { //removes bullets that are out of screen.
            canvas.stage.removeChild(bullets[i]);
            bullets.splice(i, 1); //removes dead bullets from array

        }
    }
}