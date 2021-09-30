import * as PIXI from 'pixi.js'
import { Bodies } from 'matter-js';
import { Platform, Wall} from '../Walls'
import { Spike, Cannon, } from '../Obstacle'
import {Enemy, ProjectileEnemy} from '../Entity'
import { Powerup} from '../Powerups'
import {Level, LevelEnd } from "./Level"
import { lvl3 } from './lvl3'

//platforms
const platform = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));
const platforms: Platform[] = [];
platforms.push(platform)

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

const lvl2End = new LevelEnd(Bodies.rectangle(1500, 200, 30, 30, {isStatic:true}), lvl3)

const avSpawnX = 300
const avSpawnY = 150

export const lvl2 = new Level(platforms, cannons, spikes, enemies, prEnemies, powerups, avSpawnX, avSpawnY,lvl2End)