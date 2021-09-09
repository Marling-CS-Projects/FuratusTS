import { GameObject } from './GameObject'
import { avatar, deadmsg } from './index'
import { Body } from 'matter-js';
import { fire } from './Bullet'
import * as PIXI from 'pixi.js'
import { Bodies } from "matter-js"
import { Powerup } from './Powerups';
import { Sprite } from 'pixi.js';

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
    damage: number;
    grounded: boolean;
    power: power;
    posTextures: PIXI.Texture[]
    constructor() {
        super(PIXI.Sprite.from("assets/avatar.png"), Bodies.rectangle(300, 300, 60, 60, { inertia: Infinity, timeScale: 2 }), 5, false, 300, 300)
        this.damage = 1
        this.grounded = false;
        this.power = "none";
        this.posTextures = [PIXI.Texture.from("assets/avatar.png"), PIXI.Texture.from("assets/avlow.png"), PIXI.Texture.from("assets/avdead.png"), PIXI.Texture.from("assets/avshield.png"), PIXI.Texture.from("assets/avdmgbuff.png"), PIXI.Texture.from("assets/avinvincible.png")]
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

        if (this.health == 1) {
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

    applyPower(powerAdded: power) {
        console.log("applying power", powerAdded)
        this.power = powerAdded; //means the power is active - used to prevent multiple powers simultaneously
        if (powerAdded === "shield") {
            this.pixiData.texture = this.posTextures[3]
            console.log("shield added" + this.power)
            setInterval(this.removePower.bind(this), 10000)
            //maybe try storing a variable in Bullet.ts that is updated when shield is called.

        } else if (powerAdded === "dmgbuff") {
            this.pixiData.texture = this.posTextures[4]
            this.damage = 3
            setInterval(this.removePower.bind(this), 20000) // buff is removed after 20 secs

        } else if (powerAdded === "invincible") {
            this.pixiData.texture = this.posTextures[5]
        }

    }

    removePower() {
        this.power = "none"
        this.damage = 1
        console.log("power removed", this.power)
    }
}

export class
    Enemy extends Entity {
    inProx: boolean;
    inFiringProx: boolean;
    direction: direction
    constructor(pixiData: any, matterData: any, dead: boolean, spawnX: number, spawnY: number) {
        super(pixiData, matterData, 3, dead, spawnX, spawnY)
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.dead = false;
        this.inProx = false;
        this.direction = "none";
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);
        this.avatarProx()
        this.approachAvatar()
        this.detectDirection()

        if (this.health == 0) { //checks if the enemy is dead.
            this.dead = true
            this.matterData.position.y = 800;
        }
    }

    detectDirection() {
        if (avatar.matterData.position.x > this.matterData.position.x) {
            this.direction = "right"
        } else {
            this.direction = "left"
        }
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
        if (c < 22) {
            this.inProx = true;
        } else if (c > 22) {
            this.inProx = false
        }
        if (c < 22) { //arbitrary number I picked that seemed good
            this.inFiringProx = true
        } else if (c > 22) {
            this.inFiringProx = false;
        }

    }

    approachAvatar() {
        if ((this.inProx == true)) {
            if ((avatar.matterData.position.y <= this.matterData.position.y) && (this.matterData.position.y + 15  > avatar.matterData.position.y )) {
                if (this.direction == "right") {
                    Body.setVelocity(this.matterData, { x: 2, y: this.matterData.velocity.y })
                } else if (this.direction == "left") {
                    Body.setVelocity(this.matterData, { x: -2, y: this.matterData.velocity.y })
                }
            }
        }
    }

    reset() {
        this.health = 3;
        this.direction = "none"
        this.inProx = false;
        this.dead = false;
        Body.setPosition(this.matterData, { x: this.spawnX, y: this.spawnY })
        this.pixiData.position.x = this.spawnX
        this.pixiData.position.y = this.spawnY
    }
}

type direction = "left" | "right" | "none"; //creates a type union for direction that only allows left, right or up to be inputted.

export class ProjectileEnemy extends Enemy {
    constructor(pixiData: any, matterData: any, dead: boolean, spawnX: number, spawnY: number) {
        super(pixiData, matterData, dead, spawnX, spawnY,)
        this.health = 3
        this.dead = false
        this.direction = "none"
        this.inProx = false;

        this.emit = this.emit.bind(this)
    }

    emit() {
        if (this.inFiringProx == true) {
            if ((avatar.matterData.position.y >= this.matterData.position.y) && ((this.matterData.position.y < (avatar.matterData.position.y + 15)))) {
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
}