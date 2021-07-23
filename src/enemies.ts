import { GameObject } from "./GameObject";
import * as PIXI from 'pixi.js'

export class basicEnemy extends GameObject {
    pixiData: any;
    matterData: any;
    dead: any;
    constructor(pixiData: any, matterData: any, dead: boolean) {
        super( pixiData, matterData)
        this.pixiData = PIXI.Sprite.from("/assets/enemy.jpg");
        this.matterData = matterData;
        this.dead = dead;
    }

    findAvatar() {
        //dijkstra's to find avatar
    }
}