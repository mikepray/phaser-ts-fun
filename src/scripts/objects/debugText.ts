import PlayerMechBody from "./playerMechBody"
import PlayerMechFeet from "./playerMechFeet"

export default class DebugText extends Phaser.GameObjects.Text {
  text: string
  constructor(scene: Phaser.Scene) {
    super(scene, 300, 250, '', { color: 'black', fontSize: '12px' })
    scene.add.existing(this)
    this.setOrigin(0)
    this.setDepth(100)

  }

  public update(playerMechFeet: PlayerMechFeet, playerMechBody: PlayerMechBody) {
    //this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
    //this.setText(`body angle: ${playerMechBody.angle}, feet angle: ${playerMechFeet.angle}, adj angl: ${playerMechBody.angle - playerMechFeet.angle}`)
    //this.setText(`body direction: ${playerMechBody.direction}`)
    //this.setText(this.text)
    this.setX(playerMechBody.x - 100)
    this.setY(playerMechFeet.y + 100)
  }

  public setTexxt(text: string) { 
    this.text = text
  }
}
