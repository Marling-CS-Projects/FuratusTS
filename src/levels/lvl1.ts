import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"
import {lvl2} from './lvl2'

//platforms created for level 1
let platform = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(950, 340, 180, 20, {isStatic:true}));
let platform2= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(1400,240,720, 20, {isStatic:true}));
const platforms: Platform[] = [];
platforms.push(platform,platform1,platform2)

//cannons created for level 1
let rightcannon = new Cannon(PIXI.Sprite.from("assets/rightcannon.png"), Bodies.rectangle(40, 300, 60,30, {isStatic:true}), "right")
let leftcannon = new Cannon(PIXI.Sprite.from("assets/leftcannon.png"), Bodies.rectangle(1700, 200,60,30, {isStatic:true}), "left")
let bothcannon = new Cannon(PIXI.Sprite.from("assets/bothcannon.png"), Bodies.rectangle(950, 300,60,30, {isStatic:true}), "both")
const cannons: Cannon[]= [];
cannons.push()

//spikes created for level 1
let spike = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(1400, 210, 39, 39, {isStatic: true}));
let trispike = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(475, 310, 117, 39, {isStatic: true }));
const spikes: Spike[] = [];
spikes.push( )


//enemies created for level 1
let prEnemy1 = new ProjectileEnemy(Bodies.rectangle(1500, 200, 60, 60, { inertia: Infinity }), 1500, 200, platform2)
let enemy1 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(650, 300, 60, 60, { inertia: Infinity }), 700, 300, platform)
let enemy2 = new Enemy(PIXI.Sprite.from("assets/enemy.png"), Bodies.rectangle(200, 300, 60, 60, { inertia: Infinity }), 200, 300,platform)
const enemies:Enemy[] = [];
enemies.push()
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push()
//prEnemies1.push( prEnemy1)



//powerups created for level 1
let shield1 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(1400, 205, 38, 50, {isStatic:true}), "shield", 1400, 205, false)
const powerups:Powerup[] = []
powerups.push()

//for drawing:
//platforms are drawn from centre.
//cannons should be drawn -40. spikes -30
//shields are 38x50

const lvl1End = new LevelEnd(Bodies.rectangle(1500, 200, 30, 30, {isStatic:true}), lvl2)
export const lvl1 = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups, 300, 300, lvl1End)