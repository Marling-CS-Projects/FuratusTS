


import { GameObject } from "./GameObject";
import { Body } from "matter-js";
import { power } from "./Entity"

export class Powerup extends GameObject {
    power: power
    spawnX: number
    spawnY: number
    
    constructor(pixiData: any, matterData: any, power: power, spawnX:number, spawnY:number) {
        super(pixiData, matterData)
        this.power = power;
        this.spawnX = spawnX
        this.spawnY = spawnY
    }

    reset(){
        Body.setPosition(this.matterData, { x: this.spawnX, y: this.spawnY })
    }
}