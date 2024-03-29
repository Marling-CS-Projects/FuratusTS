import { Bodies } from 'matter-js'
import { GameObject } from './GameObject';
import * as PIXI from 'pixi.js'

/*var topWall = Bodies.rectangle(400, 50, 720, 20, { isStatic: true });
var leftWall = Bodies.rectangle(50, 210, 20, 300, { isStatic: true });
var rightWall = Bodies.rectangle(750, 210, 20, 300, { isStatic: true });*/

//perhaps use properties like minimum x = this.x - width/2 or somethiing to prevent wall jumping
export class Wall extends GameObject {
    constructor(pixiData: any, matterData: any) {
        super(pixiData, matterData)
    }
}

export class Platform extends GameObject {
    constructor(pixiData: any, matterData: any) {
        super(pixiData, matterData)
    }
}


