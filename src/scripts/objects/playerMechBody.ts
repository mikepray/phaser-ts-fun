import PlayerMechFeet from '../objects/playerMechFeet'
export default class PlayerMechBody extends Phaser.Physics.Arcade.Sprite {

  static readonly TEXTURE: string = 'player-mech'
  static readonly ASSET: string = 'assets/img/croppedmech.png'
  static readonly DIRECTION_CHANGE_DELTA_IN_DEGREES: integer = 3
  static readonly MAX_MECH_BODY_ROTATION: integer = 90
  physics: Phaser.Physics.Arcade.ArcadePhysics
  direction: integer

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerMechBody.TEXTURE)
    this.direction = 0
    this.setAngle(this.direction)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.physics = scene.physics
  }

  public update(mechFeet: PlayerMechFeet, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
 
    let adjAngle = this.angle - mechFeet.angle
      if (cursors!.left!.isDown && this.direction - PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES > -PlayerMechBody.MAX_MECH_BODY_ROTATION) {
        this.direction -= PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
      } if (cursors!.right!.isDown && this.direction + PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES < PlayerMechBody.MAX_MECH_BODY_ROTATION) {
        this.direction += PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
      }
   
    this.setX(mechFeet.x)
    this.setY(mechFeet.y)
    this.setAngle(mechFeet.angle + this.direction)
  }

}
