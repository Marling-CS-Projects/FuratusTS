import $ from "jquery"
import {loadMap} from "./index"
import { lvl1 } from "./levels/lvl1";

export const menuContainer = document.createElement("div") //creates a constant to be reused when creating divs
export const levelEndContainer = document.createElement("div")
menuContainer.classList.add("menu-container"); //adds menuContainer class for css
levelEndContainer.classList.add("level-end-container");

export function createStartMenu() {
    $(menuContainer).html(`
        <div>
            <div class="button-container">
                New Game
            </div>
            
            <br />
            <!-- add best times here-->
        </div>
    `);
    $(".button-container").on('click', function () {
        loadMap(lvl1); //begins level one when the start button is pressed
        closeMenu(menuContainer);
        console.log("clciked")
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
        //save() (add later)
        closeMenu(levelEndContainer)
        console.log("clicked")
        
    })
}

export function closeMenu(menu:any) { //clears container, effectively closing the menu
    $(menu).html('');
}

export function createMenu(menu:any){
    document.body.appendChild(menu)
}