import $ from "jquery"
import {loadMap} from "./index"
import { lvl1 } from "./levels/lvl1";

const menuContainer = document.createElement("div") //creates a constant to be reused when creating divs
menuContainer.classList.add("menu-container"); //adds menuContainer class for css

export function createStartMenu() {

    $(menuContainer).html(`
        <div>
            <div class="ng-button-container">
                New Game
            </div>
            
            <br />
            <!-- add best times here-->
        </div>
    `);
    $(".ng-button-container").on('click', function () {
        loadMap(lvl1); //begins level one when the start button is pressed
        closeMenu();
    });
}

function closeMenu() { //clears container, effectively closing the menu
    $(menuContainer).html('');
}

export function createMenu(){
    document.body.appendChild(menuContainer)
    console.log("menu created")
}