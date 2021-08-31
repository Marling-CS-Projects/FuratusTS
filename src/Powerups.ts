


import { GameObject } from "./GameObject";
import { Body } from "matter-js";
import { power } from "./Entity"

export class Powerup extends GameObject {
    power: power
    spawnX: number
    spawnY: number
    active:boolean
    constructor(pixiData: any, matterData: any, power: power, spawnX:number, spawnY:number, active:boolean) {
        super(pixiData, matterData)
        this.power = power;
        this.spawnX = spawnX
        this.spawnY = spawnY
        this.active = active
    }

    reset(){
        Body.setPosition(this.matterData, { x: this.spawnX, y: this.spawnY })
    }
}