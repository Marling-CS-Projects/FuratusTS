import { GameObject } from './GameObject'
import { avatar, deadmsg } from './index'
import { Body } from 'matter-js';
import { fire } from './Bullet'
import * as PIXI from 'pixi.js' 
import { Powerup } from './Powerups';




export abstract class Entity extends GameObject { //for all 'living' objects in the game.
    health: number;
    dead: boolean;
    spawnX: number;
    spawnY: number;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, spawnX: number, spawnY: number) {
        super(pixiData, matterData)
        this.health = health;
        this.dead = dead;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }
}

export type power = "shield" | "dmgbuff" | "invincible" | "none"
export class Avatar extends Entity {
    grounded: boolean;
    damage:number;
    power:power;
    posTextures:PIXI.Texture[]
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, grounded: boolean, spawnX: number, spawnY: number, damage:number, power:power, posTextures:PIXI.Texture[]) {
        super(pixiData, matterData, health, dead, spawnX, spawnY,)
        this.damage = damage;
        this.grounded = grounded;
        this.power = power;
        this.posTextures = posTextures
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);

        if (this.health == 0) { //checks if the avatar is dead.
            this.dead = true
            this.pixiData.texture = this.posTextures[2]
            deadmsg.x = avatar.pixiData.position.x;
            deadmsg.y = avatar.pixiData.position.y + 50

        } else {
            this.dead = false
        }

        if (this.health == 1){
            this.pixiData.texture = this.posTextures[1]
        } else if (this.health > 1 && this.power == "none") {
            this.pixiData.texture = this.posTextures[0]
        }
    }

    reset() {
        this.health = 10
        this.dead = false
        this.grounded = true
        this.pixiData.texture = this.posTextures[0]
        this.power = "none"
        deadmsg.x = 0
        deadmsg.y = 1200 //resets death sprites so they can't be seen.
        Body.setPosition(avatar.matterData, { x: this.spawnX, y: this.spawnY }) //returns avatar to original position
    }

    applyPower(powerAdded:power){
        console.log("applying power", powerAdded)
        this.power = powerAdded; //means the power is active - used to prevent multiple powers simultaneously
        if (powerAdded === "shield"){
            this.pixiData.texture=this.posTextures[3]
            console.log("shield added" + this.power)
            setInterval(this.removePower.bind(this), 10000)
            //maybe try storing a variable in Bullet.ts that is updated when shield is called.
            
        } else if (powerAdded === "dmgbuff"){
            this.pixiData.texture = this.posTextures[4]
            this.damage = 3
            console.log("damage is up", avatar.damage) //testing
            
        } else if (powerAdded === "invincible"){
            let targetHealth = avatar.health; //create a variable to check against if the health decreases
            if (avatar.health !== targetHealth) {//if the health decreases, 
                avatar.health = targetHealth
                this.removePower() 
            }

        }

    }

    removePower(){
        this.power = "none"
        this.damage = 1
        console.log("power removed", this.power)
    }
}

export class Enemy extends Entity {
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, spawnX: number, spawnY: number) {
        super(pixiData, matterData, health, dead, spawnX, spawnY)
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
        Body.setPosition(this.matterData, { x: this.spawnX, y: this.spawnY })
    }
    findAvatar() {
        //dijkstra's to find avatar
    }
}

type direction = "left" | "right" | "none"; //creates a type union for direction that only allows left, right or up to be inputted.

export class ProjectileEnemy extends Enemy {
    direction: direction
    inProx: boolean
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, spawnX: number, spawnY: number, direction: direction, inProx: boolean) {
        super(pixiData, matterData, health, dead, spawnX, spawnY)
        this.direction = direction;
        this.inProx = inProx;

        this.emit = this.emit.bind(this)
    }

    update(delta: number) {
        super.update(delta)
        this.avatarProx()
        this.detectDirection()
    }
    avatarProx() { //used to find how close the avatar is to the entity.
        //uses pythagoras to calculate distance between the avatar and the enemy
        let a: number;
        if (avatar.matterData.position.x > this.matterData.position.x) { //prevents having a negative a value
            a = avatar.matterData.position.x - this.matterData.position.x
        } else {
            a = this.matterData.position.x - avatar.matterData.position.x
        }
        let b = avatar.matterData.position.y - this.matterData.position.y
        let c = Math.sqrt(((a ^ 2) + (b ^ 2))) //a squared plus b squared equals c squared
        if (c < 22) { //arbitrary number I picked that seemed good
            this.inProx = true
        } else if (c > 22) {
            this.inProx = false
        }
    }

    detectDirection() {
        if (avatar.matterData.position.x > this.matterData.position.x) {
            this.direction = "right"
        } else {
            this.direction = "left"
        }
    }

    emit() {
        if (this.inProx == true) {
            //console.log("prEnemy shooting") testing
            if (this.direction == "left") {
                //console.log("left") testing
                fire(false, false, this.matterData.position.x, this.matterData.position.y)//left goes right and right goes left. fix this.
            }
            if (this.direction == "right") {
                //console.log("right") testing
                fire(true, false, this.matterData.position.x, this.matterData.position.y)
            }
        }
    }
}