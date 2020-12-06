import PlayerMechBody from "./playerMechBody"

export default class Hud {

  static readonly FONT_KEY = 'carrier_command'
  static readonly FONT_ASSET = 'assets/fonts/carrier_command.png'
  static readonly FONT_XML = 'assets/fonts/carrier_command.xml'

  text: string
  x: integer
  y: integer
  camera:Phaser.Cameras.Scene2D.Camera
  playerMechBody: PlayerMechBody
  turretsLeftText: Phaser.GameObjects.BitmapText
  hpText: Phaser.GameObjects.BitmapText
  helpText: Phaser.GameObjects.BitmapText

  constructor(scene: Phaser.Scene, camera:Phaser.Cameras.Scene2D.Camera, playerMechBody: PlayerMechBody) {
    this.x = 0
    this.y = 0
    this.camera = camera
    this.playerMechBody = playerMechBody

    this.turretsLeftText = scene.add.bitmapText(
      this.camera.centerX, this.camera.centerY, Hud.FONT_KEY,'', 12)
      .setDepth(100)
    this.hpText = scene.add.bitmapText(
      200, 400, Hud.FONT_KEY,'', 12)
      .setDepth(100)
    this.helpText = scene.add.bitmapText(
        200, 400, Hud.FONT_KEY,'', 12)
        .setDepth(100)

  }

  public update(turretsLeft: integer) {
    this.x = this.camera.scrollX
    this.y = this.camera.scrollY

    this.turretsLeftText.setText(`Turrets left: ${turretsLeft}`)
    this.turretsLeftText.setX(this.x + 280)
    this.turretsLeftText.setY(this.y + 190)

    this.hpText.setText(`HP: ${this.playerMechBody.getData('hp')}`)
    this.hpText.setX(this.x + 690)
    this.hpText.setY(this.y + 190)

    // this.helpText.setText(`camera scrollX ${this.camera.scrollX} \n| ${this.x}\nscrollY ${this.camera.scrollY} \n| ${this.y}`)
    this.helpText.setText('WASD to drive\nLeft, Right arrow keys to look\nSpace to shoot')
    this.helpText.setX(this.x + 280)
    this.helpText.setY(this.y + 500)
  }

  
}
