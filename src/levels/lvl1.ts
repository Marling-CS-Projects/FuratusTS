import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"
import {lvl2} from './lvl2'

//platforms created for level 1
let platform0 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(200,340,180, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(600,340,180, 20, {isStatic:true}));
let platform2= new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(1000,340,180, 20, {isStatic:true}));
let platform3= new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(1400,340,180, 20, {isStatic:true}));
let platform4= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(2000,250,720, 20, {isStatic:true}));
let platform5= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(2900,250,720, 20, {isStatic:true}));
let platform6= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(3800,340,720, 20, {isStatic:true}));
let platform7= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(4700,340,720, 20, {isStatic:true}));

const platforms: Platform[] = [];
platforms.push(platform0,platform1,platform2, platform3, platform4,platform5, platform6, platform7)

//cannons created for level 1
let rightcannon = new Cannon(PIXI.Sprite.from("assets/rightcannon.png"), Bodies.rectangle(1700, 210, 60,30, {isStatic:true}), "right")
const cannons: Cannon[]= [];
cannons.push(rightcannon)

//spikes created for level 1
let spike0 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(200, 310, 39, 39, {isStatic: true}));
let spike1 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(600, 310, 39, 39, {isStatic: true}));
let spike2 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(1000, 310, 39, 39, {isStatic: true}));
let spike3 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(3459, 310, 39, 39, {isStatic: true}));
let spike4 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(4141, 310, 39, 39, {isStatic: true}));
let spike5 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(4400, 310, 39, 39, {isStatic: true}));
let spike6 = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(5041, 310, 39, 39, {isStatic: true}));

let trispike0 = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(1400, 310, 117, 39, {isStatic: true }));
let trispike1 = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(4700, 310, 117, 39, {isStatic: true }));
const spikes: Spike[] = [];
spikes.push(spike0, spike1, spike2, spike3,spike4,spike5,spike6,trispike1) 


//enemies created for level 1
let prEnemy0 = new ProjectileEnemy(Bodies.rectangle(4080, 300, 60, 60, { inertia: Infinity }), 4080, 300, platform6)

let enemy0 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(4500, 300, 60, 60, { inertia: Infinity }), 4700, 300, platform7)
let enemy1 = new Enemy(PIXI.Sprite.from("assets/enemy.png"),Bodies.rectangle(4900, 300, 60, 60, { inertia: Infinity }), 4800, 300, platform7)
const enemies:Enemy[] = [];
enemies.push(prEnemy0, enemy0, enemy1)
const prEnemies:ProjectileEnemy[] = [];
prEnemies.push(prEnemy0)
//prEnemies1.push( prEnemy1)



//powerups created for level 1
const powerups:Powerup[] = []
powerups.push()

//for drawing:
//spikes should be drawn -30 y of platform.
//for a spike to be at the end, +/- 70
//if the platform is long, +/- 341
//platforms are drawn from centre.
//cannons should be drawn -40. spikes -30
//shields are 38x50

const lvl1End = new LevelEnd(Bodies.rectangle(5250, 300, 30, 30, {isStatic:true}), lvl2)
export const lvl1 = new Level(platforms,cannons, spikes, enemies, prEnemies, powerups, 120, 300, lvl1End, 0)