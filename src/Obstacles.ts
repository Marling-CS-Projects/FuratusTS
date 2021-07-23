import { GameObject } from "./GameObject";

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
