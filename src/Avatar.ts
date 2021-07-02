import { GameObject } from './GameObject'

export class Avatar extends GameObject {
    health:number;
    constructor(pixiData: any, matterData: any, health:number) {
        super(pixiData, matterData)
        this.health = health;

        if (this.matterData.angle != 90) { //attempt to prevent avatar from rotating. currently non-functional.
            this.matterData.angle = 0;
        }
    }
} 