export default class PlayerMechFeet extends Phaser.Physics.Arcade.Sprite {

  maxMechSpeed: integer
  mechSpeedChange: integer
  mechSpeed: integer
  direction: integer
  directionChangeDegrees: integer
  scene2: Phaser.Scene
  physics: Phaser.Physics.Arcade. ArcadePhysics

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mech-feet')
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

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    if (cursors!.left!.isDown) {
      this.direction -= this.directionChangeDegrees
      this.setAngle(this.direction)
      this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
    } else if (cursors!.right!.isDown) {
      this.direction += this.directionChangeDegrees
      this.setAngle(this.direction)
      this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
    }

    if (cursors!.up!.isDown) {
      if (this.mechSpeed < this.maxMechSpeed) {
        this.mechSpeed += this.mechSpeedChange

        this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
      }
    } else if (cursors!.down!.isDown) {
     if (this.mechSpeed > 0) {
       this.mechSpeed -= this.mechSpeedChange 
     }
     this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)
    }
  }

}
