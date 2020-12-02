import FpsText from '../objects/fpsText'
import PlayerMechBody from '../objects/playerMechBody'
import PlayerMechFeet from '../objects/playerMechFeet'
import MechBullet from '../objects/mechBullet'

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  playerMechBody: Phaser.Physics.Arcade.Sprite
  playerMechFeet: Phaser.Physics.Arcade.Sprite
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  playerMechBullets: Phaser.Physics.Arcade.Group
  fire: Phaser.Input.Keyboard.Key
  lastFired: number
  everyOtherGun: boolean // true for left, false for right
  wKey: Phaser.Input.Keyboard.Key
  aKey: Phaser.Input.Keyboard.Key
  sKey: Phaser.Input.Keyboard.Key
  dKey: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'MainScene' })
    this.everyOtherGun = true
  }

  create() {
    this.lastFired = 0
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1)
    this.playerMechBody = new PlayerMechBody(this, 300, 300)
    this.playerMechFeet = new PlayerMechFeet(this, 300, 300)
    this.playerMechBody.z = 1
    this.cameras.main.setBounds(0, 0, 1024, 2048)
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.playerMechFeet, true, 0.09, 0.09)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.playerMechBullets = this.physics.add.group({
      classType: MechBullet,
      maxSize: 30,
      runChildUpdate: true
    })

    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: 36
      })
      .setOrigin(1, 0)
  }

  update(time: number, delta: any) {
    this.fpsText.update()
    this.playerMechFeet.update(this.cursors)
    this.playerMechBody.update(this.playerMechFeet, this.aKey, this.dKey)

    if (this.fire.isDown && time > this.lastFired) {
      var bullet = this.playerMechBullets.get()
      if (bullet) {
        bullet.fire(this.playerMechBody, this.everyOtherGun)
        this.lastFired = time + 150
        this.everyOtherGun = !this.everyOtherGun
      }
    }
  }
}
