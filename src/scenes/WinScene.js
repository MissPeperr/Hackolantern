import { CST } from "../CST";
import youWinBkg from "../assets/youWinBkg.png"

let background;

export class WinScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.WIN
    })
  }
  init() { }
  preload() {
    this.load.image('youWinBkg', youWinBkg);
  }
  create() {
    background = this.add.image(600, 400, 'youWinBkg')
      .setInteractive()
      .on('pointerdown', () => window.location.reload());
    console.log("End Scene Loaded Hit Enter to restart!")
    this.input.keyboard.on('keydown-' + 'SPACE', function (event) { window.location.reload() });
    console.log("End Scene Loaded Hit Enter to restart!")
  }
}