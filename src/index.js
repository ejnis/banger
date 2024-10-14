import selection from "/src/selection.js";
import niveau1 from "/src/niveau1.js";
import niveau2 from "/src/niveau2.js";
import menu from "/src/menu.js";
import mort from "/src/mort.js";

var config = {
  type: Phaser.AUTO,
  width:1200,
  height:800,
  scene : [menu,selection, niveau1, niveau2,mort],
  
    physics : {
      default : 'arcade',
      arcade : {
        gravity : { y: 300},
        debug : true,
      }
    }
  };


var game = new Phaser.Game(config);
game.scene.start("menu");



function preload(){
}

function create(){
}

function update(){
}


 
  




  
