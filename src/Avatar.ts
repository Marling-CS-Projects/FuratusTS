import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js'

export class Avatar extends GameObject {
    health:number;
    dead: boolean;
    constructor(pixiData: any, matterData: any, health:number, dead:boolean) {
        super(pixiData, matterData)
        this.health = health;
        this.dead = dead;
    }

    checkDead() {
        if(this.health === 0) {
            this.dead = true;
        }
    }

    replaceSprite() {
        if (this.dead = true) {
            this.pixiData = PIXI.Sprite.from("./assets/avdead.png");
        }
    }
} 