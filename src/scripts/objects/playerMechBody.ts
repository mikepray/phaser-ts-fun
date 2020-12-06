import PlayerMechFeet from '../objects/playerMechFeet'
import MainScene from '../scenes/mainScene'
import DebugText from './debugText'
import ScreenShaker from './screenShaker'
export default class PlayerMechBody extends Phaser.Physics.Arcade.Sprite {

  static readonly TEXTURE: string = 'player-mech'
  static readonly ASSET: string = 'assets/img/croppedmech.png'
  static readonly DIRECTION_CHANGE_DELTA_IN_DEGREES: integer = 3
  static readonly MAX_MECH_BODY_ROTATION: integer = 90
  static readonly MAX_HP: integer = 50
  physics: Phaser.Physics.Arcade.ArcadePhysics
  direction: integer
  debugText: DebugText
  screenShaker: ScreenShaker

  constructor(scene: Phaser.Scene, x: number, y: number, debugText: DebugText, screenShaker: ScreenShaker) {
    super(scene, x, y, PlayerMechBody.TEXTURE)
    this.direction = 0
    this.setAngle(this.direction)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.physics = scene.physics
    this.setData('hp', PlayerMechBody.MAX_HP)
    this.setData('onHit', this.onHit)
    this.debugText = debugText
    this.screenShaker = screenShaker
  }

  public update(mechFeet: PlayerMechFeet, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors!.left!.isDown && this.direction - PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES > -PlayerMechBody.MAX_MECH_BODY_ROTATION) {
      this.direction -= PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
    } if (cursors!.right!.isDown && this.direction + PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES < PlayerMechBody.MAX_MECH_BODY_ROTATION) {
      this.direction += PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
    }
   
    this.setX(mechFeet.x)
    this.setY(mechFeet.y)
    this.setAngle(mechFeet.angle + this.direction)

    if (this.getData('wasHit')) {
      this.screenShaker.minishake()
      this.setData('wasHit', false)
    }

  }

  public onHit(mech: PlayerMechBody, damage: integer, debugText:DebugText) {
    mech.data.values.hp -= damage
    mech.setData('wasHit', true)
  }

}
