import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import PlayerMech from '../objects/playerMech'

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  playerMech: Phaser.Physics.Arcade.Sprite
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1)
    this.playerMech = new PlayerMech(this, 300, 300)

    this.cameras.main.setBounds(0, 0, 1024, 2048)
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.playerMech, true, 0.09, 0.09)

    this.cursors = this.input.keyboard.createCursorKeys()


    this.fpsText = new FpsText(this)

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
    this.playerMech.update(this.cursors)
  }
}
