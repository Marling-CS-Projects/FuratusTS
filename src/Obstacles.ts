import { GameObject } from "./GameObject";
import { avatar, engine } from "./index"
import * as Matter from 'matter-js'
import { Engine, Body, Events} from 'matter-js';

abstract class Obstacle extends GameObject {
    constructor(pixiData:any, matterData:any) {
        super(pixiData, matterData)
    }
}

export class Spike extends Obstacle {
    damage: number;
    constructor(pixiData:any, matterData:any) {
        super(pixiData, matterData)
    }

    //no clue why this doesn't work
    update(delta: number){
        this.pixiData.position.x = this.matterData.position.x; 
        this.pixiData.position.y = this.matterData.position.y; 
        this.pixiData.rotation = this.matterData.angle;

        let playerColliding : boolean = false;
        Matter.Events.on(engine, "collisionStart", function (event) { 
            event.pairs
                .filter(pair => pair.bodyA == avatar.matterData || pair.bodyB == avatar.matterData)
                .forEach(pair => {
                    let possibleColliding = pair.bodyA == avatar.matterData ? pair.bodyB : pair.bodyA; 
                    if (possibleColliding == this.matterData) { 
                        avatar.dead = true;
                    }         
                })
        })
    }
}
