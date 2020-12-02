import PlayerMechFeet from '../objects/playerMechFeet'
export default class PlayerMechBody extends Phaser.Physics.Arcade.Sprite {

  maxMechSpeed: integer
  mechSpeedChange: integer
  mechSpeed: integer
  direction: integer
  directionChangeDegrees: integer
  scene2: Phaser.Scene
  physics: Phaser.Physics.Arcade. ArcadePhysics

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-mech')
    this.scene2 = scene
    this.maxMechSpeed = 50
    this.mechSpeed = 0
    this.direction = 0
    this.mechSpeedChange = 5
    this.directionChangeDegrees = 3
    this.setAngle(this.direction)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.physics = scene.physics

//    this.setCollideWorldBounds(true)
  }

  public update(mechFeet: PlayerMechFeet, aKey: Phaser.Input.Keyboard.Key, dKey: Phaser.Input.Keyboard.Key) {

    if (aKey!.isDown) {
      this.direction -= this.directionChangeDegrees
      this.setAngle(this.direction)
      //this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
    } else if (dKey!.isDown) {
      this.direction += this.directionChangeDegrees
      this.setAngle(this.direction)
      //this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
    }

    this.setX(mechFeet.x)
    this.setY(mechFeet.y)
    this.setAngle(mechFeet.angle + this.direction)
  }

}
