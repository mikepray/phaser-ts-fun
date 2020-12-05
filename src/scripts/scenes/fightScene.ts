import PhaserLogo from '../objects/phaserLogo'
import DebugText from '../objects/debugText'

export default class FightScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'FightScene' })
  }

  create() {
    new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new DebugText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: 36
      })
      .setOrigin(1, 0)
  }

  update() {
    this.fpsText.update()
  }
}
