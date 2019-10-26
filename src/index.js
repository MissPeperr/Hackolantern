import Phaser from 'phaser';
import { updateDatabase } from './services/firebaseService';
import sky from "./assets/sky.png";
import ground from "./assets/floor.png"
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
let background;
let cursors;

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

  cursors = this.input.keyboard.createCursorKeys();
}
function update() {
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