import PlayerMechBody from "./playerMechBody"

export default class PlayerMechFeet extends Phaser.Physics.Arcade.Sprite {

  static readonly TEXTURE: string = 'mech-feet'
  static readonly ASSET: string = 'assets/img/mechfeet.png'
  static readonly MAX_MECH_SPEED: integer = 50
  static readonly MECH_SPEED_CHANGE: integer = 5
  static readonly directionChangeDegrees: integer = 3
  mechSpeed: integer
  direction: integer
  physics: Phaser.Physics.Arcade. ArcadePhysics
  lastFlipped: number

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerMechFeet.TEXTURE)
    this.mechSpeed = 0
    this.direction = 0
    this.setAngle(this.direction)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.physics = scene.physics
    this.lastFlipped = 0
  }

  public static preloadImage(preloadScene: Phaser.Scene) {
    preloadScene.load.image(PlayerMechFeet.TEXTURE, PlayerMechFeet.ASSET)
  }

  public update(wKey: Phaser.Input.Keyboard.Key, aKey: Phaser.Input.Keyboard.Key, 
    sKey: Phaser.Input.Keyboard.Key, dKey: Phaser.Input.Keyboard.Key, time: number,
    playerMechBody:PlayerMechBody) {
    
    if (time > this.lastFlipped && this.mechSpeed > 0) {
      let flipperFactor = this.mechSpeed / PlayerMechFeet.MAX_MECH_SPEED
      this.lastFlipped = time + 200 - (100 * flipperFactor)
      this.flipY = !this.flipY
    } 

    if (!playerMechBody.getData('alive')) {
      if (this.mechSpeed > 0) {
        // come to a slow halt
        this.mechSpeed -= PlayerMechFeet.MECH_SPEED_CHANGE / 2
      }
      this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)

      return
    }
    
    if (aKey!.isDown) {
      this.direction -= PlayerMechFeet.directionChangeDegrees
      this.setAngle(this.direction)
    } else if (dKey!.isDown) {
      this.direction += PlayerMechFeet.directionChangeDegrees
      this.setAngle(this.direction)
    }

    if (wKey!.isDown) {
      if (this.mechSpeed < PlayerMechFeet.MAX_MECH_SPEED) {
        this.mechSpeed += PlayerMechFeet.MECH_SPEED_CHANGE

      }
    } else if (sKey!.isDown) {
     if (this.mechSpeed > 0) {
       this.mechSpeed -= PlayerMechFeet.MECH_SPEED_CHANGE 
     }
    }
    this.physics.velocityFromAngle(this.direction, this.mechSpeed, this.body.velocity)

  }

}
