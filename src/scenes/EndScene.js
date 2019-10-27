import { CST } from "../CST";
import endBkg from "../assets/endGameBkg.png"

let background;

export class EndScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.END
    })
  }
  init() { }
  preload() {
    this.load.image('endBkg', endBkg);
  }
  create() {
    background = this.add.image(600, 400, 'endBkg')
      .setInteractive()
      .on('pointerdown', () => window.location.reload());
    console.log("End Scene Loaded Hit Enter to restart!")

  }
}