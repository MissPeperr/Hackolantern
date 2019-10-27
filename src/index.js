import Phaser from 'phaser';

import { StartScene } from "./scenes/StartScene";
import { GameScene } from "./scenes/GameScene";
import { EndScene } from "./scenes/EndScene";
import { WinScene } from "./scenes/WinScene";

let game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1200,
  height: 800,
  backgroundColor: '#474747',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [StartScene, GameScene, EndScene, WinScene],
  pixelArt: true
});
