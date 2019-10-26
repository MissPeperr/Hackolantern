import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import girl from "./assets/sprite-girl.png";
import starImg from "./assets/items/star.png";
import coffeeImg from "./assets/items/coffee.png";
import items from './itemFactory.js';
import hackeryBkg from './assets/background-01.png'

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
let player;
let background;
let scoreboard;
let star;
let timer;
let coffeeTimer;
let coffee;
let cursors;

function preload() {
  this.load.image('hackeryBkg', hackeryBkg);
  this.load.image('star', starImg)
  this.load.image('coffee', coffeeImg)
  this.load.spritesheet('girl',
    girl,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  // adding background
  background = this.add.image(600, 400, 'hackeryBkg');

  // adding player to game
  player = this.physics.add.sprite(600, 640, 'girl');

  player.setScale(3);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // left animation
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // turn animation
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'girl', frame: 9 }],
    frameRate: 20
  });

  // right animation
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('girl', { start: 10, end: 18 }),
    frameRate: 10,
    repeat: -1
  });

  // scoreboard
  scoreboard = this.add.text(16, 16, 'score: ', { fontSize: '50px', fill: '#FFF' })

  timer = this.time.addEvent({
    delay: 500,                // ms
    callback: starTest,
    callbackScope: this,
    repeat: 10
  });


  coffeeTimer = this.time.addEvent({
    delay: 500,                // ms
    callback: coffeeItemGenerator,
    callbackScope: this,
    repeat: 10
  });



  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // let letterItem = letterFactory("N", "BLUE")
  if (cursors.left.isDown) {
    player.setVelocityX(-250);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(250);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }
}


// BEGIN FALLING ITEMS

function starTest() {

  console.log("INSIDE STARTEST FUNC");
  star = this.physics.add.image(Math.floor((Math.random() * 800) + 1), 0, 'star');
}

// COFFEE ITEM
function coffeeItemGenerator() {
  coffee = this.physics.add.image(Math.floor((Math.random() * 800) + 1), 0, 'coffee');
  this.physics.add.overlap(coffee, player, coffeeEffect)

  function coffeeEffect(coffee) {
    console.log("YOU ARE AMPED!!!")
    coffee.disableBody(true, true)
  }
}

