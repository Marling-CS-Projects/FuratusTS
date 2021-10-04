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

const platforms: Platform[] = [];
platforms.push(platform0,platform1)

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
spikes.push(spike0,spike1,spike2,spike3)


//enemies
const enemies:Enemy[] = [];
enemies.push()
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push()


//powerups created for level 1
let shield0 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(470, 310, 38, 50, {isStatic:true}), "invincible",470,310,)
let shield1 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(725, 200, 38, 50, {isStatic:true}), "invincible",725,200,)
let shield2 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(900, 120, 38, 50, {isStatic:true}), "invincible",900,120,)
let shield3 = new Powerup(PIXI.Sprite.from("assets/38invincible.png"), Bodies.rectangle(1125, 120, 38, 50, {isStatic:true}), "invincible",1125,120,)


const powerups:Powerup[] = []
powerups.push(shield0, shield1,shield2,shield3)

const lvl2End = new LevelEnd(Bodies.rectangle(2141, 200, 30, 30, {isStatic:true}), lvl3)

export const lvl2 = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups, 400, 200,lvl2End, 1)