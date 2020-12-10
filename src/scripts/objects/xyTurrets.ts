import MainScene from "../scenes/mainScene"
import ExplosionAnims from "./explosionAnims"

// turrets that fire in vertical/horizontal
export default class XYTurrets {

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
  explosions: ExplosionAnims

  constructor(scene: Phaser.Scene, explosions: ExplosionAnims) {
    this.scene = scene
    this.turretGroup = scene.physics.add.group()
    this.turretBulletGroup = scene.physics.add.group({
        maxSize: 2000
      }
    )
    this.explosions = explosions
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
      turret.getData('explosions')
      .createExplosion(turret.data.values.body.x, turret.data.values.body.y, 
        ExplosionAnims.EXPLOSION_A, new Phaser.Math.Vector2(7, 7))
         .play(ExplosionAnims.EXPLOSION_A)
      turret.destroy()
    } else {
      let damageExplosion:Phaser.GameObjects.Sprite = turret.getData('explosions')
      .createExplosion(turret.data.values.body.x, turret.data.values.body.y, 
        ExplosionAnims.EXPLOSION_G, new Phaser.Math.Vector2(7, 7))
        
       damageExplosion.setScale(.34)
        .play(ExplosionAnims.EXPLOSION_G)
    }
  }

  public update(time:number, delta:number) {

    // fire active turrets
    this.turretGroup.children.entries.forEach(
      turret => {
        if (time > turret.data.values.lastFiredTime) {
          //fire
          this.fire(turret)
          turret.data.values.lastFiredTime = time + XYTurrets.TIME_BETWEEN_FIRING
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
      .get(x, y, XYTurrets.TURRET_TEXTURE)
      .setData('onHit', this.onTurretHit)
      .setData('hp', XYTurrets.MAX_HP)
      .setData('lastFiredTime', 0)
      .setActive(true)
      .setVisible(true)
      .setDepth(50)
      
    turret.setData('body', turret.body)

    // create explosion sprite 
    // turret.setData('explosion', 
    //   this.explosions.createExplosion(turret.body.x, turret.body.y, 
    //     ExplosionAnims.EXPLOSION_A, new Phaser.Math.Vector2(7, 7)))
      
    turret.setData('explosions', this.explosions)
    return turret
  }

  createBullet(
      x: integer, 
      y: integer, 
      velocityX: integer, 
      velocityY: integer):void { 
    this.turretBulletGroup
    .get(x, y, XYTurrets.BULLET_TEXTURE)
    .setActive(true)
    .setVisible(true)
    .setScale(.5)
    .setBlendMode(1)
    .setDepth(1)
    .setVelocity(velocityX, velocityY)
    .setData('lifespan', XYTurrets.BULLET_LIFESPAN)
    .setData('damage', XYTurrets.BULLET_DAMAGE)
    .setData('onHit', this.onHit)
    .setData('canDamage', true)
  }

}
