import * as PIXI from 'pixi.js'
import { Platform } from './Walls'
import { Bodies}from 'matter-js'

export let platform = new Platform(PIXI.Sprite.from("assets/longpl.png"), Bodies.rectangle(400,340,720, 20, {isStatic:true}));
export let platform1 = new Platform(PIXI.Sprite.from("assets/shortpl.png"), Bodies.rectangle(550,240,180, 20, {isStatic:true}));
