import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import sky from "./assets/sky.png";
import ground from "./assets/floor.png"
import girl from "./assets/sprite-girl.png";
import starImg from "./assets/items/star.png";
import coffeeImg from "./assets/items/coffee.png";
import items from './itemFactory.js';

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
let scoreboard = {
  N: null,
  S1: null,
  S2: null
};
let star;
let timer;
let letter;
let coffeeTimer;
let coffee;
let cursors;
let currentColor;

function preload() {
  this.load.image('sky', sky);
  this.load.image('ground', ground);
  this.load.image('star', starImg)
  this.load.image('coffee', coffeeImg)
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

  this.physics.add.collider(player, platforms);

  // scoreboard
  scoreboard = this.add.text(16, 16, 'score: ', { fontSize: '50px', fill: '#FFF' })

  timer = this.time.addEvent({
    delay: 100,                // ms
    callback: letterItemGenerator,
    callbackScope: this,
    loop: true
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

function letterItemGenerator() {
  const letterChoice = Phaser.Math.RND.pick(["N", "S", "S"])
  const colorChoice = Phaser.Math.RND.pick(["RED", "GREEN", "BLUE"])
  letter = this.physics.add.image(Math.floor((Math.random() * 800) + 1), 0, 'star');
  letter.name = letterChoice
  letter.data = colorChoice
  this.physics.add.overlap(letter, player, letterEffect)

  function letterEffect(letter) {
    letter.disableBody(true, true)
    updateScoreboard(letter)
    // console.log(letter.name, letter.data)
  }
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

function updateScoreboard(letter) {
  let color = letter.data
  console.log(color)
  if (color !== currentColor) {
    currentColor = color
    scoreboard = resetScoreboard()
  }
  console.log(currentColor)
  console.log(letter.name)
  if (letter.name == "N") {
    scoreboard.N = color
  } else if (letter.name == "S") {  
      if (scoreboard.S1 == null) {
        scoreboard.S1 = color
      } else {
        scoreboard.S2 = color
      }
  }

  // updateDatabase(scoreboard)

  if (scoreboard.N !== null && scoreboard.S1 !== null && scoreboard.s2 !== null) {
    // win the game
  }
}


function resetScoreboard(){
  return {
    N: null,
    S1: null,
    S2: null
  }
};