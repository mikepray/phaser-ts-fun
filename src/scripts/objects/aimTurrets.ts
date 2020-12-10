import MainScene from "../scenes/mainScene"
import DebugText from "./debugText"
import PlayerMechBody from "./playerMechBody"

// turrets that aim at the player
export default class AimTurrets {

  static readonly TURRET_BASE_TEXTURE: string = 'aim-turret-base'
  static readonly TURRET_BASE_ASSET: string = 'assets/img/turret-base2.png'
  static readonly TURRET_TOP_TEXTURE: string = 'aim-turret-top'
  static readonly TURRET_TOP_ASSET: string = 'assets/img/turret-top.png'
  static readonly BULLET_TEXTURE: string = 'turret-bullet'
  // static readonly BULLET_ASSET: string = 'assets/img/bullet7.png'
  static readonly MAX_HP: integer = 25
  static readonly TIME_BETWEEN_FIRING: integer = 200
  static readonly BULLET_LIFESPAN:integer = 2000
  static readonly BULLET_SPEED:integer = 50
  static readonly BULLET_DAMAGE:integer = 10
  static readonly TURRET_TOP_RADIUS:integer = 7

  turretBaseGroup: Phaser.Physics.Arcade.Group
  turretTopGroup: Phaser.Physics.Arcade.Group
  turretBulletGroup: Phaser.Physics.Arcade.Group
  scene: Phaser.Scene
  debugText:DebugText

  constructor(scene: Phaser.Scene, debugText:DebugText) {
    this.scene = scene
    this.turretBaseGroup = scene.physics.add.group()
    this.turretTopGroup = scene.physics.add.group()
    this.turretBulletGroup = scene.physics.add.group({
        maxSize: 4000
      }
    )
    this.debugText = debugText
  }

  public addTurrets(playerMechBody: PlayerMechBody) {
    /*for (let i:integer = 0; i < 40; i++) {
      // get x and y within random bounds
      let x: integer = Phaser.Math.RND.integerInRange(0, MainScene.CAMERA_BOUNDS_WIDTH)
      let y: integer = Phaser.Math.RND.integerInRange(0, MainScene.CAMERA_BOUNDS_HEIGHT)
      this.createTurret(x, y)
    }*/
    this.createTurret(400, 400, playerMechBody)
  }
  
  public onTurretHit(turret: Phaser.GameObjects.GameObject, bulletDamage: integer) {
    let hp = turret.data.values.hp -= bulletDamage
    
    if (hp <= 0) {
      turret.destroy()
    }
  }

  public update(time:number, delta:number, playerMechBody: PlayerMechBody, debugText:DebugText) {
    // rotate turret to look at player
      this.turretTopGroup.children.entries.forEach(
      turretTop => {
          let angle = this.getAimedTurretTopAngle(turretTop)
          turretTop.data.values.setTurretTopAngle(turretTop, angle)
          if (time > turretTop.data.values.lastFiredTime) {
            //fire
            this.fire(turretTop, angle)
            turretTop.data.values.lastFiredTime = time + AimTurrets.TIME_BETWEEN_FIRING
          }
        }
    )

    // deactivate bullets to recycle them into the pool
    this.turretBulletGroup.children.entries.forEach(
      bullet => {
        bullet.data.values.lifespan -= delta
          if (bullet.data.values.lifespan <= 0) {
            bullet.setActive(false)
          }
      }
    )
  }

  public fire(turret: Phaser.GameObjects.GameObject, angle:number) {
    let position =  new Phaser.Math.Vector2()
    position.x = turret.getData('body').x + AimTurrets.TURRET_TOP_RADIUS
    position.y = turret.getData('body').y + AimTurrets.TURRET_TOP_RADIUS + 1
    let bulletSpawnPosition = this.getBulletSpawnPosition(position, angle)
    let velocity:Phaser.Math.Vector2 = new Phaser.Math.Vector2()
    turret.getData('velocityFromAngle')(angle, AimTurrets.BULLET_SPEED, velocity)
    this.createBullet(bulletSpawnPosition.x, bulletSpawnPosition.y, velocity.x, velocity.y)
  }

  onHit(bullet: Phaser.Physics.Arcade.Image) {
    bullet.setData('canDamage', false)
    bullet.setActive(false)
    bullet.setVisible(false)
  }

  createTurret(x:integer, y:integer, playerMechBody: PlayerMechBody): Phaser.Physics.Arcade.Image {
    let turretBase:Phaser.Physics.Arcade.Image = this.turretBaseGroup
      .get(x, y, AimTurrets.TURRET_BASE_TEXTURE)
      .setData('onHit', this.onTurretHit)
      .setData('hp', AimTurrets.MAX_HP)
      .setActive(true)
      .setVisible(true)
      .setDepth(50)

      turretBase.setData('body', turretBase.body)

    let turretTop:Phaser.Physics.Arcade.Image = this.turretTopGroup
      .get(x, y, AimTurrets.TURRET_TOP_TEXTURE)
      .setData('playerMechBody', playerMechBody)
      .setData('lastFiredTime', 0)
      .setActive(true)
      .setVisible(true)
      .setDepth(51)
      turretTop.setData('body', turretTop.body)
      turretTop.setData('setTurretTopAngle', this.setTurretTopAngle)
      turretTop.setData('velocityFromAngle', this.scene.physics.velocityFromAngle)
      turretTop.setData('debugText', this.debugText)

      return turretBase
  }

  getAimedTurretTopAngle(turretTop:Phaser.GameObjects.GameObject): number {
    let angle:number = Phaser.Math.Angle.Between(
      turretTop.getData('body').x,
      turretTop.getData('body').y,
      turretTop.getData('playerMechBody').x,
      turretTop.getData('playerMechBody').y
      )
      return angle / Math.PI * 180 // angle is in Math.PI to -Math.PI range
  }

  // creating the method with the parameter typed to the Sprite somehow tricks Phaser into 
  // letting us use the Sprite members.
  setTurretTopAngle(turretTop:Phaser.Physics.Arcade.Image, angle:number) {
    turretTop.setAngle(angle)
  }

  createBullet(
      x: integer, 
      y: integer, 
      velocityX: integer, 
      velocityY: integer):void { 
    this.turretBulletGroup
    .get(x, y, AimTurrets.BULLET_TEXTURE)
    .setActive(true)
    .setVisible(true)
    .setScale(.5)
    .setBlendMode(1)
    .setDepth(1)
    .setVelocity(velocityX, velocityY)
    .setData('lifespan', AimTurrets.BULLET_LIFESPAN)
    .setData('damage', AimTurrets.BULLET_DAMAGE)
    .setData('onHit', this.onHit)
    .setData('canDamage', true)
  }

  getBulletSpawnPosition(turretPosition:Phaser.Math.Vector2, angle:number): Phaser.Math.Vector2 {
    let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
    let rotation:number = Phaser.Math.DegToRad(angle)
    position.x = AimTurrets.TURRET_TOP_RADIUS * Math.cos(rotation) + turretPosition.x
    position.y = AimTurrets.TURRET_TOP_RADIUS * Math.sin(rotation) + turretPosition.y
    return position
}

}
