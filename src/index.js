import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import sky from "./assets/sky.png";
import ground from "./assets/floor.png"
import girl from "./assets/sprite-girl.png";
import starImg from "./assets/items/star.png";
import letterFactory from './itemFactory.js';

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
    update: update,
  },
  pixelArt: true
};

const game = new Phaser.Game(config);
let platforms;
let player;
let background;
let scoreboard;
let star;
let timer;

function preload() {
  this.load.image('sky', sky);
  this.load.image('ground', ground);
  this.load.image('star', starImg)
  this.load.spritesheet('girl',
    girl,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  // adding background
  background = this.add.image(400, 300, 'sky');
  background.setScale(4)

  // adding ground to game
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 780, 'ground').setScale(4).refreshBody();

  // adding player to game
  player = this.physics.add.sprite(100, 450, 'girl');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  // scoreboard
  scoreboard = this.add.text(16, 16, 'score: ', { fontSize: '50px', fill: '#FFF' })

  timer = this.time.addEvent({
    delay: 500,                // ms
    callback: starTest,
    callbackScope: this,
    repeat: 10
  });



}

function update() {
  let letterItem = letterFactory("N", "BLUE")
}

function starTest() {

  console.log("INSIDE STARTEST FUNC");
  star = this.physics.add.image(Math.floor((Math.random() * 800) + 1), 0, 'star');
}
