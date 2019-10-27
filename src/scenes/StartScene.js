import { CST } from "../CST";
import startBkg from "../assets/startGameBkg.png"
import pumpkin from "../assets/pumpkin.png"

let background;
let pumpkinBtn

export class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.START
    })
  }
  init() { }
  preload() {
    this.load.image('startBkg', startBkg);
    this.load.image('pumpkin', pumpkin);
  }
  create() {
    background = this.add.image(600, 400, 'startBkg');
    pumpkinBtn = this.add.image(600, 400, 'pumpkin')
      .setInteractive()
      .on('pointerdown', () => this.scene.start(CST.SCENES.GAME, "Game Scene Loaded"));
    console.log("Start Scene Loaded")

    this.input.keyboard.on('keydown-' + 'SPACE', () => this.scene.start(CST.SCENES.GAME, "Game Scene Loaded"));
    console.log("End Scene Loaded Hit Enter to restart!")

  }
}