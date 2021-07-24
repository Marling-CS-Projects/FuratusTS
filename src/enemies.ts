import { GameObject } from "./GameObject";
import * as PIXI from 'pixi.js'

export class BasicEnemy extends GameObject {
    pixiData: any;
    matterData: any;
    dead: any;
    health: number;
    constructor(pixiData: any, matterData: any, dead: boolean, health: number) {
        super( pixiData, matterData)
        this.pixiData = PIXI.Sprite.from("/assets/enemy.jpg");
        this.dead = dead;
        this.health = 3;
    }

    findAvatar() {
        //dijkstra's to find avatar
    }
}