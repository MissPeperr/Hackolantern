import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import girl from "./assets/sprite-girl.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1200,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let platforms;
let player;

function preload() {
  this.load.image('sky', sky);
  this.load.image('ground', ground);
  this.load.spritesheet('girl',
    girl,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  // adding background
  this.add.image(400, 300, 'sky');

  // adding ground to game
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 800, 'ground').setScale(2).refreshBody();

  // adding player to game
  player = this.physics.add.sprite(100, 450, 'girl');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

}
function update() {

}