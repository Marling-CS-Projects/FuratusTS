import { lvl1, } from './levels/lvl1';
import { lvl2 } from './levels/lvl2';
import { lvl3 } from './levels/lvl3';
import { boss } from './levels/boss';
import { Level } from './levels/Level';

//localStorage allows the dev to the user's browser's storage
//setItem creates an item with two string parameters, the first is the key and the second is the value.
export function saveGame(currentLevelIndex: number) {
    window.localStorage.setItem("game-save", `${currentLevelIndex}`); 
}

export function getSaveIndex() {
    const storedValue = window.localStorage.getItem("game-save"); //retrieves the saveIndex
    if(!storedValue) {
        return "noSave"; //so the user can't load a level with no save data
    } else {
        return parseInt(storedValue); //gets the currentLevelIndex as an integer rather than a string
    }    
}

const levelArray: Level[] = [lvl1, lvl2, lvl3, boss]

export function getSavedLevel(){
    for(let i = 0; i < levelArray.length; i++){
        if(levelArray[i].levelIndex === (getSaveIndex())){ //cycles through every level until it finds the saved one
            return levelArray[i]
        }
    }
}

