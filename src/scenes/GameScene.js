import Phaser from 'phaser';
import { CST } from "../CST"
import { updateDatabase } from '../services/firebaseService';
import girl from "../assets/sprite-girl.png";
import { takePhoto } from '../services/sneakyPhotoService';
import coffeeImg from "../assets/items/coffee.png";
import bugImg from "../assets/items/bug.png";
import nBlueImg from "../assets/items/NBLUE.png";
import nRedImg from "../assets/items/NRED.png";
import nGreenImg from "../assets/items/NGREEN.png";
import sBlueImg from "../assets/items/SBLUE.png";
import sRedImg from "../assets/items/SRED.png";
import sGreenImg from "../assets/items/SGREEN.png";
import nGrayImg from "../assets/items/NGRAY.png";
import sGrayImg from "../assets/items/SGRAY.png";
import hackeryBkg from '../assets/background-01.png'

import lightningImg from '../assets/items/Lightning_Bolt.png'

import bugSfxFile from "../assets/sfx/bug.wav";
import coffeeSfxFile from "../assets/sfx/coffee.wav";
import letterSfxFile from "../assets/sfx/letter.wav";
import loseSfxFile from "../assets/sfx/lose.wav";
import winSfxFile from "../assets/sfx/win.wav";
import bgmusicFile from "../assets/sfx/theme.mp3";



let player;
let itemLoop = true;
let background;
let timer;
let letter;
let coffeeTimer;
let bugTimer;
let coffee;
let bug;
let cursors;
let currentColor;
let hasBug = false;
let bugCount = 0;
// let healthCounter = 3;
let healthBar;
let youWin = false;
let scoreboard = {
  N: null,
  S1: null,
  S2: null
};
let lightning;
let lightningTimer;
let bug1;
let bug2;
let bug3;
//sfx
let bgmusic;
let bugSfx;
let coffeeSfx;
let letterSfx;
let winSfx;
let loseSfx;
let currentSpeed = 300;
let n1Meter;
let n1BLUE;
let s1BLUE;
let s2BLUE;
let s1Meter;
let s2Meter;


