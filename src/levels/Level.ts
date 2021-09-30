import { Platform } from "../Walls";
import { Cannon, Spike } from "../Obstacle";
import { Enemy, ProjectileEnemy } from "../Entity";
import { Powerup } from "../Powerups";
import { GameObject } from "../GameObject";
import { createMenu, levelEndContainer,createLevelEndMenu } from "../menus"
import * as PIXI from 'pixi.js'
import { loadMap } from "..";

export class Level {
    platforms;
    cannons;
    spikes;
    enemies;
    projectileEnemies;
    powerups;
    map:any;
    avSpawnX;
    avSpawnY;
    levelEnd;
    constructor(platforms:Platform[], cannons:Cannon[], spikes:Spike[], enemies:Enemy[], projectileEnemies:ProjectileEnemy[], powerups:Powerup[], avSpawnX: number, avSpawnY:number, levelEnd: LevelEnd,){
        this.platforms = platforms
        this.cannons = cannons;
        this.spikes = spikes;
        this.enemies = enemies;
        this.projectileEnemies = projectileEnemies;
        this.powerups = powerups;
        this.map = [...platforms, ...cannons, ...spikes, ...enemies, ...powerups, levelEnd]
        this.avSpawnX = avSpawnX
        this.avSpawnY = avSpawnY
        this.levelEnd = levelEnd;
    }
}


export class LevelEnd extends GameObject {
    completed:boolean;
    nextlvl:Level;
    constructor(matterData:any, nextlvl:Level){
        super(PIXI.Sprite.from("assets/goal.png"), matterData)
        this.completed = false;
        this.nextlvl = nextlvl;
    }

    saveAndContinue(){
        loadMap(this.nextlvl)
        this.completed = true
    }

    levelEndMenu(){
        createMenu(levelEndContainer)
        createLevelEndMenu()
        
    }
}