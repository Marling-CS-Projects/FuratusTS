import { GameObject } from './GameObject'
import { avatar, canvas, deadmsg, gameObjectManager } from './index'
import Matter, { Body } from 'matter-js';
import { fire } from './Bullet'
import * as PIXI from 'pixi.js'
import { Bodies } from "matter-js"
import { Platform } from './Walls';

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

        if (this.health <= 0) { //checks if the avatar is dead.
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
        this.health = 5
        this.dead = false
        this.grounded = true
        this.pixiData.texture = this.posTextures[0]
        this.power = "none"
        deadmsg.x = 0
        deadmsg.y = 1200 //resets death sprites so they can't be seen.
        Body.setPosition(avatar.matterData, { x: this.spawnX, y: this.spawnY }) //returns avatar to original position
    }

    applyPower(powerAdded: power) {
        this.power = powerAdded; //means the power is active - used to prevent multiple powers simultaneously
        if (powerAdded === "shield") {
            this.pixiData.texture = this.posTextures[3]
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
    }
}

export class Enemy extends Entity {
    inProx: boolean;
    inFiringProx: boolean;
    direction: direction
    platform: Platform
    atEdge: boolean
    constructor(pixiData: any, matterData: any, spawnX: number, spawnY: number, platform: Platform) {
        super(pixiData, matterData, 3, false, spawnX, spawnY)
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.inProx = false;
        this.direction = "none";
        this.platform = platform;
    }

