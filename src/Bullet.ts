import { GameObject } from "./GameObject";
import * as Matter from "matter-js";
import { Body, Bodies, World, Engine } from 'matter-js'
import * as PIXI from 'pixi.js'
import { canvas, engine, avatar, bullets, gameObjectManager } from './index'
import { Entity, Enemy } from "./Entity";

export class Bullet extends GameObject { //creates a bullet class 
    speed: number;
    dead: boolean;
    firedByAvatar: boolean;
    constructor(pixiData: any, matterData: any, speed: number, dead: boolean, firedByAvatar: boolean,) {
        super(pixiData, matterData)
        this.speed = speed;
        this.dead = dead;
        this.firedByAvatar = firedByAvatar;
    }
    update(delta: number) {
        super.update(delta);
        for (let i = 0; i < bullets.length; i++) {
            Body.setVelocity(bullets[i].matterData, { x: bullets[i].speed, y: 0 });; //bullets move to the right when x is pressed
            if (bullets[i].matterData.position.x < -3000 || bullets[i].matterData.position.x - avatar.matterData.position.x > 3000) { //if bullets have moved too far, then they are dead.
                bullets[i].dead = true;
            }
        }
    }
    hit(beingShotGameObject: GameObject) {
        console.log("Shot something") //testing
        if (beingShotGameObject instanceof Entity) { //only entities can have health removed
            if (!(beingShotGameObject === avatar && this.firedByAvatar === true) && (avatar.power !== "shield")) { //avatar cannot shoot itself
                if (!(beingShotGameObject instanceof Enemy && this.firedByAvatar === false)) //enemies can't shoot each other
                    if ((this.firedByAvatar === true)) {
                        beingShotGameObject.health -= avatar.damage
                    } else if (this.firedByAvatar === false) {
                        beingShotGameObject.health -= 1;
                    }
                console.log("it was an Entity")//testing
                console.log("The entity's health is " + beingShotGameObject.health)//testing
            }
        }
        this.dead = true;
    }
}

export function fire(left: boolean, firedByAvatar: boolean, firedByX: number, firedByY: number) {
    let bullet = createBullet(left, firedByAvatar, firedByX, firedByY); //calls createBullet function.
    bullets.push(bullet); // adds bullets that have been fired to an array of bullets
    gameObjectManager.push(bullet); //adds bullets to the gameObject manager so they can collide with each other
}

export function createBullet(left: boolean, firedByAvatar: boolean, firedByX: number, firedByY: number) { // is responsible for creating the bullets
    let x = firedByX - 40;
    if (left) { //putting this first prevents the bullet from immediately colliding with the avatar when it is drawn, but before the bulletspeed is changed
        x = firedByX + 40;
    }

    let bullet = new Bullet(PIXI.Sprite.from("assets/bullet.png"), Bodies.rectangle(x, firedByY, 30, 20, { inertia: Infinity, isStatic: false }), -10, false, firedByAvatar,);
    if (left) {
        bullet.speed = 10;

    }
    World.add(engine.world, [bullet.matterData]);
    canvas.stage.addChild(bullet.pixiData);

    return bullet;
}

