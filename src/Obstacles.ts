import { GameObject } from "./GameObject";
import { elapsed } from "./index"
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

export class Cannon extends  Obstacle {
    direction: any;
    constructor(pixiData: any, matterData:any, direction: Direction) {
        super(pixiData, matterData)
    }

    update(delta:number) {
        super.update(delta);
        
        if (elapsed > 600 ){
            this.emit()
        }
    }

    emit() {
        if (this.direction === "left") {
            fire(true, false)
        }
        if (this.direction === "right") {
            fire(false, false)
        }
        if (this.direction === "both") {
            fire(true, false)
            fire(false, false)
        }


    }


}