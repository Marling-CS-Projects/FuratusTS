import { Platform } from "../Walls";
import { Cannon, Spike } from "../Obstacles";
import { Enemy, ProjectileEnemy } from "../Entity";
import { Powerup } from "../Powerups";

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
    constructor(platforms:Platform[], cannons:Cannon[], spikes:Spike[], enemies:Enemy[], projectileEnemies:ProjectileEnemy[], powerups:Powerup[], avSpawnX: number, avSpawnY:number){
        this.platforms = platforms
        this.cannons = cannons;
        this.spikes = spikes;
        this.enemies = enemies;
        this.projectileEnemies = projectileEnemies;
        this.powerups = powerups;
        this.map = [...platforms, ...cannons, ...spikes, ...enemies, ...projectileEnemies, ...powerups]
        this.avSpawnX = avSpawnX
        this.avSpawnY = avSpawnY
    }
}