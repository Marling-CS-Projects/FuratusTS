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

    applyPower() {
        if (this.active == false) { //means that two powerups cannot be active at the same time
            switch (this.power) { //here i am using a switch, which fundamentally works the same as an elseif statement.
                case "shield":
                    this.active = true;
                    setTimeout((this.powActiveSwitch), 3000)
                    console.log("power is active", this.active)

                    break
                case "invincible":
                    break
                case "dmgbuff":
                    break  
            }
        }
    }

    powActiveSwitch(){
        this.active = !this.active
        console.log("power has been turned off", this.active)
    }
}