import { GameObject } from './GameObject'

export class Avatar extends GameObject {
    health:number;
    constructor(pixiData: any, matterData: any, health:number) {
        super(pixiData, matterData)
        this.health = health;
    }
} 