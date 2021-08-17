import { GameObject } from "./GameObject";
import { fire, createBullet } from './Bullet'
abstract class Obstacle extends GameObject {
    constructor(pixiData: any, matterData: any) {
        super(pixiData, matterData)
    }
}

export class Spike extends Obstacle {
    constructor(pixiData: any, matterData: any) {
        super(pixiData, matterData)
    }
}

type Direction = "left" | "right" | "both"; //creates a type union for direction that only allows left, right or up to be inputted.

export class Cannon extends Obstacle {
    direction: any;
    constructor(pixiData: any, matterData: any, direction: Direction) {
        super(pixiData, matterData)
        this.direction = direction;

        this.emit = this.emit.bind(this) //fixes bug with cannon 
    }


    emit() {

        if (this.direction == "left") {
            fire(false, false, this.matterData.position.x, this.matterData.position.y)//left goes right and right goes left. fix this.
        }
        if (this.direction == "right") {
            fire(true, false, this.matterData.position.x, this.matterData.position.y)
        }
        if (this.direction == "both") {
            fire(true, false, this.matterData.position.x, this.matterData.position.y)
            fire(false, false, this.matterData.position.x, this.matterData.position.y)
        }

    }
}