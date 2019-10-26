import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import girl from "./assets/sprite-girl.png";
import { takePhoto } from './services/sneakyPhotoService';
import coffeeImg from "./assets/items/coffee.png";
import bugImg from "./assets/items/bug.png";
import nBlueImg from "./assets/items/NBLUE.png";
import nRedImg from "./assets/items/NRED.png";
import nGreenImg from "./assets/items/NGREEN.png";
import sBlueImg from "./assets/items/SBLUE.png";
import sRedImg from "./assets/items/SRED.png";
import sGreenImg from "./assets/items/SGREEN.png";
import hackeryBkg from './assets/background-01.png'

import bugSfxFile from "./assets/sfx/bug.wav";
import coffeeSfxFile from "./assets/sfx/coffee.wav";
import letterSfxFile from "./assets/sfx/letter.wav";
import loseSfxFile from "./assets/sfx/lose.wav";
import winSfxFile from "./assets/sfx/win.wav";
import bgmusicFile from "./assets/sfx/theme.mp3";


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
let scoreboard = {
  N: null,
  S1: null,
  S2: null
};
let timer;
let letter;
let coffeeTimer;
let bugTimer;
let coffee;
let bug;
let hasBug = false;
let cursors;
let hasCoffee = false;
let currentColor;
let healthCounter = 3;
//sfx
let bgmusic;
let bugSfx;
let coffeeSfx;
let letterSfx;
let winSfx;
let loseSfx;

function preload() {
  // sfx
  this.load.audio('bgmusic', bgmusicFile);
  this.load.audio('bugSfx', bugSfxFile);
  this.load.audio('coffeeSfx', coffeeSfxFile);
  this.load.audio('loseSfx', loseSfxFile);
  this.load.audio('winSfx', winSfxFile);
  this.load.audio('letterSfx', letterSfxFile);

  // img
  this.load.image('coffee', coffeeImg);
  this.load.image('bug', bugImg);
  this.load.image('NBLUE', nBlueImg);
  this.load.image('SBLUE', sBlueImg);
  this.load.image('NGREEN', nGreenImg);
  this.load.image('SGREEN', nGreenImg);
  this.load.image('NRED', nRedImg);
  this.load.image('SRED', sRedImg);
  this.load.image('hackeryBkg', hackeryBkg);
  this.load.spritesheet('girl',
    girl,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  // Ensure database has new game condition
  updateDatabase(scoreboard)
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
    delay: 1000,                // ms
    callback: letterItemGenerator,
    callbackScope: this,
    loop: true
  });


  coffeeTimer = this.time.addEvent({
    delay: 5000,                // ms
    callback: coffeeItemGenerator,
    callbackScope: this,
    loop: true
  });

  bugTimer = this.time.addEvent({
    delay: 1500,                // ms
    callback: bugItemGenerator,
    callbackScope: this,
    loop: true
  });

  bgmusic = this.sound.add('bgmusic');
  bugSfx = this.sound.add('bugSfx') 
  coffeeSfx = this.sound.add('coffeeSfx')
  winSfx = this.sound.add('winSfx')
  loseSfx = this.sound.add('loseSfx')
  letterSfx = this.sound.add('letterSfx')
  
  bgmusic.play({
    volume: .2,
    loop: true
  })

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // let letterItem = letterFactory("N", "BLUE")
  if (cursors.left.isDown) {
    player.setVelocityX(-250);
    if (hasBug) {
      player.setVelocityX(-50);
      setTimeout(() => hasBug = false, 4000)
    }
    if (hasCoffee) {
      player.setVelocityX(-1000);
      setTimeout(() => hasCoffee = false, 5000);
    }
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(250);
    if (hasBug) {
      player.setVelocityX(50);
      setTimeout(() => hasBug = false, 4000)
    }
    if (hasCoffee) {
      player.setVelocityX(1000);
      setTimeout(() => hasCoffee = false, 5000);
    }
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
  const choice = `${letterChoice}${colorChoice}`
  letter = this.physics.add.image(Math.floor((Math.random() * 1200) + 1), 0, choice);
  letter.name = letterChoice
  letter.data = colorChoice
  this.physics.add.overlap(letter, player, letterEffect)

  function letterEffect(letter) {
    letterSfx.play({ volume: .4})
    letter.disableBody(true, true)
    updateScoreboard(letter)
    // console.log(letter.name, letter.data)
  }
}

// COFFEE ITEM
function coffeeItemGenerator() {
  coffee = this.physics.add.image(Math.floor((Math.random() * 1200) + 1), 0, 'coffee');
  this.physics.add.overlap(coffee, player, coffeeEffect)
}

// BUG ITEM
function bugItemGenerator() {
  bug = this.physics.add.image(Math.floor((Math.random() * 1200) + 1), 0, 'bug');
  this.physics.add.overlap(bug, player, bugEffect)

  function bugEffect(bug) {
    bugSfx.play({ volume: .4})
    console.log("BUGGER - YOU'RE SO SLOW!!!")
    hasBug = true;
    healthCounter--
    bug.disableBody(true, true)
    console.log(healthCounter)
  }
}

// make coffee speed up character for now
function coffeeEffect(coffee) {
  coffeeSfx.play({ volume: .4})
  console.log("YOU ARE AMPED!!!")
  coffee.disableBody(true, true)
  hasCoffee = true;
}
function updateScoreboard(letter) {
  //If player catches new color, reset score and set current color goal
  let color = letter.data
  if (color !== currentColor) {
    currentColor = color
    scoreboard = resetScoreboard()
  }

  // handle letters
  if (letter.name == "N") {
    scoreboard.N = color
  } else if (letter.name == "S") {
    if (scoreboard.S1 == null) {
      scoreboard.S1 = color
    } else {
      scoreboard.S2 = color
    }
  }

  //Push scoreboard to firebase
  updateDatabase(scoreboard)

  //Check win condition
  if (scoreboard.N !== null && scoreboard.S1 !== null && scoreboard.s2 !== null) {
    // win the game
    takePhoto();
  }
}


function resetScoreboard() {
  return {
    N: null,
    S1: null,
    S2: null
  }
};
