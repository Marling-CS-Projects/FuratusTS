import { GameObject } from './GameObject'
import { avatar, avdead , deadmsg } from './index'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js';
import { Body } from 'matter-js';
import { Sprite } from 'pixi.js';


export abstract class Entity extends GameObject { //for all 'living' objects in the game.
    health: number;
    dead: boolean;
    spawnX: number;
    spawnY: number;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, spawnX:number, spawnY:number) {
        super(pixiData, matterData)
        this.health = health;
        this.dead = dead;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }
}

export class Avatar extends Entity {
    grounded: boolean;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, grounded: boolean, spawnX:number, spawnY:number,) {
        super(pixiData, matterData, health, dead, spawnX, spawnY,)
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);

        if (this.health == 0) { //checks if the avatar is dead.
            this.dead = true
            avdead.x = avatar.pixiData.position.x;
            avdead.y = avatar.pixiData.position.y;
            deadmsg.x = avatar.pixiData.position.x;
            deadmsg.y = avatar.pixiData.position.y + 50

        } 
    }

    reset() {
        this.dead = false
        this.health = 10
        this.grounded = true
        avdead.x = 0
        deadmsg.x = 0
        avdead.y = 1200
        deadmsg.y = 1200 //resets death sprites so they can't be seen.
        Body.setPosition(avatar.matterData, { x: this.spawnX, y: this.spawnY }) //returns avatar to original position
    }
}

export class BasicEnemy extends Entity {
    constructor(pixiData: any, matterData: any, health: number, dead:boolean,spawnX:number, spawnY:number ) {
        super( pixiData, matterData, health, dead, spawnX, spawnY)
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);

        if (this.health == 0) { //checks if the enemy is dead.
            this.dead = true
            this.matterData.position.y = 800;
        } 
    }

    reset() {
        this.health = 3;
        this.dead = false;
        Body.setPosition(this.matterData, {x:this.spawnX, y:this.spawnY})
    }
    findAvatar() {
        //dijkstra's to find avatar
    }
}