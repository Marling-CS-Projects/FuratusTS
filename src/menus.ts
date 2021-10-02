import $ from "jquery"
import {loadMap,selectedLevel} from "./index"
import { lvl1 } from "./levels/lvl1";
import {getSavedLevel, getSaveIndex, saveGame} from "./saveManager"

export const menuContainer = document.createElement("div") //creates a constant to be reused when creating divs
export const levelEndContainer = document.createElement("div")
menuContainer.classList.add("menu-container"); //adds menuContainer class for css
levelEndContainer.classList.add("level-end-container");

export function createStartMenu() {
    $(menuContainer).html(`
        <div>
        <p> FURATUS</p>
            <div class="button-container">
                New Game
            </div>
            <br />
            <div class="load-button-container">
                Load Game
            </div>
            <!-- add best times here-->
        </div>
    `);
    $(".button-container").on('click', function () {
        loadMap(lvl1); //begins level one when the start button is pressed
        closeMenu(menuContainer);
    });
    $(".load-button-container").on('click', function (){
        if(getSaveIndex() == "noSave"){
            alert("No Save Data Detected")
        } else {
            loadMap(getSavedLevel())
            closeMenu(menuContainer)
        }
    });
}

export function createLevelEndMenu(){
    $(levelEndContainer).html(`
        <div>
            <div class ="save-button-container">
                Save and continue?
        </div>        
        <br>
        <div>
            <div class ="quit-button-container">
                Quit
        </div>    
    `);
    $(".save-button-container").on('click', function() {
        closeMenu(levelEndContainer)
        loadMap(selectedLevel.levelEnd.nextlvl) //loads the level after selectedLevel
        saveGame(selectedLevel.levelIndex)
    })
}

export function closeMenu(menu:any) { //clears container, effectively closing the menu
    $(menu).html('');
}

export function createMenu(menu:any){
    document.body.appendChild(menu)
}