    update(delta: number) { //overrode the method from the superclass, which allows me to add to the update function
        super.update(delta);
        this.avatarProx()
        this.approachAvatar()
        this.detectDirection()

        if (this.health <= 0) { //checks if the enemy is dead.
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
        let c = (this.pythag(avatar.matterData.position.x, this.matterData.position.x, avatar.matterData.position.y, this.matterData.position.y))
        if (c < 22) {
            this.inProx = true;
            this.inFiringProx = true;
        } else if (c > 22) {
            this.inProx = false
            this.inFiringProx = false
        }
    }
    pythag(item1X: number, item2X: number, item1Y: number, item2Y: number) {
        let a: number;
        if (item1X > item2X) { //prevents having a negative a value
            a = item1X - item2X
        } else {
            a = item2X - item1X
        }
        let b: number = item1Y - item2Y
        let c = Math.sqrt(((a ^ 2) + (b ^ 2))) //a squared plus b squared equals c squared
        return c
    }

    nearEdge() {
        let xpos;
        if (this.direction == "left") {
            xpos = this.matterData.position.x - 3
        } else if (this.direction == "right") {
            xpos = this.matterData.position.x + 3
        }
        let c: number = this.pythag(this.platform.matterData.position.x, xpos, this.platform.matterData.position.y, this.matterData.position.y)
        if (c > 18) {
            return true
        } else {
            return false
        }
    }

    approachAvatar() {
        if ((this.inProx == true)) {
            if (this.direction == "right") {
                if (this.nearEdge() == false) { // prevents movement too close to edge
                    Body.setVelocity(this.matterData, { x: 2, y: this.matterData.velocity.y })
                }
            } else if (this.direction == "left") {
                if (this.nearEdge() == false) { // prevents movement too close to edge
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
    constructor(matterData: any, spawnX: number, spawnY: number, platform: Platform) {
        super(PIXI.Sprite.from("assets/projectile.png"), matterData, spawnX, spawnY, platform)
        this.health = 3
        this.direction = "none"
        this.inProx = false;

        this.emit = this.emit.bind(this)
    }

    emit() {
        if (this.inFiringProx == true) {
            if (this.direction == "left") {
                fire(false, false, this.matterData.position.x, this.matterData.position.y)//left goes right and right goes left. fix this.
            }
            if (this.direction == "right") {
                fire(true, false, this.matterData.position.x, this.matterData.position.y)
            }
        }
    }
}

type floatDirection = "up" | "down"
export class Boss extends Entity {
    floatDir: floatDirection;
    floating: boolean;
    constructor() {
        super(PIXI.Sprite.from("assets/boss.png"), Bodies.rectangle(860, 200, 150, 150, { inertia: Infinity }), 100, false, 860, 200)
        this.floatDir = "up"
        this.floating = true

        this.atk = this.atk.bind(this)
        this.shoot = this.shoot.bind(this)
        this.undoSlam = this.undoSlam.bind(this)
    }

    update(delta: number) {
        super.update(delta)
        this.floatDirection()
        this.float()
        if (this.floating == true) {
            Body.setPosition(this.matterData, ({ x: 860, y: this.matterData.position.y }))
        }
        if (this.health == 0) {
            this.dead = true
            Body.setPosition(this.matterData, { x: 0, y: 8000 })
        }
    }

    reset() {
        this.health = 100
        this.dead = false
        this.undoSlam()

    }

    atk() {
        let atkSel = Math.round(Math.random() * 2); //returns a random integer between 0 and 2
        console.log(atkSel, "should be the selected attack")
        switch (atkSel) {
            case 0:
                console.log("attack 0 was the selected attack")
                this.laser()
                break
            case 1:
                console.log("attack 1 was the selected attack")
                setTimeout(this.shoot, 500)
                setTimeout(this.shoot, 1000)
                setTimeout(this.shoot, 1500)
                setTimeout(this.shoot, 2000)
                this.shoot()
                break
            case 2:
                console.log("attack 2 was the selected attack")
                this.slam()
                break
        }
    }

    laser() {
        const laser = new Laser(this)
        function removeLaser() {
            canvas.stage.removeChild(laser.pixiData)
            gameObjectManager.splice(gameObjectManager.indexOf(laser), 1)
        }
        gameObjectManager.push(laser)
        setTimeout(removeLaser, 3000)
    }

    shoot() {
        fire(false, false, this.matterData.position.x - 80, this.matterData.position.y)
        fire(false, false, this.matterData.position.x - 80, this.matterData.position.y + 25)
        fire(false, false, this.matterData.position.x - 80, this.matterData.position.y + 50)
        fire(false, false, this.matterData.position.x - 80, this.matterData.position.y - 25)
        fire(false, false, this.matterData.position.x - 80, this.matterData.position.y - 50)
    }

    calcAngle() {
        let dx: number = Math.abs(this.matterData.position.x - avatar.matterData.position.x) //absoloute value of difference in x
        let dy: number = Math.abs(this.matterData.position.y - avatar.matterData.position.y) //absoloute value of difference in y
        let angle = (Math.atan2(dy, dx)) //atan2 returns value in radians, so this converts to degrees
        return angle
    }

    slam() {
        this.floating = false;
        Body.setAngle(this.matterData, 2 * (Math.PI) - this.calcAngle())
        Body.setVelocity(this.matterData, { x: -10, y: this.matterData.velocity.y })
        setTimeout(this.undoSlam, 2000)
    }

    undoSlam(){
        Body.setAngle(this.matterData, 0)
        this.floating = true;
        Body.setPosition(this.matterData, {x:this.spawnX, y:this.spawnY})
        this.floatDir = "up"
    }

    floatDirection() {
        if (this.matterData.position.y > 500) {
            this.floatDir = "up"
        }
        if (this.matterData.position.y < 90) {
            this.floatDir = "down"
        }
    }

    float() {
        if (this.floating == true) {
            if (this.floatDir === "up") {
                Body.setVelocity(this.matterData, { x: this.matterData.velocity.x, y: -3 })
            } else if (this.floatDir === "down") {
                Body.setVelocity(this.matterData, { x: this.matterData.velocity.x, y: 3 })

            }
        }
    }


}

export class Laser extends GameObject {
    constructor(boss: Boss) {
        super(PIXI.Sprite.from("./assets/bossbeam.png"), null)
        this.pixiData.anchor.set(1)
        this.pixiData.position.x = boss.pixiData.position.x - 75
        this.pixiData.position.y = boss.pixiData.position.y
        canvas.stage.addChild(this.pixiData)
    }

    update() {
        if ((avatar.pixiData.position.y < this.pixiData.position.y + 25) && ((avatar.pixiData.position.y > this.pixiData.position.y - 25))) {
            avatar.health = 0
        }
    }
}
