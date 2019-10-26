import { CST } from "../CST";

export class EndScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.END
    })
  }
  init() { }
  preload() { }
  create() {
    console.log("End Scene Loaded")
  }
}