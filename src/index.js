import Phaser from 'phaser';

import { StartScene } from "./scenes/StartScene";
import { GameScene } from "./scenes/GameScene";
import { EndScene } from "./scenes/EndScene";

let game = new Phaser.Game({
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
  scene: [StartScene, GameScene, EndScene],
  pixelArt: true
});