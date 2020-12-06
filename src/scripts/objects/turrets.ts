import MainScene from "../scenes/mainScene"

export default class Turrets {

  static readonly TURRET_TEXTURE: string = 'turret'
  static readonly TURRET_ASSET: string = 'assets/img/quiltmonster.png'
  static readonly BULLET_TEXTURE: string = 'turret-bullet'
  static readonly BULLET_ASSET: string = 'assets/img/bullet7.png'
  static readonly MAX_HP: integer = 25
  static readonly TIME_BETWEEN_FIRING: integer = 800
  static readonly BULLET_LIFESPAN:integer = 2000
  static readonly BULLET_SPEED:integer = 50
  static readonly BULLET_DAMAGE:integer = 10

  turretGroup: Phaser.Physics.Arcade.Group
  turretBulletGroup: Phaser.Physics.Arcade.Group
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.turretGroup = scene.physics.add.group()
    this.turretBulletGroup = scene.physics.add.group({
        maxSize: 4000
      }
    )
  }

  public addTurrets() {
    for (let i:integer = 0; i < 40; i++) {
      // get x and y within random bounds
      let x: integer = Phaser.Math.RND.integerInRange(0, MainScene.CAMERA_BOUNDS_WIDTH)
      let y: integer = Phaser.Math.RND.integerInRange(0, MainScene.CAMERA_BOUNDS_HEIGHT)
      this.createTurret(x, y)
    }
  }
  
  public onTurretHit(turret: Phaser.GameObjects.GameObject, bulletDamage: integer) {
    let hp = turret.data.values.hp -= bulletDamage
    
    if (hp <= 0) {
      turret.destroy()
    }
  }

  public update(time:number, delta:number) {

    // fire active turrets
    this.turretGroup.children.entries.forEach(
      turret => {
        if (time > turret.data.values.lastFiredTime) {
          //fire
          this.fire(turret)
          turret.data.values.lastFiredTime = time + Turrets.TIME_BETWEEN_FIRING
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

  public fire(turret: Phaser.GameObjects.GameObject) {
    // origin is the top left of the image. need to offset it by half the width/heigh
    // FIXME use origin on the turret instead
    let x = turret.getData('body').x + 7
    let y = turret.getData('body').y + 7

    this.createBullet(x, y, 0, 100)
    this.createBullet(x, y, 100, 0)
    this.createBullet(x, y, 0, -100)
    this.createBullet(x, y, -100, 0)
  }

  onHit(bullet: Phaser.Physics.Arcade.Image) {
    bullet.setData('canDamage', false)
    bullet.setActive(false)
    bullet.setVisible(false)
  }

  createTurret(x:integer, y:integer): Phaser.Physics.Arcade.Image {
    let turret:Phaser.Physics.Arcade.Image = this.turretGroup
      .get(x, y, Turrets.TURRET_TEXTURE)
      .setData('onHit', this.onTurretHit)
      .setData('hp', Turrets.MAX_HP)
      .setData('lastFiredTime', 0)
      .setActive(true)
      .setVisible(true)
      .setDepth(50)

      turret.setData('body', turret.body)
      
    return turret
  }

  createBullet(
      x: integer, 
      y: integer, 
      velocityX: integer, 
      velocityY: integer):void { 
    this.turretBulletGroup
    .get(x, y, Turrets.BULLET_TEXTURE)
    .setActive(true)
    .setVisible(true)
    .setScale(.5)
    .setBlendMode(1)
    .setDepth(1)
    .setVelocity(velocityX, velocityY)
    .setData('lifespan', Turrets.BULLET_LIFESPAN)
    .setData('damage', Turrets.BULLET_DAMAGE)
    .setData('onHit', this.onHit)
    .setData('canDamage', true)
  }

}
