import { GameObject } from './GameObject'
import { avatar } from './index'
import { platforms1, spikes1 } from './levels/lvl1'
import { bullets } from './Bullet';

//array of all gameObjects. stored seperately to stop circular dependency error.
export const gameObjectManager: GameObject [] = [];
gameObjectManager.push(avatar, ...platforms1, ...spikes1)
