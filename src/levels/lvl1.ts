import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js';
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon } from '../Obstacles'
import { GameObject } from '../GameObject';
import {Enemy, ProjectileEnemy} from '../Entity'

//platforms created for level 1
let platform = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(950, 340, 180, 20, {isStatic:true}));
let platform2= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(1400,240,720, 20, {isStatic:true}));
const platforms1: Platform[] = [];
platforms1.push(platform,platform1,platform2)

//spikes created for level 1
let spike = new Spike(PIXI.Sprite.from("assets/spike39.png"), Bodies.rectangle(1400, 210, 39, 39, {isStatic: true}));
let trispike = new Spike(PIXI.Sprite.from("assets/3spike39.png"), Bodies.rectangle(475, 310, 117, 39, {isStatic: true }));
const spikes1: Spike[] = [];
//spikes1.push( spike, trispike)

//cannons created for level 1
let rightcannon = new Cannon(PIXI.Sprite.from("assets/rightcannon.png"), Bodies.rectangle(40, 300, 60,30, {isStatic:true}), "right")
let leftcannon = new Cannon(PIXI.Sprite.from("assets/leftcannon.png"), Bodies.rectangle(1700, 200,60,30, {isStatic:true}), "left")
let bothcannon = new Cannon(PIXI.Sprite.from("assets/bothcannon.png"), Bodies.rectangle(950, 300,60,30, {isStatic:true}), "both")
const cannons1: Cannon[]= [];
//cannons1.push(rightcannon, leftcannon, bothcannon )

//enemies created for level 1
export let prEnemy1 = new ProjectileEnemy(PIXI.Sprite.from("assets/projectile.png"), Bodies.rectangle(1500, 200, 60, 60, { inertia: Infinity }), 3, false, 1500, 200, "none", false)
let enemy1 = new Enemy(PIXI.Sprite.from("assets/enemy.png"), Bodies.rectangle(700, 300, 60, 60, { inertia: Infinity }), 3, false, 700, 300)
let enemy2 = new Enemy(PIXI.Sprite.from("assets/enemy.png"), Bodies.rectangle(200, 300, 60, 60, { inertia: Infinity }), 3, false, 200, 300)
export const enemies1:Enemy[] = [];
enemies1.push( prEnemy1, )
export const prEnemies1:ProjectileEnemy[] = [];
prEnemies1.push( prEnemy1)


//creates an array to store all of lvl1 in for level swithching
const lvl1map:GameObject[] = [];
lvl1map.push(...platforms1, ...spikes1, ...cannons1, ...enemies1) 


//for drawing:
//platforms are drawn from centre.
//cannons should be drawn -40. spikes -30

export { lvl1map, platforms1, cannons1, spikes1}