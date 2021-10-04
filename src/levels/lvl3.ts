import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"
import {boss} from'./boss'


//platforms
let platform0 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(400,440,180, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(800,440,180, 20, {isStatic:true}));
let platform2 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(1050,300,180, 20, {isStatic:true}));
let platform3 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(800,160,180, 20, {isStatic:true}));
let platform4 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(400,160,180, 20, {isStatic:true}));
let platform5 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(100,160,180, 20, {isStatic:true}));
let platform6 = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(-500,160,720, 20, {isStatic:true}));

 



const platforms: Platform[] = [];
platforms.push(platform0, platform1,platform2, platform2, platform3,platform4,platform5, platform6)

//cannons
let bothcannon = new Cannon(PIXI.Sprite.from("assets/bothcannon.png"), Bodies.rectangle(100, 120, 60,30, {isStatic:true}), "both")

const cannons: Cannon[]= [];
cannons.push(bothcannon)

//spikes
let trispike0 = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(800, 410, 117, 39, {isStatic: true}));
let trispike1 = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(1050, 270, 117, 39, {isStatic: true}));
let trispike2 = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(800, 130, 117, 39, {isStatic: true}));



const spikes: Spike[] = [];
spikes.push( trispike0 , trispike1,trispike2)


//enemies
const enemies:Enemy[] = [];
enemies.push()
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push()


//powerups created for level 1
const powerups:Powerup[] = []
powerups.push()

const avSpawnX = 400
const avSpawnY = 350

const lvl3End = new LevelEnd(Bodies.rectangle(-841, 130, 30, 30, {isStatic:true}), boss)

export const lvl3 = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups, avSpawnX, avSpawnY, lvl3End, 2)