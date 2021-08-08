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

export class Cannon extends Obstacle {
    direction: any;
    constructor(pixiData: any, matterData: any, direction: Direction) {
        super(pixiData, matterData)
        this.direction = direction;
    }

    update(delta: number) {
        super.update(delta);

        if (elapsed > 600) {
            console.log("i should be shooting") //testing
            this.emit()
        }
    }

    emit() {
        console.log("emitting")
        if (this.direction == "left") {
            console.log("left")
            fire(true, false, this.matterData.position.x, this.matterData.position.y)
        }
        if (this.direction == "right") {
            console.log("right")
            fire(false, false, this.matterData.position.x, this.matterData.position.y)
        }
        if (this.direction == "both") {
            console.log("both")
            fire(true, false, this.matterData.position.x, this.matterData.position.y)
            fire(false, false, this.matterData.position.x, this.matterData.position.y)
        }
    }
}