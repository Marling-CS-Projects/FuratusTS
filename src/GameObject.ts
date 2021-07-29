import { Sprite } from "pixi.js"
import { Body } from "matter-js"
//in order to store pixi and matter data for an object I need to create a gameObjects class that will contain both
export abstract class GameObject { //exporting allows other files in the project to use this class. class is abstact so that it cannot be instantiated to improve organisation.
    pixiData: Sprite;
    matterData: Body;
    constructor(pixiData: any, matterData: any) {
        this.pixiData = pixiData;
        this.matterData = matterData;

        //matter and pixi's position data are relative to different points. this makes pixi relative to a center like matter does.
        this.pixiData.anchor.set(0.5)
    }
    update(delta: number) {//maps pixi position data to matter every time there is a tick over.
        this.pixiData.position.x = this.matterData.position.x;
        this.pixiData.position.y = this.matterData.position.y;
        this.pixiData.rotation = this.matterData.angle;
    }
}



