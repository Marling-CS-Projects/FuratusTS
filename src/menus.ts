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
            <br/>
            <div class="load-button-container">
                Load Game
            </div>
            <br/>
            <div class="bt-button-container">
                Best Times
            </div>
        </div>
    `);
    $(".button-container").on('click', function () {
        if(confirm("Starting a new game will overwrite any previous save data. Are you sure you want to continue?") == true) {
            loadMap(lvl1); //begins level one when the start button is pressed
            closeMenu(menuContainer);
            saveGame(selectedLevel.levelIndex)
        }
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
                Save and Quit
        </div>    
    `);
    $(".save-button-container").on('click', function() {
        closeMenu(levelEndContainer)
        loadMap(selectedLevel.levelEnd.nextlvl) //loads the level after selectedLevel
        saveGame(selectedLevel.levelIndex)
    })
    $(".quit-button-container").on('click', function(){
        closeMenu(levelEndContainer)
        saveGame(selectedLevel.levelEnd.nextlvl.levelIndex)
        createStartMenu()
        createMenu(menuContainer)

    })
}

export function closeMenu(menu:any) { //clears container, effectively closing the menu
    $(menu).html('');
}

export function createMenu(menu:any){
    document.body.appendChild(menu)
}