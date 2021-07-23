import { GameObject } from "./GameObject";
import { Body, Bodies, World, Engine } from 'matter-js'
import * as PIXI from 'pixi.js'
import { canvas, engine, avatar } from './index'

export let bullets: Bullet[] = []; //create an empty array to store bullets in

export class Bullet extends GameObject { //creates a bullet class 
    speed: number;
    dead: boolean;
    constructor(pixiData: any, matterData: any, speed: number, dead: boolean) {
        super(pixiData, matterData)
        this.speed = speed;
        this.dead = dead;
    }
    update(delta: number) {
        this.pixiData.position.x = this.matterData.position.x;
        this.pixiData.position.y = this.matterData.position.y;
        this.pixiData.rotation = this.matterData.angle;
        this.pixiData.anchor.set(0.5);
        for (let i = 0; i < bullets.length; i++) {
            Body.setVelocity(bullets[i].matterData, { x: -bullets[i].speed, y: 0 });; //bullets move to the right when x is pressed
            if (bullets[i].matterData.position.x > 3000 || bullets[i].matterData.position.x < 0) { //if bullets have moved too far, then they are dead.
                bullets[i].dead = true;
            }
            if (bullets[i].dead) { //removes bullets that are out of screen.
                canvas.stage.removeChild(bullets[i].pixiData);
                bullets.splice(i, 1); //removes dead bullets from array

            }
        }
    }

}

export function fire(left: boolean) {
    console.log("Fire!"); //for checking that the bullets are actually firing. will remove when project is finished.
    let bullet = createBullet(left); //calls createBullet function.
    bullets.push(bullet); // adds bullets that have been fired to an array of bullets
}

export function createBullet(left: boolean) { // is responsible for creating the bullets
    if (left) { // by using a parameter, the program decides whether or not the bullet is travelling left.
        let bullet = new Bullet(PIXI.Sprite.from("assets/bullet.png"), Bodies.rectangle(avatar.pixiData.position.x + 35, avatar.pixiData.position.y, 30, 20, { isStatic: false }), 10, false);
        bullet.speed = -bullet.speed;
        World.add(engine.world, [bullet.matterData]);
        canvas.stage.addChild(bullet.pixiData);

        return bullet;
    } else {
        let bullet = new Bullet(PIXI.Sprite.from("assets/bullet.png"), Bodies.rectangle(avatar.pixiData.position.x - 35, avatar.pixiData.position.y, 30, 20, { isStatic: false }), 10, false);
        bullet.speed = bullet.speed;
        World.add(engine.world, [bullet.matterData]);
        canvas.stage.addChild(bullet.pixiData);

        return bullet;
    }
}