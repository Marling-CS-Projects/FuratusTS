import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform } from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"
import { lvl3 } from './lvl3'

//platforms
const platform0 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(400,340,180, 20, {isStatic:true}));
const platform1 = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(1800,240,720, 20, {isStatic:true}));
const platform2 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(2400,240,180, 20, {isStatic:true}));
const platform3 = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(2600,380,720, 20, {isStatic:true}));
const platform4 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(3041,240,180, 20, {isStatic:true}));
const platform5= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(3700,380,720, 20, {isStatic:true}));
const platform6 = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(4600,380,720, 20, {isStatic:true}));

const platforms: Platform[] = [];
platforms.push(platform0,platform1,platform2,platform3,platform4, platform5, platform6)

//cannons
let leftcannon = new Cannon(PIXI.Sprite.from("assets/leftcannon.png"), Bodies.rectangle(1500, 200, 60,30, {isStatic:true}), "left")

const cannons: Cannon[]= [];
cannons.push(leftcannon)

//spikes
let spike0 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(600, 310, 39, 39, {isStatic: true}));
let spike1 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(850, 310, 39, 39, {isStatic: true}));
let spike2 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(1000, 250, 39, 39, {isStatic: true}));
let spike3 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(1250, 250, 39, 39, {isStatic: true}));


const spikes: Spike[] = [];
spikes.push(spike0, spike1, spike2, spike3)


//enemies
let enemy0 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(2620, 340, 60, 60, { inertia: Infinity }), 2650, 340, platform3)
let enemy1 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(3720, 340, 60, 60, { inertia: Infinity }), 3720, 340, platform5)
let enemy2 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(3800, 340, 60, 60, { inertia: Infinity }), 3780, 340, platform5)
let enemy3 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(3900, 340, 60, 60, { inertia: Infinity }), 3750, 340, platform5)

let prEnemy0 = new ProjectileEnemy(Bodies.rectangle(2850, 340, 60, 60, { inertia: Infinity }), 2650, 340, platform3)
let prEnemy1 = new ProjectileEnemy(Bodies.rectangle(4400, 340, 60, 60, { inertia: Infinity }), 4400, 340, platform6)
let prEnemy2 = new ProjectileEnemy(Bodies.rectangle(4600, 340, 60, 60, { inertia: Infinity }), 4600, 340, platform6)
let prEnemy3 = new ProjectileEnemy(Bodies.rectangle(4800, 340, 60, 60, { inertia: Infinity }), 4800, 340, platform6)


const enemies:Enemy[] = [];
enemies.push(enemy0, enemy1, enemy2, enemy3, prEnemy0, prEnemy1, prEnemy2, prEnemy3)
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push(prEnemy0, prEnemy1, prEnemy2, prEnemy3)


//powerups created for level 1
let shield0 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(470, 310, 38, 50, {isStatic:true}), "invincible",470,310,)
let shield1 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(725, 200, 38, 50, {isStatic:true}), "invincible",725,200,)
let shield2 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(900, 120, 38, 50, {isStatic:true}), "invincible",900,120,)
let shield3 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(1125, 120, 38, 50, {isStatic:true}), "invincible",1125,120,)

let dmgbuff0 = new Powerup(PIXI.Sprite.from("assets/dmgbuff.png"), Bodies.rectangle(3041, 210, 38, 50, {isStatic:true}), "dmgbuff",470,310,)

const powerups:Powerup[] = []
powerups.push(shield0, shield1,shield2,shield3, dmgbuff0)

const lvl2End = new LevelEnd(Bodies.rectangle(5100, 340, 30, 30, {isStatic:true}), lvl3)

export const lvl2 = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups, 2400, 200,lvl2End, 1)