import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"

//platforms
let platform0 = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,550,720, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(130,425,180, 20, {isStatic:true}));
let platform2 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(130,300,180, 20, {isStatic:true}));
let platform3 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(130,175,180, 20, {isStatic:true}));

const platforms: Platform[] = [];
platforms.push(platform0, platform1,platform2, platform3)

//cannons
const cannons: Cannon[]= [];
cannons.push()

//spikes
const spikes: Spike[] = [];
spikes.push( )


//enemies
const enemies:Enemy[] = [];
enemies.push()
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push()


//powerups created for level 1
const powerups:Powerup[] = []
powerups.push()

const bossEnd = new LevelEnd(Bodies.rectangle(1500, 200, 30, 30, {isStatic:true}), null)

export const boss = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups,  300, 400, bossEnd, 3)