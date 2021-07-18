import { GameObject } from "./GameObject";
import { avatar, engine } from "./index"
import * as Matter from 'matter-js'
import { Engine, Body, Events} from 'matter-js';
export let playerColliding : boolean = false;

abstract class Obstacle extends GameObject {
    constructor(pixiData:any, matterData:any) {
        super(pixiData, matterData)
    }
}

export class Spike extends Obstacle {
    damage: number;
    constructor(pixiData:any, matterData:any, damage:number) {
        super(pixiData, matterData)
        this.damage = damage;
    }

    collide() {
        Matter.Events.on(engine, "collisionStart", function (event) { 
            event.pairs
                .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData)
                .forEach(pair => {
                    let possibleColliding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; 
                    if (possibleColliding == this.matterData) { 
                        playerColliding = true;
                    }
                })
        })
        Matter.Events.on(engine, "collisionEnd", function (event) { 
            event.pairs
                .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData) 
                .forEach(pair => {
                    let possibleColliding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; 
                    if (possibleColliding == this.matterData) { 
                        playerColliding = false;
                    }
                })
        })
        if  (playerColliding === true) {
            avatar.health = 0
        }
    }
}