export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.GAME
    })
  }

  init() {
    console.log("I got it");
  }

  preload() {
    // sfx
    this.load.audio('bgmusic', bgmusicFile);
    this.load.audio('bugSfx', bugSfxFile);
    this.load.audio('coffeeSfx', coffeeSfxFile);
    this.load.audio('loseSfx', loseSfxFile);
    this.load.audio('winSfx', winSfxFile);
    this.load.audio('letterSfx', letterSfxFile);
    // this.load.image('sky', sky);
    this.load.image('coffee', coffeeImg);
    this.load.image('bug', bugImg);
    this.load.image('nGrayImg', nGrayImg);
    this.load.image('sGrayImg', sGrayImg);
    this.load.image('lightning', lightningImg)
    this.load.image('NBLUE', nBlueImg);
    this.load.image('SBLUE', sBlueImg);
    this.load.image('NGREEN', nGreenImg);
    this.load.image('SGREEN', sGreenImg);
    this.load.image('NRED', nRedImg);
    this.load.image('SRED', sRedImg);
    this.load.image('hackeryBkg', hackeryBkg);
    this.load.spritesheet('girl',
      girl,
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
    console.log("Create called")

    // Ensure database has new game condition
    updateDatabase(scoreboard)

    // adding background
    background = this.add.image(600, 400, 'hackeryBkg');

    // player
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

    // BUG STATUS BAR

    bug1 = this.add.image(1000, 35, 'bug').setDepth(2);
    bug1.setVisible(false);
    bug2 = this.add.image(1075, 35, 'bug').setDepth(2);
    bug2.setVisible(false);
    bug3 = this.add.image(1150, 35, 'bug').setDepth(2);
    bug3.setVisible(false);

    // NSS SYMBOL BAR
    n1Meter = this.add.image(50, 35, 'nGrayImg')
      .setDepth(2);
    n1Meter.setVisible(true);
    n1BLUE = this.add.image(50, 35, 'NBLUE').setDepth(2);
    n1BLUE.setVisible(false);

    s1Meter = this.add.image(120, 35, 'sGrayImg');
    s1BLUE = this.add.image(120, 35, 'SBLUE').setDepth(2);
    s1BLUE.setVisible(false);

    s2Meter = this.add.image(190, 35, 'sGrayImg');
    s2BLUE = this.add.image(190, 35, 'SBLUE').setDepth(2);
    s2BLUE.setVisible(false);


    timer = this.time.addEvent({
      delay: 1200,                // ms
      callback: letterItemGenerator,
      callbackScope: this,
      loop: itemLoop
    });

    coffeeTimer = this.time.addEvent({
      delay: 4000,                // ms
      callback: coffeeItemGenerator,
      callbackScope: this,
      loop: itemLoop
    });

    bugTimer = this.time.addEvent({
      delay: 500,                // ms
      callback: bugItemGenerator,
      callbackScope: this,
      loop: itemLoop
    });
    lightningTimer = this.time.addEvent({
      delay: 2000,                // ms
      callback: lightningGenerator,
      callbackScope: this,
      loop: itemLoop
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
  }


  update() {


    cursors = this.input.keyboard.createCursorKeys();

    if (youWin) {
      setTimeout(() => {
        this.scene.switch(CST.SCENES.WIN)
      }, 2000);
    }

    if (bugCount < 3) {

      if (cursors.left.isDown) {
        player.setVelocityX(-currentSpeed);
        player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(currentSpeed);
        player.anims.play('right', true);
      }
      else {
        player.setVelocityX(0);
        player.anims.play('turn');
      }
    } else {
      // bugCount = 3;

      setTimeout(() => {
        this.scene.switch(CST.SCENES.END)
      }, 2000);
    }
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
    letterSfx.play({ volume: .4 })
    letter.disableBody(true, true)
    updateScoreboard(letter)
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
    bugSfx.play({ volume: .4 })
    console.log(`BUG >> ${bugCount}`)
    console.log("BUGGER - YOU'RE SO SLOW!!!")
    // hasBug = true;
    bugCount++;
    currentSpeed = 125;
    setTimeout(() => currentSpeed = 250, 3000);
    // healthCounter--
    bug.disableBody(true, true)
    if (bugCount === 1) {
      bug1.setVisible(true);
    } else if (bugCount === 2) {
      bug2.setVisible(true);
    } else if (bugCount === 3) {
      bug3.setVisible(true)
    }
  }
}

// make coffee speed up character for now
function coffeeEffect(coffee) {
  coffeeSfx.play({ volume: .4 })
  console.log("YOU ARE AMPED!!!")
  coffee.disableBody(true, true)
  // hasCoffee = true;
  currentSpeed = 1000;
  setTimeout(() => currentSpeed = 250, 4000);
}

//Lighnting Bolt
function lightningGenerator() {
  lightning = this.physics.add.image(Math.floor((Math.random() * 1200) + 1), 0, 'lightning');
  this.physics.add.overlap(lightning, player, lightningEffect)
}

function lightningEffect(lightning) {
  console.log('Power Up!')
  console.log(`lightning >> ${bugCount}`)
  if (bugCount > 0) {
    bugCount--
  }
  console.log(bugCount)
  lightning.disableBody(true, true)
  if (bugCount === 2) {
    bug3.setVisible(false);
  } else if (bugCount === 1) {
    bug2.setVisible(false);
  } else if (bugCount === 0) {
    itemLoop = false;
    bug1.setVisible(false)
  }
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
  updateScoreHud(scoreboard)

  //Check win condition
  if (scoreboard.N === scoreboard.S1 && scoreboard.S1 === scoreboard.S2) {
    bugCount = 0;
    youWin = true;
    console.log("Three Matches");
    takePhoto();
  }

  // if (scoreboard.N !== null && scoreboard.S1 !== null && scoreboard.S2 !== null) {
  //   // win the game
  //   console.log("YOU WIN!")
  // }
  function resetScoreboard() {
    return {
      N: null,
      S1: null,
      S2: null
    }
  };
}

function updateScoreHud(scoreboard) {
  if (scoreboard.N === null) {
    n1Meter.setVisible(true)
    n1BLUE.setVisible(false)
  }
  if (scoreboard.N === "BLUE") {
    n1Meter.setVisible(false)
    n1BLUE.setVisible(true)
  }
  if (scoreboard.S1 === "BLUE") {
    s1Meter.setVisible(false)
    s1BLUE.setVisible(true)
  }
  if (scoreboard.S2 === "BLUE") {
    s1Meter.setVisible(false)
    s1BLUE.setVisible(true)
  }
}