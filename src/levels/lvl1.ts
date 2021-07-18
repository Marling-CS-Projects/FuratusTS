import * as PIXI from 'pixi.js'
import { Platform, Wall } from '../Walls'
import { Bodies }from 'matter-js'

let platform = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));
let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(950, 340, 180, 20, {isStatic:true}));
let platform2= new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(1400,240,720, 20, {isStatic:true}));
export let platforms1: Platform[] = [];
platforms1.push(platform,platform1,platform2)