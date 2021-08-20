import { GameObject } from './GameObject'
import { avatar, deadmsg } from './index'
import { Body } from 'matter-js';
import { fire } from './Bullet'
import * as PIXI from 'pixi.js' 




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

//creates textures for avatar death and reset
let avliving = PIXI.Texture.from("assets/avatar.png")
let avdead = PIXI.Texture.from("assets/avdead.png")
export class Avatar extends Entity {
    grounded: boolean;
    constructor(pixiData: any, matterData: any, health: number, dead: boolean, grounded: boolean, spawnX: number, spawnY: number,) {
        super(pixiData, matterData, health, dead, spawnX, spawnY,)
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);

        if (this.health == 0) { //checks if the avatar is dead.
            this.dead = true
            this.pixiData.texture = avdead
            deadmsg.x = avatar.pixiData.position.x;
            deadmsg.y = avatar.pixiData.position.y + 50

        }
    }

    reset() {
        this.health = 10
        this.dead = false
        this.grounded = true
        this.pixiData.texture = avliving
        deadmsg.x = 0
        deadmsg.y = 1200 //resets death sprites so they can't be seen.
        Body.setPosition(avatar.matterData, { x: this.spawnX, y: this.spawnY }) //returns avatar to original position
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
            console.log("prEnemy shooting")
            if (this.direction == "left") {
                console.log("left")
                fire(false, false, this.matterData.position.x, this.matterData.position.y)//left goes right and right goes left. fix this.
            }
            if (this.direction == "right") {
                console.log("right")
                fire(true, false, this.matterData.position.x, this.matterData.position.y)
            }
        }
    }
}