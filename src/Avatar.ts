import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js'

export class Avatar extends GameObject {
    health:number;
    dead: boolean;
    constructor(pixiData: any, matterData: any, health:number, dead:boolean) {
        super(pixiData, matterData)
        this.health = health;
        this.dead = dead;
    }
    
    update(delta:number) {
        this.pixiData.position.x = this.matterData.position.x; 
        this.pixiData.position.y = this.matterData.position.y; 
        this.pixiData.rotation = this.matterData.angle;
        
        if(this.health == 0) {
            this.dead = true;
        } else {
            this.dead = false; //obsolete normally, but currently being used for testing purposes.
        }
    }
} 

