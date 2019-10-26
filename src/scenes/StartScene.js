import { CST } from "../CST";

export class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.START
    })
  }
  init() { }
  preload() { }
  create() {
    setTimeout(() => this.scene.start(CST.SCENES.GAME, "Game Scene Loaded"), 100);

    console.log("Start Scene Loaded")
  }
}