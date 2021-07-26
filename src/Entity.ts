import { GameObject } from './GameObject'
import { avatar, avdead ,canvas, deadmsg } from './index'
import * as PIXI from 'pixi.js'
import { Sprite } from 'pixi.js';


export abstract class Entity extends GameObject { //for all 'living' objects in the game.
    health: number;
    dead: boolean;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean) {
        super(pixiData, matterData)
        this.health = health;
        this.dead = dead;
    }

}

export class Avatar extends Entity {
    health: number;
    dead: boolean;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean) {
        super(pixiData, matterData, health, dead)
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        this.pixiData.position.x = this.matterData.position.x;
        this.pixiData.position.y = this.matterData.position.y;
        this.pixiData.rotation = this.matterData.angle;

        if (this.health == 0) { //checks if the avatar is dead.
            this.dead = true
            avdead.x = avatar.pixiData.position.x;
            avdead.y = avatar.pixiData.position.y;
            deadmsg.x = avatar.pixiData.position.x;
            deadmsg.y = avatar.pixiData.position.y + 50

        } 
    }
}

